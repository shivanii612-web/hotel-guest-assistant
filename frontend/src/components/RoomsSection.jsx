import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { checkAvailability } from "../services/api";
import BookingModal from "./BookingModal";
import RoomDetailsModal from "./RoomDetailsModal";

const rooms = [
  {
    id: "standard",
    name: "Standard Room",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=85",
    description:
      "Cozy and elegant room with modern amenities for a comfortable stay.",
    guests: "2 Guests",
    bed: "King Bed",
    price: "₹3,000",
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=85",
    description:
      "Spacious room with garden or pool view, featuring premium amenities.",
    guests: "3 Guests",
    bed: "King Bed",
    price: "₹4,500",
  },
  {
    id: "family-suite",
    name: "Family Suite",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=85",
    description:
      "Perfect for families with extra space and comfortable facilities.",
    guests: "4 Guests",
    bed: "King Bed + Sofa Bed",
    price: "₹7,000",
  },
];

function RoomsSection() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);

  const [availability, setAvailability] = useState(null);
  const [searchSummary, setSearchSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const [detailsRoom, setDetailsRoom] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleOpenBooking = (room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const handleOpenDetails = (room) => {
    setDetailsRoom(room);
    setIsDetailsModalOpen(true);
  };

  const handleBookFromDetails = (room) => {
    setIsDetailsModalOpen(false);
    handleOpenBooking(room);
  };

  useEffect(() => {
    const handleCustomOpen = (e) => {
      const targetRoomId = e.detail?.roomId || "deluxe";
      const targetRoom = rooms.find((r) => r.id === targetRoomId) || rooms[1];
      handleOpenBooking(targetRoom);
    };

    window.addEventListener("prashiv-open-booking", handleCustomOpen);
    return () => {
      window.removeEventListener("prashiv-open-booking", handleCustomOpen);
    };
  }, []);

  const handleBookingSuccess = () => {
    if (checkIn && checkOut) {
      handleCheckAvailability();
    }
  };

  const handleCheckAvailability = async () => {
    if (loading) return;

    if (!checkIn || !checkOut) {
      toast.error("Please select both check-in and check-out dates.");
      return;
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (endDate <= startDate) {
      toast.error("Check-out date must be after check-in date.");
      return;
    }

    const adultCount = adults && Number(adults) > 0 ? Number(adults) : 2;

    try {
      setLoading(true);

      const data = await checkAvailability({
        checkIn,
        checkOut,
        adults: adultCount,
      });

      const returnedRooms = data.rooms || [];
      setAvailability(returnedRooms);
      setSearchSummary({
        checkIn,
        checkOut,
        adults: adultCount,
        rooms: returnedRooms,
      });
      toast.success("Availability checked successfully.");
    } catch (err) {
      setAvailability(null);
      setSearchSummary(null);
      const backendMessage =
        err.response?.data?.message ||
        "Unable to check room availability. Please try again.";
      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section rooms-section" id="rooms">
      <div className="section-heading">
        <div>
          <span className="eyebrow">STAY IN COMFORT</span>
          <h2>Rooms & Suites</h2>
          <p>Comfortable stays for every kind of traveler.</p>
        </div>

        <button
          className="text-btn"
          onClick={() => {
            document.querySelector(".rooms-grid")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        >
          View All Rooms →
        </button>
      </div>

      {/* Availability Search */}
      <div className="availability-search">
        <div>
          <label>Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>

        <div>
          <label>Check-out</label>
          <input
            type="date"
            min={checkIn || undefined}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        <div>
          <label>Adults</label>
          <input
            type="number"
            min="1"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
          />
        </div>

        <button
          className="primary-btn"
          onClick={handleCheckAvailability}
          disabled={loading}
          style={{
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Checking..." : "Check Availability"}
        </button>
      </div>



      {/* Prominent Availability Status Banner */}
      {searchSummary && (
        <div
          className="availability-banner"
          style={{
            background: "rgba(34, 197, 94, 0.12)",
            border: "1px solid rgba(34, 197, 94, 0.4)",
            color: "#22c55e",
            padding: "14px 20px",
            borderRadius: "10px",
            margin: "15px 0 25px",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span>
            ✓ Available rooms for {searchSummary.checkIn} to {searchSummary.checkOut} ({searchSummary.adults} {searchSummary.adults === 1 ? "Guest" : "Guests"}):
          </span>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {searchSummary.rooms.map((r) => (
              <span
                key={r.id}
                style={{
                  color: r.availableRooms > 0 ? "#22c55e" : "#ef4444",
                  fontWeight: "700",
                }}
              >
                {r.name}: {r.availableRooms > 0 ? `${r.availableRooms} available` : "Sold out"}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rooms-grid">
        {rooms.map((room) => {
          const availableRoom = availability
            ? availability.find((item) => item.id === room.id)
            : null;
          const availableCount = availableRoom
            ? availableRoom.availableRooms
            : 0;

          return (
            <div className="room-card" key={room.name}>
              <div className="room-image">
                <img src={room.image} alt={room.name} />
                <span className="room-tag">PRASHIV</span>
              </div>

              <div className="room-info">
                <h3>{room.name}</h3>

                <p>{room.description}</p>

                <div className="room-meta">
                  <span>♙ {room.guests}</span>
                  <span>▣ {room.bed}</span>
                </div>

                {availability !== null && (
                  <div
                    className="room-availability"
                    style={{
                      margin: "12px 0",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "700",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background:
                        availableCount > 0
                          ? "rgba(34, 197, 94, 0.15)"
                          : "rgba(239, 68, 68, 0.15)",
                      border:
                        availableCount > 0
                          ? "1px solid rgba(34, 197, 94, 0.45)"
                          : "1px solid rgba(239, 68, 68, 0.45)",
                      color: availableCount > 0 ? "#22c55e" : "#ef4444",
                    }}
                  >
                    <span>{availableCount > 0 ? "●" : "○"}</span>
                    <span>
                      {availableCount > 0
                        ? `${availableCount} room(s) available`
                        : "No rooms available"}
                    </span>
                  </div>
                )}

                <div className="room-bottom">
                  <div>
                    <strong>{room.price}</strong>
                    <small>/ night</small>
                  </div>

                  <div className="room-actions" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button
                      type="button"
                      className="view-details-btn"
                      onClick={() => handleOpenDetails(room)}
                      style={{
                        background: "transparent",
                        color: "inherit",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      View Details →
                    </button>

                    <button
                      className="primary-btn"
                      style={{
                        padding: "10px 18px",
                        fontSize: "14px",
                        fontWeight: "700",
                        borderRadius: "8px",
                        opacity: availability !== null && availableCount <= 0 ? 0.5 : 1,
                        cursor: availability !== null && availableCount <= 0 ? "not-allowed" : "pointer",
                      }}
                      disabled={availability !== null && availableCount <= 0}
                      onClick={() => handleOpenBooking(room)}
                    >
                      {availability !== null && availableCount <= 0 ? "Sold Out" : "Book Now"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reservation & Razorpay Checkout Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        room={selectedRoom}
        initialSearch={{
          checkIn,
          checkOut,
          adults,
        }}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Room Details & Amenities Modal */}
      <RoomDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        room={detailsRoom}
        onBookNow={handleBookFromDetails}
        isAvailable={
          availability === null ||
          !detailsRoom ||
          Boolean(
            (availability.find((item) => item.id === detailsRoom.id)?.availableRooms ?? 1) > 0
          )
        }
      />
    </section>
  );
}

export default RoomsSection;
