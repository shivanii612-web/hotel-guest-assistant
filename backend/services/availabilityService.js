const Booking = require("../models/Booking");
const hotelData = require("../data/hotelData.json");

const checkAvailability = async (checkIn, checkOut, adults) => {
  try {
    // Validate input
    if (!checkIn || !checkOut || !adults) {
      return {
        success: false,
        message: "Please provide check-in, check-out and adults.",
      };
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const adultCount = Number(adults);

    // Validate dates
    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return {
        success: false,
        message: "Invalid check-in or check-out date.",
      };
    }

    if (endDate <= startDate) {
      return {
        success: false,
        message: "Check-out date must be after check-in date.",
      };
    }

    // Validate adults
    if (!Number.isInteger(adultCount) || adultCount < 1) {
      return {
        success: false,
        message: "Adults must be at least 1.",
      };
    }

    // Get bookings that overlap with selected dates
    const overlappingBookings = await Booking.find({
      checkIn: { $lt: endDate },
      checkOut: { $gt: startDate },
    });

    // Calculate availability for every room type
    const availableRooms = hotelData.rooms
      .filter((room) => room.capacity >= adultCount)
      .map((room) => {
        const bookedRooms = overlappingBookings
          .filter((booking) => booking.roomType === room.id)
          .reduce(
            (total, booking) => total + booking.rooms,
            0
          );

        const totalInventory =
          hotelData.roomInventory[room.id] || 0;

        const remainingRooms =
          totalInventory - bookedRooms;

        return {
          ...room,
          availableRooms: Math.max(remainingRooms, 0),
        };
      });

    return {
      success: true,
      checkIn,
      checkOut,
      adults: adultCount,
      rooms: availableRooms,
    };
  } catch (error) {
    console.error("Availability Service Error:", error);
    throw error;
  }
};

module.exports = {
  checkAvailability,
};