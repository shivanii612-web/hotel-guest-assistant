const express = require("express");
const { getAvailability } = require("../controllers/availabilityController");

const router = express.Router();

router.post("/", getAvailability);

module.exports = router;