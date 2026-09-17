const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const hotelData = require("../data/hotelData.json");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * POST /api/payments/create-order
 * Validates inputs, verifies room capacity & availability, calculates price, and creates Razorpay Order.
 */
const createPaymentOrder = async (req, res) => {
  try {
    const {
      guestName,
      email,
      phone,
      roomType,
      checkIn,
      checkOut,
      adults,
      rooms = 1,
      breakfastIncluded = false,
    } = req.body;

    // 1. Basic validation
    if (
      !guestName ||
      !email ||
      !phone ||
      !roomType ||
      !checkIn ||
      !checkOut ||
      !adults
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required details: Name, Email, Phone, Room Type, Dates, and Adults.",
      });
    }

    // 2. Room lookup & normalization
    const room = hotelData.rooms.find(
      (r) =>
        r.id.toLowerCase() === String(roomType).toLowerCase() ||
        r.name.toLowerCase() === String(roomType).toLowerCase()
    );

    if (!room) {
      return res.status(400).json({
        success: false,
        message: "Invalid room type selected.",
      });
    }

    // 3. Date validation
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid check-in or check-out date.",
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date.",
      });
    }

    // 4. Numbers validation
    const adultCount = Number(adults);
    const roomCount = Number(rooms);

    if (!Number.isInteger(adultCount) || adultCount < 1) {
      return res.status(400).json({
        success: false,
        message: "Adults count must be at least 1.",
      });
    }

    if (!Number.isInteger(roomCount) || roomCount < 1) {
      return res.status(400).json({
        success: false,
        message: "Rooms count must be at least 1.",
      });
    }

    // 5. Room capacity check
    const totalCapacity = room.capacity * roomCount;
    if (adultCount > totalCapacity) {
      return res.status(400).json({
        success: false,
        message: `Capacity exceeded: ${room.name} accommodates up to ${totalCapacity} adults for ${roomCount} room(s).`,
      });
    }

    // 6. Live Availability check against MongoDB
    const overlappingBookings = await Booking.find({
      roomType: room.id,
      paymentStatus: { $ne: "failed" },
      checkIn: { $lt: endDate },
      checkOut: { $gt: startDate },
    });

    const bookedRooms = overlappingBookings.reduce(
      (sum, b) => sum + (b.rooms || 1),
      0
    );

    const totalInventory = hotelData.roomInventory[room.id] || 0;
    const availableRooms = totalInventory - bookedRooms;

    if (roomCount > availableRooms) {
      return res.status(400).json({
        success: false,
        message: availableRooms > 0
          ? `Only ${availableRooms} ${room.name} room(s) available for the selected dates.`
          : `No ${room.name} rooms available for the selected dates.`,
      });
    }

    // 7. Calculate Pricing (Backend as single source of truth)
    const msPerDay = 1000 * 60 * 60 * 24;
    const nights = Math.ceil((endDate - startDate) / msPerDay);
    const roomAmount = room.pricePerNight * nights * roomCount;

    const breakfastPricePerAdult =
      hotelData.dining?.breakfastOption?.pricePerAdultPerNight || 500;
    const breakfastAmount = breakfastIncluded
      ? breakfastPricePerAdult * adultCount * nights
      : 0;

    const totalAmount = roomAmount + breakfastAmount;
    const amountInPaise = Math.round(totalAmount * 100);

    // 8. Create Razorpay Test Order
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now().toString().slice(-8)}`,
      notes: {
        roomType: room.id,
        roomName: room.name,
        guestName,
        email,
        nights: String(nights),
        rooms: String(roomCount),
        adults: String(adultCount),
      },
    };

    const order = await razorpay.orders.create(options);

    // Return order details (NEVER return RAZORPAY_KEY_SECRET)
    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      breakdown: {
        roomType: room.id,
        roomName: room.name,
        pricePerNight: room.pricePerNight,
        nights,
        roomCount,
        roomAmount,
        adultCount,
        breakfastIncluded: Boolean(breakfastIncluded),
        breakfastPricePerAdult,
        breakfastAmount,
        totalAmount,
      },
    });
  } catch (error) {
    console.error("Payment Order Creation Error:", error);
    res.status(500).json({
      success: false,
      message: error?.error?.description || error.message || "Failed to initialize payment order.",
    });
  }
};

/**
 * POST /api/payments/verify
 * Validates HMAC SHA256 signature, verifies availability, and saves booking into MongoDB.
 */
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      guestName,
      email,
      phone,
      roomType,
      checkIn,
      checkOut,
      adults,
      rooms = 1,
      breakfastIncluded = false,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Missing payment credentials.",
      });
    }

    // 1. Verify HMAC SHA256 signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature. Payment verification failed.",
      });
    }

    // 2. Check if booking with this payment ID already exists (idempotency)
    const existing = await Booking.findOne({ razorpayPaymentId: razorpay_payment_id });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Booking already verified and confirmed.",
        booking: existing,
      });
    }

    // 3. Room normalization & validation
    const room = hotelData.rooms.find(
      (r) =>
        r.id.toLowerCase() === String(roomType).toLowerCase() ||
        r.name.toLowerCase() === String(roomType).toLowerCase()
    );

    if (!room) {
      return res.status(400).json({
        success: false,
        message: "Invalid room type.",
      });
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const adultCount = Number(adults) || 1;
    const roomCount = Number(rooms) || 1;

    // 4. Double check availability
    const overlappingBookings = await Booking.find({
      roomType: room.id,
      paymentStatus: { $ne: "failed" },
      checkIn: { $lt: endDate },
      checkOut: { $gt: startDate },
    });

    const bookedRooms = overlappingBookings.reduce(
      (sum, b) => sum + (b.rooms || 1),
      0
    );

    const totalInventory = hotelData.roomInventory[room.id] || 0;
    if (roomCount > totalInventory - bookedRooms) {
      return res.status(400).json({
        success: false,
        message: "Unfortunately, room availability changed before completion.",
      });
    }

    // 5. Calculate amounts
    const msPerDay = 1000 * 60 * 60 * 24;
    const nights = Math.ceil((endDate - startDate) / msPerDay);
    const roomAmount = room.pricePerNight * nights * roomCount;
    const breakfastPricePerAdult =
      hotelData.dining?.breakfastOption?.pricePerAdultPerNight || 500;
    const breakfastAmount = breakfastIncluded
      ? breakfastPricePerAdult * adultCount * nights
      : 0;
    const totalAmount = roomAmount + breakfastAmount;

    // 6. Save confirmed booking to MongoDB
    const booking = await Booking.create({
      guestName,
      email,
      phone,
      roomType: room.id,
      checkIn: startDate,
      checkOut: endDate,
      adults: adultCount,
      rooms: roomCount,
      breakfastIncluded: Boolean(breakfastIncluded),
      roomAmount,
      breakfastAmount,
      totalAmount,
      paymentStatus: "paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully.",
      booking: {
        _id: booking._id,
        bookingId: booking._id,
        guestName: booking.guestName,
        email: booking.email,
        phone: booking.phone,
        roomType: booking.roomType,
        roomName: room.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        adults: booking.adults,
        rooms: booking.rooms,
        breakfastIncluded: booking.breakfastIncluded,
        nights,
        roomAmount: booking.roomAmount,
        breakfastAmount: booking.breakfastAmount,
        totalAmount: booking.totalAmount,
        paymentStatus: booking.paymentStatus,
        razorpayOrderId: booking.razorpayOrderId,
        razorpayPaymentId: booking.razorpayPaymentId,
        createdAt: booking.createdAt,
      },
    });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during payment verification.",
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
