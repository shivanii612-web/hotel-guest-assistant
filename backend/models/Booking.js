const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    guestName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    roomType: {
      type: String,
      required: true,
      enum: ["standard", "deluxe", "family-suite"],
    },

    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      required: true,
    },

    adults: {
      type: Number,
      required: true,
      min: 1,
    },

    rooms: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    breakfastIncluded: {
      type: Boolean,
      default: false,
    },

    roomAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    breakfastAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);