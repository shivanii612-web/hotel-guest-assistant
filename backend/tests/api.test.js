const request = require("supertest");

// Ensure test environment is configured before loading server
process.env.NODE_ENV = "test";
process.env.RAZORPAY_KEY_ID = "rzp_test_mock_key_12345";
process.env.RAZORPAY_KEY_SECRET = "test_secret_key_mock_67890";

// Mock Razorpay SDK to prevent real API calls and ensure isolation
jest.mock("razorpay", () => {
  return jest.fn().mockImplementation(() => ({
    orders: {
      create: jest.fn().mockImplementation(async (options) => ({
        id: "order_mock_test_12345",
        amount: options.amount,
        currency: options.currency || "INR",
        receipt: options.receipt,
        status: "created",
      })),
    },
  }));
});

// Mock AI service to prevent external Gemini API calls and network timeouts
jest.mock("../services/aiService", () => ({
  generateAIResponse: jest.fn(),
}));

// Import app after mocks and env vars are configured
const app = require("../server");
const Booking = require("../models/Booking");
const aiService = require("../services/aiService");

describe("PRASHIV Hotel Guest Assistant Backend API Test Suite", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Scenario 1: Health Check Endpoint
  describe("1. GET /api/health", () => {
    it("should return 200 and confirm backend is running", async () => {
      const res = await request(app).get("/api/health");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "PRASHIV Hotel Assistant Backend is running",
      });
    });
  });

  // Availability Endpoints (Scenarios 2 - 6)
  describe("Availability Scenarios (POST /api/availability)", () => {
    // Scenario 2: Valid check-in and check-out returns room availability
    it("2. should return available rooms with inventory counts for valid dates", async () => {
      jest.spyOn(Booking, "find").mockResolvedValue([]);

      const res = await request(app)
        .post("/api/availability")
        .send({
          checkIn: "2026-12-01",
          checkOut: "2026-12-03",
          adults: 2,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.checkIn).toBe("2026-12-01");
      expect(res.body.checkOut).toBe("2026-12-03");
      expect(res.body.adults).toBe(2);
      expect(Array.isArray(res.body.rooms)).toBe(true);

      const standard = res.body.rooms.find((r) => r.id === "standard");
      const deluxe = res.body.rooms.find((r) => r.id === "deluxe");
      const familySuite = res.body.rooms.find((r) => r.id === "family-suite");

      expect(standard).toBeDefined();
      expect(standard.availableRooms).toBe(10);
      expect(deluxe).toBeDefined();
      expect(deluxe.availableRooms).toBe(6);
      expect(familySuite).toBeDefined();
      expect(familySuite.availableRooms).toBe(3);
    });

    // Scenario 3: Missing dates validation
    it("3. should reject missing check-in or check-out dates with 400 validation error", async () => {
      const res = await request(app)
        .post("/api/availability")
        .send({
          checkIn: "",
          checkOut: "2026-12-03",
          adults: 2,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Please provide check-in, check-out and adults.");
    });

    // Scenario 4: Invalid date range (checkOut <= checkIn)
    it("4. should reject checkout date that is on or before checkin date with 400 error", async () => {
      const res = await request(app)
        .post("/api/availability")
        .send({
          checkIn: "2026-12-05",
          checkOut: "2026-12-01",
          adults: 2,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Check-out date must be after check-in date.");
    });

    // Scenario 5: Invalid adult count
    it("5. should reject non-positive or invalid adult count with 400 error", async () => {
      const res = await request(app)
        .post("/api/availability")
        .send({
          checkIn: "2026-12-01",
          checkOut: "2026-12-03",
          adults: -1,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Adults must be at least 1.");
    });

    // Scenario 6: Deluxe fully booked correctly reports 0 available Deluxe rooms
    it("6. should report 0 available Deluxe rooms when overlapping bookings reach total inventory (6)", async () => {
      // Mock overlapping Deluxe bookings totaling 6 rooms (e.g. 1 room + 5 rooms)
      jest.spyOn(Booking, "find").mockResolvedValue([
        {
          roomType: "deluxe",
          rooms: 1,
          checkIn: new Date("2026-11-10"),
          checkOut: new Date("2026-11-12"),
        },
        {
          roomType: "deluxe",
          rooms: 5,
          checkIn: new Date("2026-11-10"),
          checkOut: new Date("2026-11-12"),
        },
      ]);

      const res = await request(app)
        .post("/api/availability")
        .send({
          checkIn: "2026-11-10",
          checkOut: "2026-11-12",
          adults: 2,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const deluxe = res.body.rooms.find((r) => r.id === "deluxe");
      const standard = res.body.rooms.find((r) => r.id === "standard");

      expect(deluxe).toBeDefined();
      expect(deluxe.availableRooms).toBe(0); // 6 inventory - 6 booked = 0
      expect(standard.availableRooms).toBe(10); // Standard still has 10
    });
  });

  // Booking Validation & Overbooking (Scenarios 7 - 8)
  describe("Booking Scenarios (POST /api/bookings)", () => {
    // Scenario 7: Incomplete/invalid booking data is rejected
    it("7. should reject booking creation when required fields are missing", async () => {
      const res = await request(app)
        .post("/api/bookings")
        .send({
          guestName: "",
          email: "guest@example.com",
          // phone, roomType, dates missing
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Please provide all required booking details.");
    });

    // Scenario 8: Overbooking is rejected according to existing room inventory
    it("8. should reject booking requests that exceed available room inventory", async () => {
      jest.spyOn(Booking, "find").mockResolvedValue([]); // 0 existing bookings

      const res = await request(app)
        .post("/api/bookings")
        .send({
          guestName: "Traveler",
          email: "traveler@example.com",
          phone: "9876543210",
          roomType: "standard", // Total inventory is 10
          checkIn: "2026-12-01",
          checkOut: "2026-12-03",
          adults: 2,
          rooms: 15, // Requesting 15 rooms (exceeds inventory of 10)
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Only 10 standard room(s) are available");
    });
  });

  // AI Concierge Chat (Scenario 9)
  describe("AI Concierge Chat (POST /api/chat)", () => {
    it("9a. should reject empty message with 400 validation error", async () => {
      const res = await request(app)
        .post("/api/chat")
        .send({ message: "   " });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Message is required.");
    });

    it("9b. should return an assistant answer when AI service responds successfully", async () => {
      aiService.generateAIResponse.mockResolvedValueOnce("PRASHIV Hotel check-in starts at 2:00 PM.");

      const res = await request(app)
        .post("/api/chat")
        .send({ message: "What time is check-in?" });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.answer).toBe("PRASHIV Hotel check-in starts at 2:00 PM.");
    });

    it("9c. should return a safe 500 fallback error when AI service encounters an error without exposing secrets", async () => {
      aiService.generateAIResponse.mockRejectedValueOnce(new Error("AI service quota exceeded or network failure"));

      const res = await request(app)
        .post("/api/chat")
        .send({ message: "Hello concierge" });

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Sorry, I'm unable to respond right now.");
      // Ensure no internal stack trace or sensitive API key is leaked
      expect(res.body.stack).toBeUndefined();
      expect(JSON.stringify(res.body)).not.toContain("GEMINI_API_KEY");
    });
  });

  // End-to-End Safe Scenario (Scenario 10)
  describe("10. Safe End-to-End Payment Order Flow (POST /api/payments/create-order)", () => {
    it("should validate stay, calculate price breakdown, and return Razorpay order details without permanent DB pollution", async () => {
      // Mock no overlapping bookings
      jest.spyOn(Booking, "find").mockResolvedValue([]);

      const orderPayload = {
        guestName: "Aarav Sharma",
        email: "aarav@example.com",
        phone: "9876543210",
        roomType: "deluxe", // pricePerNight: 4500
        checkIn: "2026-12-10",
        checkOut: "2026-12-12", // 2 nights
        adults: 2,
        rooms: 1,
        breakfastIncluded: true, // 500 * 2 adults * 2 nights = 2000
      };

      const res = await request(app)
        .post("/api/payments/create-order")
        .send(orderPayload);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.orderId).toBe("order_mock_test_12345");
      expect(res.body.currency).toBe("INR");
      expect(res.body.keyId).toBe("rzp_test_mock_key_12345");

      // Verify server-side pricing breakdown
      expect(res.body.breakdown).toBeDefined();
      expect(res.body.breakdown.roomType).toBe("deluxe");
      expect(res.body.breakdown.nights).toBe(2);
      expect(res.body.breakdown.roomCount).toBe(1);
      expect(res.body.breakdown.roomAmount).toBe(9000); // 4500 * 2 * 1
      expect(res.body.breakdown.breakfastIncluded).toBe(true);
      expect(res.body.breakdown.breakfastAmount).toBe(2000); // 500 * 2 * 2
      expect(res.body.breakdown.totalAmount).toBe(11000); // 9000 + 2000
      expect(res.body.amount).toBe(1100000); // Amount in paise

      // Verify that the secret key is never leaked
      expect(JSON.stringify(res.body)).not.toContain("test_secret_key_mock_67890");
    });
  });
});
