import { X, Users, BedDouble, Maximize2, Eye, Check, Calendar } from "lucide-react";
import hotelData from "../../../backend/data/hotelData.json";

function RoomDetailsModal({ isOpen, onClose, room, onBookNow, isAvailable = true }) {
  if (!isOpen || !room) return null;

  // Find rich room details from hotelData.json if available
  const dataRooms = hotelData.rooms || [];
  const roomData = dataRooms.find((r) => r.id === room.id) || {};

  const roomName = room.name || roomData.name || "Room Details";
  const roomDescription = room.description || roomData.description || "";
  const roomCapacity = roomData.capacity || (room.guests ? parseInt(room.guests) : 2);
  const roomBed = roomData.bedType || room.bed || "King Bed";
  const roomPrice = room.price || (roomData.pricePerNight ? `₹${roomData.pricePerNight.toLocaleString()}` : "₹3,000");
  const roomSize = roomData.size || "280 sq ft";
  const roomView = roomData.view || "City View";
  const roomImage = room.image || "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=85";
  const roomAmenities = roomData.amenities || [
    "Free Wi-Fi",
    "Air conditioning",
    "Smart TV",
    "Work desk",
    "Attached bathroom",
    "Complimentary toiletries",
    "Hair dryer",
    "Electric kettle",
    "Wardrobe",
  ];

  return (
    <div
      className="room-details-backdrop"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="room-details-container"
        style={{
          backgroundColor: "#141414",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "620px",
          maxHeight: "92vh",
          overflowY: "auto",
          color: "#ffffff",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Modal Header */}
        <div
          className="room-details-header"
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            background: "#161616",
          }}
        >
          <div>
            <span
              style={{
                color: "#ff6a00",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              ROOM DETAILS & AMENITIES
            </span>
            <h3
              style={{
                fontSize: "22px",
                margin: "4px 0 0",
                fontWeight: "700",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {roomName}
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close room details"
            style={{
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              color: "#ffffff",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="room-details-body" style={{ padding: "20px 24px" }}>
          {/* Room Image */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "clamp(180px, 28vh, 250px)",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "18px",
              backgroundColor: "#0a0a0a",
            }}
          >
            <img
              src={roomImage}
              alt={roomName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                background: "rgba(0, 0, 0, 0.75)",
                color: "#ff6a00",
                padding: "6px 10px",
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "1.5px",
                borderRadius: "4px",
                border: "1px solid rgba(255, 106, 0, 0.3)",
              }}
            >
              PRASHIV LUXURY
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "12px",
                right: "12px",
                background: "rgba(0, 0, 0, 0.8)",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                display: "flex",
                alignItems: "baseline",
                gap: "4px",
              }}
            >
              <strong style={{ color: "#ff6a00", fontSize: "16px" }}>{roomPrice}</strong>
              <small style={{ color: "#a5a5a5", fontSize: "11px" }}>/ night</small>
            </div>
          </div>

          {/* Description */}
          <p
            style={{
              color: "#c2c2c2",
              fontSize: "14px",
              lineHeight: "1.6",
              margin: "0 0 20px",
            }}
          >
            {roomDescription}
          </p>

          {/* Quick Specifications Grid */}
          <div
            className="room-specs-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "10px",
              marginBottom: "22px",
            }}
          >
            <div
              style={{
                background: "#1a1a1a",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Users size={18} color="#ff6a00" style={{ flexShrink: 0 }} />
              <div>
                <small style={{ display: "block", color: "#888888", fontSize: "10px", textTransform: "uppercase" }}>
                  Capacity
                </small>
                <strong style={{ fontSize: "13px", color: "#ffffff" }}>
                  {roomCapacity} Guests
                </strong>
              </div>
            </div>

            <div
              style={{
                background: "#1a1a1a",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <BedDouble size={18} color="#ff6a00" style={{ flexShrink: 0 }} />
              <div>
                <small style={{ display: "block", color: "#888888", fontSize: "10px", textTransform: "uppercase" }}>
                  Bed Type
                </small>
                <strong style={{ fontSize: "13px", color: "#ffffff" }}>
                  {roomBed}
                </strong>
              </div>
            </div>

            <div
              style={{
                background: "#1a1a1a",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Maximize2 size={18} color="#ff6a00" style={{ flexShrink: 0 }} />
              <div>
                <small style={{ display: "block", color: "#888888", fontSize: "10px", textTransform: "uppercase" }}>
                  Room Size
                </small>
                <strong style={{ fontSize: "13px", color: "#ffffff" }}>
                  {roomSize}
                </strong>
              </div>
            </div>

            <div
              style={{
                background: "#1a1a1a",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Eye size={18} color="#ff6a00" style={{ flexShrink: 0 }} />
              <div>
                <small style={{ display: "block", color: "#888888", fontSize: "10px", textTransform: "uppercase" }}>
                  View
                </small>
                <strong style={{ fontSize: "13px", color: "#ffffff" }}>
                  {roomView}
                </strong>
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div>
            <h4
              style={{
                fontSize: "14px",
                fontWeight: "700",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                color: "#ff6a00",
                margin: "0 0 12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Available Room Amenities
            </h4>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "8px",
              }}
            >
              {roomAmenities.map((amenity, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#191919",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    color: "#e5e7eb",
                  }}
                >
                  <span
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: "rgba(34, 197, 94, 0.15)",
                      display: "grid",
                      placeItems: "center",
                      color: "#22c55e",
                      flexShrink: 0,
                    }}
                  >
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div
          className="room-details-footer"
          style={{
            padding: "16px 24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            background: "#161616",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            className="secondary-btn"
            onClick={onClose}
            style={{
              padding: "10px 18px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ← Back to Rooms
          </button>

          <button
            type="button"
            className="primary-btn"
            disabled={!isAvailable}
            onClick={() => {
              if (onBookNow) onBookNow(room);
            }}
            style={{
              padding: "11px 22px",
              fontSize: "14px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: !isAvailable ? 0.5 : 1,
              cursor: !isAvailable ? "not-allowed" : "pointer",
            }}
          >
            <Calendar size={16} />
            {!isAvailable ? "Sold Out" : `Book ${roomName} (${roomPrice}/night)`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomDetailsModal;
