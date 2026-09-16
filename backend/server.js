const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const availabilityRoutes = require("./routes/availabilityRoutes");
const chatRoutes = require("./routes/chatRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/availability", availabilityRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "PRASHIV Hotel Assistant Backend is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});