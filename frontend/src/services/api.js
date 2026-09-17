import axios from "axios";

const api = axios.create({
  baseURL: "https://prashiv-hotel-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const checkAvailability = async (data) => {
  const response = await api.post("/availability", data);
  return response.data;
};

export const createBooking = async (data) => {
  const response = await api.post("/bookings", data);
  return response.data;
};

export const createPaymentOrder = async (data) => {
  const response = await api.post("/payments/create-order", data);
  return response.data;
};

export const verifyPayment = async (data) => {
  const response = await api.post("/payments/verify", data);
  return response.data;
};

export const sendChatMessage = async (data) => {
  const response = await api.post("/chat", data);
  return response.data;
};

export default api;