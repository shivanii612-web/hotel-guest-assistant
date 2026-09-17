import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Calendar, Users, Coffee, CreditCard, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { createPaymentOrder, verifyPayment } from "../services/api";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const ALL_ROOMS = [
  { id: "standard", name: "Standard Room", pricePerNight: 3000, capacity: 2 },
  { id: "deluxe", name: "Deluxe Room", pricePerNight: 4500, capacity: 3 },
  { id: "family-suite", name: "Family Suite", pricePerNight: 7000, capacity: 4 },
];

function BookingModal({ isOpen, onClose, room, initialSearch, onBookingSuccess }) {
  const [activeRoom, setActiveRoom] = useState(room || ALL_ROOMS[1]);
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [breakfastIncluded, setBreakfastIncluded] = useState(false);

  const [loading, setLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Initialize or reset defaults when modal opens or selected room/search changes
  useEffect(() => {
    if (isOpen) {
      setLoading(false);
      setProcessingStatus("");
      setConfirmedBooking(null);
      if (room) {
        setActiveRoom(room);
      } else {
        setActiveRoom(ALL_ROOMS[1]);
      }
      if (initialSearch?.checkIn) setCheckIn(initialSearch.checkIn);
      if (initialSearch?.checkOut) setCheckOut(initialSearch.checkOut);
      if (initialSearch?.adults) setAdults(Number(initialSearch.adults));
      setRooms(1);
      setBreakfastIncluded(false);
    }
  }, [isOpen, initialSearch, room]);

  if (!isOpen) return null;

  const currentRoom = activeRoom || room || ALL_ROOMS[1];

  // Pricing calculations
  const pricePerNight = currentRoom.pricePerNight || (currentRoom.price ? parseInt(String(currentRoom.price).replace(/[^0-9]/g, "")) : 3000);
  let nights = 0;
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (end > start) {
      nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }
  }

  const roomTotal = nights > 0 ? pricePerNight * nights * Number(rooms || 1) : 0;
  const breakfastTotal = (breakfastIncluded && nights > 0) ? 500 * Number(adults || 1) * nights : 0;
  const grandTotal = roomTotal + breakfastTotal;

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    if (loading || Boolean(processingStatus)) return;

    // Form validations
    if (!guestName || !guestName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!email || !email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!phone || !phone.trim() || phone.trim().length < 8) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    if (!currentRoom || !currentRoom.id) {
      toast.error("Please select a room.");
      return;
    }
    if (!checkIn || !checkOut) {
      toast.error("Please select your check-in and check-out dates.");
      return;
    }
    if (nights <= 0) {
      toast.error("Check-out date must be after check-in date.");
      return;
    }
    if (!adults || Number(adults) < 1) {
      toast.error("Please enter at least 1 adult.");
      return;
    }
    if (!rooms || Number(rooms) < 1) {
      toast.error("Please enter at least 1 room.");
      return;
    }

    try {
      setLoading(true);
      setProcessingStatus("Preparing Payment...");

      // 1. Ensure Razorpay checkout script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Unable to prepare payment. Please try again.");
        return;
      }

      // 2. Call backend to validate capacity, check live availability, and create Razorpay Order
      const payload = {
        guestName: guestName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        roomType: currentRoom.id,
        checkIn,
        checkOut,
        adults: Number(adults),
        rooms: Number(rooms),
        breakfastIncluded: Boolean(breakfastIncluded),
      };

      const orderData = await createPaymentOrder(payload);

      if (!orderData || !orderData.success) {
        toast.error(orderData?.message || "Unable to prepare payment. Please try again.");
        return;
      }

      // 3. Configure Razorpay options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "PRASHIV HOTEL & RESORT",
        description: `${currentRoom.name} Stay (${nights} ${nights === 1 ? "night" : "nights"})`,
        order_id: orderData.orderId,
        prefill: {
          name: guestName,
          email: email,
          contact: phone,
        },
        theme: {
          color: "#ff6a00",
        },
        handler: async (response) => {
          try {
            setLoading(true);
            setProcessingStatus("Verifying payment...");
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              ...payload,
            };

            const verifyRes = await verifyPayment(verifyPayload);

            if (verifyRes && verifyRes.success && verifyRes.booking) {
              setProcessingStatus("Confirming your booking...");
              await new Promise((resolve) => setTimeout(resolve, 500));
              setConfirmedBooking(verifyRes.booking);
              toast.success("Booking confirmed successfully!");
              if (onBookingSuccess) {
                onBookingSuccess(verifyRes.booking);
              }
            } else {
              toast.error(
                verifyRes?.message ||
                  "Payment verification failed. Your room has not been booked."
              );
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error(
              err.response?.data?.message ||
                "Payment verification failed. Your room has not been booked."
            );
          } finally {
            setLoading(false);
            setProcessingStatus("");
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setProcessingStatus("");
            toast.error("Payment was not completed. Your room has not been booked.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setLoading(false);
        setProcessingStatus("");
        toast.error("Payment was not completed. Your room has not been booked.");
      });

      rzp.open();
    } catch (err) {
      console.error("Booking initiation error:", err);
      toast.error(
        err.response?.data?.message ||
          "Unable to prepare payment. Please try again."
      );
    } finally {
      setLoading(false);
      setProcessingStatus("");
    }
  };

  return (
    <div
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
        if (e.target === e.currentTarget && !loading && !processingStatus) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: "#141414",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "92vh",
          overflowY: "auto",
          color: "#ffffff",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span
              style={{
                color: "#ff6a00",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              PRASHIV HOTEL RESERVATION
            </span>
            <h3
              style={{
                fontSize: "20px",
                margin: "4px 0 0",
                fontWeight: "700",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {confirmedBooking ? "Booking Confirmed" : `Book ${currentRoom.name}`}
            </h3>
          </div>

          <button
            onClick={onClose}
            disabled={loading || Boolean(processingStatus)}
            style={{
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "grid",
              placeItems: "center",
              cursor: (loading || Boolean(processingStatus)) ? "not-allowed" : "pointer",
              opacity: (loading || Boolean(processingStatus)) ? 0.5 : 1,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "24px" }}>
          {/* Confirmed State */}
          {confirmedBooking ? (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(34, 197, 94, 0.15)",
                  border: "2px solid #22c55e",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 16px",
                  color: "#22c55e",
                }}
              >
                <CheckCircle size={36} />
              </div>

              <h2
                style={{
                  color: "#22c55e",
                  fontSize: "24px",
                  fontWeight: "700",
                  marginBottom: "6px",
                }}
              >
                BOOKING CONFIRMED!
              </h2>

              <p style={{ color: "#a5a5a5", fontSize: "14px", marginBottom: "20px" }}>
                Thank you, {confirmedBooking.guestName}. Your reservation at PRASHIV is successfully secured.
              </p>

              {/* Confirmation Details Card */}
              <div
                style={{
                  background: "#1a1a1a",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "12px",
                  padding: "18px 20px",
                  textAlign: "left",
                  fontSize: "14px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "10px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    marginBottom: "10px",
                  }}
                >
                  <span style={{ color: "#a5a5a5" }}>Booking ID:</span>
                  <span style={{ fontWeight: "700", color: "#ff6a00", fontFamily: "monospace" }}>
                    {confirmedBooking.bookingId || confirmedBooking._id}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "10px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    marginBottom: "10px",
                  }}
                >
                  <span style={{ color: "#a5a5a5" }}>Payment ID:</span>
                  <span style={{ fontWeight: "600", fontFamily: "monospace", color: "#22c55e" }}>
                    {confirmedBooking.razorpayPaymentId}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "10px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    marginBottom: "10px",
                  }}
                >
                  <span style={{ color: "#a5a5a5" }}>Room:</span>
                  <span style={{ fontWeight: "600" }}>
                    {confirmedBooking.roomName || room.name} ({confirmedBooking.rooms} {confirmedBooking.rooms === 1 ? "room" : "rooms"})
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "10px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    marginBottom: "10px",
                  }}
                >
                  <span style={{ color: "#a5a5a5" }}>Stay Dates:</span>
                  <span style={{ fontWeight: "600" }}>
                    {new Date(confirmedBooking.checkIn).toLocaleDateString()} – {new Date(confirmedBooking.checkOut).toLocaleDateString()} ({confirmedBooking.nights} nights)
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "10px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    marginBottom: "10px",
                  }}
                >
                  <span style={{ color: "#a5a5a5" }}>Guests:</span>
                  <span style={{ fontWeight: "600" }}>{confirmedBooking.adults} Adults</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "10px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    marginBottom: "10px",
                  }}
                >
                  <span style={{ color: "#a5a5a5" }}>Breakfast:</span>
                  <span style={{ fontWeight: "600", color: confirmedBooking.breakfastIncluded ? "#22c55e" : "#a5a5a5" }}>
                    {confirmedBooking.breakfastIncluded ? "Included (₹500/guest/night)" : "Not Included"}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "6px",
                  }}
                >
                  <span style={{ color: "#ffffff", fontWeight: "700" }}>Total Paid:</span>
                  <span style={{ fontWeight: "700", color: "#ff6a00", fontSize: "16px" }}>
                    ₹{confirmedBooking.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                className="primary-btn"
                onClick={onClose}
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                Done
              </button>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleProceedToPayment}>
              {/* Selected Room Selector */}
              <div
                style={{
                  background: "rgba(255, 106, 0, 0.08)",
                  border: "1px solid rgba(255, 106, 0, 0.3)",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#ff6a00", letterSpacing: "1px" }}>
                    ROOM SELECTION
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#22c55e" }}>
                    ₹{pricePerNight.toLocaleString()} / night
                  </span>
                </div>

                <select
                  value={currentRoom.id}
                  onChange={(e) => {
                    const found = ALL_ROOMS.find((r) => r.id === e.target.value);
                    if (found) setActiveRoom(found);
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#191919",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "600",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="standard">Standard Room — ₹3,000 / night (Up to 2 Guests)</option>
                  <option value="deluxe">Deluxe Room — ₹4,500 / night (Up to 3 Guests)</option>
                  <option value="family-suite">Family Suite — ₹7,000 / night (Up to 4 Guests)</option>
                </select>
              </div>

              {/* Guest Details */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#a5a5a5",
                    marginBottom: "6px",
                  }}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shiva Prasad"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    background: "#1f1f1f",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "14px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#a5a5a5",
                      marginBottom: "6px",
                    }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="guest@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: "#1f1f1f",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#a5a5a5",
                      marginBottom: "6px",
                    }}
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: "#1f1f1f",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Dates & Counts */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "14px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#a5a5a5",
                      marginBottom: "6px",
                    }}
                  >
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: "#1f1f1f",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#a5a5a5",
                      marginBottom: "6px",
                    }}
                  >
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={checkIn || undefined}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: "#1f1f1f",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "14px",
                  marginBottom: "18px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#a5a5a5",
                      marginBottom: "6px",
                    }}
                  >
                    Adults *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: "#1f1f1f",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#a5a5a5",
                      marginBottom: "6px",
                    }}
                  >
                    Rooms *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: "#1f1f1f",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Breakfast Add-on */}
              <div
                style={{
                  background: "#191919",
                  border: breakfastIncluded ? "1px solid #ff6a00" : "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
                onClick={() => setBreakfastIncluded(!breakfastIncluded)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Coffee size={22} color={breakfastIncluded ? "#ff6a00" : "#a5a5a5"} />
                  <div>
                    <h5 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
                      Add Breakfast Buffet
                    </h5>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#a5a5a5" }}>
                      ₹500 per adult per night
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={breakfastIncluded}
                  onChange={(e) => setBreakfastIncluded(e.target.checked)}
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "#ff6a00",
                    cursor: "pointer",
                  }}
                />
              </div>

              {/* Price Breakdown */}
              <div
                style={{
                  background: "#1a1a1a",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "20px",
                  fontSize: "13px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ color: "#a5a5a5" }}>
                    Room ({nights > 0 ? `${nights} night${nights > 1 ? "s" : ""}` : "0 nights"} × {rooms} room{rooms > 1 ? "s" : ""})
                  </span>
                  <span>₹{roomTotal.toLocaleString()}</span>
                </div>

                {breakfastIncluded && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#a5a5a5" }}>
                      Breakfast ({adults} adult{adults > 1 ? "s" : ""} × {nights} night{nights > 1 ? "s" : ""})
                    </span>
                    <span>₹{breakfastTotal.toLocaleString()}</span>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "10px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                    fontWeight: "700",
                    fontSize: "15px",
                  }}
                >
                  <span>Total Amount</span>
                  <span style={{ color: "#ff6a00", fontSize: "17px" }}>
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Processing Status Banner */}
              {processingStatus && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    background: "rgba(255, 106, 0, 0.12)",
                    border: "1px solid rgba(255, 106, 0, 0.4)",
                    color: "#ff6a00",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    marginBottom: "18px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "16px",
                      height: "16px",
                      border: "2px solid #ff6a00",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <span>{processingStatus}</span>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                className="primary-btn"
                disabled={loading || Boolean(processingStatus)}
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "15px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  opacity: loading || Boolean(processingStatus) ? 0.7 : 1,
                  cursor: loading || Boolean(processingStatus) ? "not-allowed" : "pointer",
                }}
              >
                <CreditCard size={18} />
                {processingStatus || `Pay ₹${grandTotal.toLocaleString()} with Razorpay`}
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  marginTop: "12px",
                  fontSize: "12px",
                  color: "#a5a5a5",
                }}
              >
                <ShieldCheck size={14} color="#22c55e" />
                <span>Secured by Razorpay Test Payment Gateway</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingModal;
