const Booking = require("../models/Booking");
const hotelData = require("../data/hotelData.json");

const createBooking = async (req, res) => {
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

    // Basic validation
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
        message: "Please provide all required booking details.",
      });
    }

    // Check room type
    const room = hotelData.rooms.find(
      (item) => item.id === roomType
    );

    if (!room) {
      return res.status(400).json({
        success: false,
        message: "Invalid room type.",
      });
    }

    // Convert dates
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

    // Check date range
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date.",
      });
    }

    // Validate numbers
    const adultCount = Number(adults);
    const roomCount = Number(rooms);

    if (
      !Number.isInteger(adultCount) ||
      adultCount < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Adults must be at least 1.",
      });
    }

    if (
      !Number.isInteger(roomCount) ||
      roomCount < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Rooms must be at least 1.",
      });
    }

    // Check room capacity
    const totalCapacity = room.capacity * roomCount;

    if (adultCount > totalCapacity) {
      return res.status(400).json({
        success: false,
        message: `This booking needs more capacity. ${roomType} allows up to ${totalCapacity} adults for ${roomCount} room(s).`,
      });
    }

    // Check existing overlapping bookings
    const overlappingBookings = await Booking.find({
      roomType,
      checkIn: { $lt: endDate },
      checkOut: { $gt: startDate },
    });

    const bookedRooms = overlappingBookings.reduce(
      (total, booking) => total + booking.rooms,
      0
    );

    const totalInventory = hotelData.roomInventory[roomType] || 0;
    const availableRooms = totalInventory - bookedRooms;

    if (roomCount > availableRooms) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableRooms} ${roomType} room(s) are available for the selected dates.`,
      });
    }

    // Calculate number of nights
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const nights = Math.ceil(
      (endDate - startDate) / millisecondsPerDay
    );

    // Calculate room amount
    const roomAmount =
      room.pricePerNight * nights * roomCount;

    // Calculate breakfast amount
    const breakfastPrice =
      hotelData.dining.breakfastOption?.pricePerAdultPerNight || 0;

    const breakfastAmount = breakfastIncluded
      ? breakfastPrice * adultCount * nights
      : 0;

    // Calculate total
    const totalAmount =
      roomAmount + breakfastAmount;

    // Save booking
    const booking = await Booking.create({
      guestName,
      email,
      phone,
      roomType,
      checkIn: startDate,
      checkOut: endDate,
      adults: adultCount,
      rooms: roomCount,
      breakfastIncluded,
      roomAmount,
      breakfastAmount,
      totalAmount,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      booking: {
        bookingId: booking._id,
        guestName: booking.guestName,
        email: booking.email,
        phone: booking.phone,
        roomType: booking.roomType,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        adults: booking.adults,
        rooms: booking.rooms,
        breakfastIncluded: booking.breakfastIncluded,
        nights,
        roomAmount,
        breakfastAmount,
        totalAmount,
      },
    });
  } catch (error) {
    console.error("Booking Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the booking.",
    });
  }
};

module.exports = {
  createBooking,
};