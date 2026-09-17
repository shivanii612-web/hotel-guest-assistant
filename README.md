# PRASHIV Hotel Guest Assistant

> A Full-Stack AI-Powered Hotel Concierge and Reservation Web Application built with React, Node.js, Express, MongoDB, Google Gemini AI, and Razorpay.

---

## Deployment

### Frontend
Deployed on Vercel:  
[Open Live Demo](https://prashiv-hotel-guest-assistant.vercel.app/)

### Backend
Deployed on Render:  
https://prashiv-hotel-backend.onrender.com

The frontend communicates with the deployed backend through REST APIs.

## 1. Project Overview

**PRASHIV Hotel Guest Assistant** is a modern, responsive web application designed for luxury hospitality. It pairs a guest-facing hotel portal with an intelligent AI Concierge that assists guests before, during, and after their stay.

The application allows guests to:
- **Ask hotel-related questions** in natural language and receive immediate, accurate answers grounded in hotel data.
- **Browse room options** (Standard Room, Deluxe Room, Family Suite) with rich details, pricing, capacities, and amenities.
- **Check live room availability** for specific check-in and check-out dates and guest counts.
- **Understand hotel services and policies**, including check-in/check-out timings, early check-in/late check-out, cancellation policies, parking, Wi-Fi, and amenities.
- **Explore dining and experiences**, including restaurant timings, breakfast buffet options, and curated resort galleries (Infinity Pool, Fine Dining, Spa & Wellness, Beach Experience).
- **Maintain conversational context** across multi-turn queries with the AI concierge.
- **Complete seamless reservations** with client-side form validation, backend live inventory validation, dynamic price computation, and a secured Razorpay test payment gateway workflow.

---

## 2. Customer Problem

In traditional hospitality websites, guests face recurring points of friction:

1. **Information Scavenging**: Guests spend excessive time navigating through multiple pages and nested menus to find basic policies (e.g., check-in hours, Wi-Fi details, breakfast pricing).
2. **Delayed Inquiries**: Simple questions often require calling the front desk or waiting for email responses, creating delays for guests and overloading hotel staff.
3. **Availability Uncertainty**: Traditional systems often lack real-time date and guest capacity feedback, resulting in booking attempts for rooms that cannot accommodate their party.
4. **Disjointed Booking Experiences**: Guests often have to jump between disconnected discovery portals and booking engines, leading to high drop-off rates.
5. **Lack of Conversational Guidance**: Static FAQs fail to answer specific or compound guest questions (e.g., *"Can 3 adults stay in the deluxe room, and is breakfast included?"*).

**PRASHIV Hotel Guest Assistant** solves these challenges by combining an intelligent AI concierge with an integrated, real-time booking and payment workflow on a single cohesive platform.

---

## 3. Key Features

### ✦ Conversational AI Concierge
- **Grounded Hotel Knowledge Base**: Built on a comprehensive dataset (`hotelData.json`) ensuring factual, hotel-specific responses without hallucinations.
- **Multi-Model Fallback**: Automatically cascades across Gemini models (`gemini-3.8-flash`, `gemini-3.6-flash`, `gemini-3.1-flash-lite`, `gemini-2.5-flash`) for maximum availability and reliability.
- **Multi-Turn Context**: Preserves previous conversation history for contextual follow-up questions.
- **Typo & Phonetic Tolerance**: Graciously interprets minor user misspellings and phonetics (e.g., *"swimming poll"*).
- **Quick Action Prompts**: Pre-configured chips for common inquiries (Check-in/Check-out, Rooms, Breakfast, Amenities, Policies).

### ✦ Real-Time Room Availability & Inventory Engine
- **Live Overlap Detection**: Checks requested date ranges against existing confirmed bookings in MongoDB to calculate true remaining inventory:
  - Standard Room: 10 total units
  - Deluxe Room: 6 total units
  - Family Suite: 3 total units
- **Capacity Enforcement**: Validates guest count against maximum adult occupancy for each room tier.
- **Dynamic Status Badges**: Displays exact available room counts (e.g., `6 available` or `Sold out`) with responsive visual feedback.

### ✦ Reservation & Razorpay Payment Lifecycle
- **Comprehensive Pre-Payment Validation**: Validates full name, email format, phone length, dates, night counts, and guest numbers before checkout opens.
- **Server-Side Price Calculation**: Single source of truth on the backend calculates total room charges and optional breakfast buffets (₹500/adult/night).
- **Two-Phase Verification**: Integrates Razorpay Test Gateway with HMAC SHA-256 server-side signature verification (`/api/payments/verify`) before creating confirmed booking records in MongoDB.
- **Idempotent & Safe**: Prevents duplicate bookings, handles modal cancellations cleanly, and preserves inventory on failed transactions.
- **Booking Confirmation Card**: Provides instant confirmation with Booking ID, Payment ID, stay dates, guest count, breakfast status, and total amount.

### ✦ Modern Guest Interface & UX
- **Theme Toggle**: One-click switching between dark mode and light mode.
- **Toast Feedback System**: Integrated with `react-hot-toast` for short, non-intrusive success, error, and validation notifications.
- **Loading Indicators**: Clear status transitions (`Checking...`, `Preparing Payment...`, `Verifying payment...`, `Confirming your booking...`).
- **Interactive Lightbox Galleries**: Multi-slide photo carousels with keyboard navigation (Arrow keys, Escape) for resort experiences.
- **Interactive Dining Modal**: Detailed menus and meal schedules with direct shortcuts to consult the AI concierge.

---

## 4. Technology Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 (`react`, `react-dom`) | Component-based interactive UI |
| **Build Tool & Dev Server** | Vite 8 | Ultra-fast HMR and production bundling |
| **HTTP Client** | Axios | RESTful communication with backend APIs |
| **Icons** | Lucide React | Clean, scalable modern icons |
| **User Feedback** | react-hot-toast | Lightweight toast notifications |
| **Styling** | Vanilla CSS | Custom design system with glassmorphism, gradients, and dark/light themes |
| **Backend Runtime** | Node.js | Asynchronous JavaScript server runtime |
| **Backend Framework** | Express 5 | REST API routing and middleware |
| **Database** | MongoDB & Mongoose 9 | Document storage for guest bookings and schema validation |
| **AI / LLM Service** | Google GenAI SDK (`@google/genai`) | Gemini models for conversational hotel assistance |
| **Payment Gateway** | Razorpay SDK | Test payment order creation and HMAC SHA-256 signature verification |
| **CORS & Environment** | `cors`, `dotenv` | Cross-origin resource sharing and environment management |
| **Testing Framework** | Jest 30 | Test runner and assertion library |
| **API Testing** | Supertest 7 | HTTP assertion testing for Express endpoints |

---

## 5. Project Structure

```
hotel-guest-assistant/
├── backend/
│   ├── config/
│   │   └── db.js                   # MongoDB connection configuration
│   ├── controllers/
│   │   ├── availabilityController.js # Room availability request handler
│   │   ├── bookingController.js      # Direct booking creation controller
│   │   ├── chatController.js         # AI concierge chat handler
│   │   └── paymentController.js      # Razorpay order & verification handlers
│   ├── data/
│   │   └── hotelData.json            # Authoritative hotel knowledge base & inventory
│   ├── models/
│   │   └── Booking.js                # Mongoose schema and model for bookings
│   ├── routes/
│   │   ├── availabilityRoutes.js     # /api/availability routes
│   │   ├── bookingRoutes.js          # /api/bookings routes
│   │   ├── chatRoutes.js             # /api/chat routes
│   │   └── paymentRoutes.js          # /api/payments routes
│   ├── services/
│   │   ├── aiService.js              # Gemini AI client with fallback strategy
│   │   └── availabilityService.js    # Live room inventory & date-overlap logic
│   ├── tests/
│   │   └── api.test.js               # Automated Jest & Supertest API test suite
│   ├── .env                          # Backend environment configuration (gitignored)
│   ├── package.json                  # Backend dependencies and test scripts
│   └── server.js                     # Express app configuration and server entry
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookingCTA.jsx        # Bottom booking call-to-action
│   │   │   ├── BookingModal.jsx      # Reservation form, Razorpay flow & confirmation
│   │   │   ├── ChatButton.jsx        # Floating concierge launcher
│   │   │   ├── ChatWindow.jsx        # Standalone concierge chat window
│   │   │   ├── Dining.jsx            # Dining highlight section
│   │   │   ├── DiningModal.jsx       # Restaurant menus and schedule modal
│   │   │   ├── ExperienceModal.jsx   # Lightbox gallery modal with keyboard controls
│   │   │   ├── Experiences.jsx       # Resort experiences grid
│   │   │   ├── Footer.jsx            # Footer with policies and contact info
│   │   │   ├── Gallery.jsx           # Photo gallery component
│   │   │   ├── Hero.jsx              # Hero component
│   │   │   ├── HotelHighlights.jsx   # Amenities grid component
│   │   │   ├── Navbar.jsx            # Navigation bar with theme toggle
│   │   │   ├── RoomCard.jsx          # Room display card component
│   │   │   └── RoomsSection.jsx      # Live room availability search and grid
│   │   ├── services/
│   │   │   └── api.js                # Axios API service endpoints
│   │   ├── App.css                   # Global stylesheet and theme tokens
│   │   ├── App.jsx                   # Root application container with Toaster
│   │   └── main.jsx                  # React DOM entry point
│   ├── index.html                    # HTML shell
│   ├── package.json                  # Frontend dependencies and build scripts
│   └── vite.config.js                # Vite configuration
│
└── README.md                         # Project documentation
```

---

## 6. Architecture & System Flow

```
+-------------------------------------------------------------------------+
|                                FRONTEND                                 |
|                                                                         |
|   +-----------------------+     +------------------+     +----------+   |
|   |  AI Concierge Chat    |     | Live Availability|     | Booking  |   |
|   |  (Thinking..., Chips) |     | (Search & Badges)|     | Modal    |   |
|   +-----------+-----------+     +--------+---------+     +----+-----+   |
+---------------|--------------------------|--------------------|---------+
                |                          |                    |
                | Axios POST /api/chat     | POST /api/avail    | POST /api/payments/*
                v                          v                    v
+-------------------------------------------------------------------------+
|                                BACKEND                                  |
|                                                                         |
|   +-----------------------+     +------------------+     +----------+   |
|   |   chatController      |     |  availController |     | payment  |   |
|   |   & aiService         |     |  & availService  |     | Control  |   |
|   +-----------+-----------+     +--------+---------+     +----+-----+   |
|               |                          |                    |         |
|               |                          +----------+         |         |
|               |                                     |         |         |
+---------------|-------------------------------------|---------|---------+
                |                                     |         |
     +----------v----------+                          v         v
     |   Google Gemini     |                   +-------------------+
     |   AI SDK            |                   |      MongoDB      |
     |   (hotelData.json)  |                   | (Bookings Schema) |
     +---------------------+                   +-------------------+
                                                        ^
                                                        | Verify HMAC
                                               +--------+----------+
                                               |  Razorpay Orders  |
                                               |  & Web Checkout   |
                                               +-------------------+
```

---

## 7. Backend API Endpoints

### 1. Health Probe
- **Endpoint**: `GET /api/health`
- **Description**: Returns backend service health status.
- **Response**:
  ```json
  {
    "success": true,
    "message": "PRASHIV Hotel Assistant Backend is running"
  }
  ```

### 2. Check Availability
- **Endpoint**: `POST /api/availability`
- **Request Body**:
  ```json
  {
    "checkIn": "2026-12-01",
    "checkOut": "2026-12-03",
    "adults": 2
  }
  ```
- **Response (200)**:
  ```json
  {
    "success": true,
    "checkIn": "2026-12-01",
    "checkOut": "2026-12-03",
    "adults": 2,
    "rooms": [
      {
        "id": "standard",
        "name": "Standard Room",
        "capacity": 2,
        "pricePerNight": 3000,
        "availableRooms": 10
      },
      {
        "id": "deluxe",
        "name": "Deluxe Room",
        "capacity": 3,
        "pricePerNight": 4500,
        "availableRooms": 6
      },
      {
        "id": "family-suite",
        "name": "Family Suite",
        "capacity": 4,
        "pricePerNight": 7000,
        "availableRooms": 3
      }
    ]
  }
  ```

### 3. AI Concierge Chat
- **Endpoint**: `POST /api/chat`
- **Request Body**:
  ```json
  {
    "message": "What time is check-in and check-out?",
    "conversation": [
      { "role": "user", "content": "Hello" },
      { "role": "assistant", "content": "Hello! How can I help with your stay?" }
    ]
  }
  ```
- **Response (200)**:
  ```json
  {
    "success": true,
    "answer": "Check-in begins at 2:00 PM and check-out is at 11:00 AM."
  }
  ```

### 4. Create Direct Booking
- **Endpoint**: `POST /api/bookings`
- **Request Body**:
  ```json
  {
    "guestName": "Aarav Sharma",
    "email": "aarav@example.com",
    "phone": "9876543210",
    "roomType": "deluxe",
    "checkIn": "2026-12-10",
    "checkOut": "2026-12-12",
    "adults": 2,
    "rooms": 1,
    "breakfastIncluded": true
  }
  ```
- **Response (201)**:
  ```json
  {
    "success": true,
    "message": "Booking created successfully.",
    "booking": {
      "bookingId": "6aaadffa8c764cc436959a9e",
      "guestName": "Aarav Sharma",
      "email": "aarav@example.com",
      "phone": "9876543210",
      "roomType": "deluxe",
      "checkIn": "2026-12-10T00:00:00.000Z",
      "checkOut": "2026-12-12T00:00:00.000Z",
      "adults": 2,
      "rooms": 1,
      "breakfastIncluded": true,
      "nights": 2,
      "roomAmount": 9000,
      "breakfastAmount": 2000,
      "totalAmount": 11000
    }
  }
  ```

### 5. Create Payment Order
- **Endpoint**: `POST /api/payments/create-order`
- **Request Body**:
  ```json
  {
    "guestName": "Aarav Sharma",
    "email": "aarav@example.com",
    "phone": "9876543210",
    "roomType": "deluxe",
    "checkIn": "2026-12-10",
    "checkOut": "2026-12-12",
    "adults": 2,
    "rooms": 1,
    "breakfastIncluded": true
  }
  ```
- **Response (200)**:
  ```json
  {
    "success": true,
    "orderId": "order_XXXXXXXXXXXXXX",
    "amount": 1100000,
    "currency": "INR",
    "keyId": "rzp_test_XXXXXXXXXXXXXX",
    "breakdown": {
      "roomType": "deluxe",
      "nights": 2,
      "roomCount": 1,
      "roomAmount": 9000,
      "breakfastIncluded": true,
      "breakfastAmount": 2000,
      "totalAmount": 11000
    }
  }
  ```

### 6. Verify Payment & Confirm Booking
- **Endpoint**: `POST /api/payments/verify`
- **Request Body**:
  ```json
  {
    "razorpay_order_id": "order_XXXXXXXXXXXXXX",
    "razorpay_payment_id": "pay_XXXXXXXXXXXXXX",
    "razorpay_signature": "signature_hash",
    "guestName": "Aarav Sharma",
    "email": "aarav@example.com",
    "phone": "9876543210",
    "roomType": "deluxe",
    "checkIn": "2026-12-10",
    "checkOut": "2026-12-12",
    "adults": 2,
    "rooms": 1,
    "breakfastIncluded": true
  }
  ```
- **Response (201)**:
  ```json
  {
    "success": true,
    "message": "Booking confirmed successfully.",
    "booking": {
      "bookingId": "6aaadffa8c764cc436959a9e",
      "guestName": "Aarav Sharma",
      "roomType": "deluxe",
      "totalAmount": 11000,
      "paymentStatus": "paid",
      "razorpayPaymentId": "pay_XXXXXXXXXXXXXX"
    }
  }
  ```

---

## 8. Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account or local MongoDB instance
- A [Google Gemini API Key](https://aistudio.google.com/)
- A [Razorpay Test Account](https://razorpay.com/) (Key ID & Key Secret)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/shivanii612-web/hotel-guest-assistant.git
cd hotel-guest-assistant
```

---

### Step 2: Configure the Backend Environment
Navigate into `backend/` and create a `.env` file:
```bash
cd backend
```

Configure the required variables in `backend/.env`:
```env
PORT=5000
MONGODB_URI=YOUR_MONGODB_URI
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
```

> **Security Note**: Never commit your real `.env` file or credentials to version control.

---

### Step 3: Install Dependencies
Install dependencies for both backend and frontend:

```bash
# In backend directory:
npm install

# In frontend directory:
cd ../frontend
npm install
```

---

### Step 4: Run the Application Locally

#### Terminal 1 — Start the Backend Server:
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

#### Terminal 2 — Start the Frontend Development Server:
```bash
cd frontend
npm run dev
# Vite dev server runs on http://localhost:5173
```

Open `http://localhost:5173` in your browser to explore the application.

---

## 9. Automated Testing

The backend includes a comprehensive test suite built with **Jest** and **Supertest** covering 12 test assertions across 10 distinct operational scenarios.

### Running Backend Tests
From the `backend` directory, run:

```bash
npm test
```

### Verified Test Scenarios

| # | Test Scenario | Verified Behavior |
| :--- | :--- | :--- |
| **1** | `GET /api/health` | Returns `200 OK` and confirms server is operational |
| **2** | `POST /api/availability` (Valid Dates) | Returns full room inventory when dates are unbooked |
| **3** | `POST /api/availability` (Missing Dates) | Rejects missing check-in/check-out with `400 Bad Request` |
| **4** | `POST /api/availability` (Invalid Range) | Rejects checkout on or before check-in with `400 Bad Request` |
| **5** | `POST /api/availability` (Invalid Adults) | Rejects non-positive adult count with `400 Bad Request` |
| **6** | `POST /api/availability` (Fully Booked) | Correctly calculates `availableRooms: 0` when overlapping bookings consume inventory |
| **7** | `POST /api/bookings` (Incomplete Data) | Rejects missing required booking fields with `400 Bad Request` |
| **8** | `POST /api/bookings` (Overbooking) | Rejects room requests exceeding total inventory with `400 Bad Request` |
| **9a** | `POST /api/chat` (Validation) | Rejects empty message payloads with `400 Bad Request` |
| **9b** | `POST /api/chat` (AI Success) | Returns assistant response from AI service |
| **9c** | `POST /api/chat` (Safe Fallback) | Returns clean `500` fallback without exposing API keys or stack traces |
| **10** | `POST /api/payments/create-order` | Validates stay, calculates accurate price breakdown, and returns Razorpay order |

### Test Suite Execution Output
```
PASS tests/api.test.js
  PRASHIV Hotel Guest Assistant Backend API Test Suite
    1. GET /api/health
      √ should return 200 and confirm backend is running
    Availability Scenarios (POST /api/availability)
      √ 2. should return available rooms with inventory counts for valid dates
      √ 3. should reject missing check-in or check-out dates with 400 validation error
      √ 4. should reject checkout date that is on or before checkin date with 400 error
      √ 5. should reject non-positive or invalid adult count with 400 error
      √ 6. should report 0 available Deluxe rooms when overlapping bookings reach total inventory (6)
    Booking Scenarios (POST /api/bookings)
      √ 7. should reject booking creation when required fields are missing
      √ 8. should reject booking requests that exceed available room inventory
    AI Concierge Chat (POST /api/chat)
      √ 9a. should reject empty message with 400 validation error
      √ 9b. should return an assistant answer when AI service responds successfully
      √ 9c. should return a safe 500 fallback error when AI service encounters an error without exposing secrets
    10. Safe End-to-End Payment Order Flow (POST /api/payments/create-order)
      √ should validate stay, calculate price breakdown, and return Razorpay order details without permanent DB pollution

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        1.409 s
```

---

## 10. License

This project is open source and available under the [ISC License](LICENSE).
