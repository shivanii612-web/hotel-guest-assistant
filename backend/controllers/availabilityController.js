const { checkAvailability } = require("../services/availabilityService");

const getAvailability = async (req, res) => {
  try {
    const { checkIn, checkOut, adults } = req.body;

    const result = await checkAvailability(
      checkIn,
      checkOut,
      adults
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Availability Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while checking room availability.",
    });
  }
};

module.exports = {
  getAvailability,
};