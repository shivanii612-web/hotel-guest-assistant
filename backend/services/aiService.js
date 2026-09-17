const { GoogleGenAI } = require("@google/genai");
const hotelData = require("../data/hotelData.json");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Candidate models prioritized by speed, availability, and reliability.
// gemini-2.5-flash responds within ~2-3 seconds with high fidelity.
// gemini-3.1-flash-lite serves as an immediate, fast secondary fallback.
const candidateModels = [
  process.env.GEMINI_MODEL,
  "gemini-2.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.6-flash",
].filter(Boolean);

// Pre-serialize static hotel context once at module level to avoid repeated serialization overhead.
const hotelContext = JSON.stringify(hotelData);

const systemInstruction = `
You are the AI guest assistant for PRASHIV Hotel & Resort.
Answer the guest's current question directly using ONLY the provided hotel data.
Do not return a generic help message when the answer can be found in the hotel data.
For simple questions, give a direct answer.
If the requested information is not present in the hotel data, clearly say that the information is not available.

GUIDELINES:
1. The hotel JSON provided below is your absolute source of truth.
2. If swimming pool information exists in hotelData.json, answer the question directly (for example: "Yes, PRASHIV Hotel has an outdoor swimming pool."). If the hotel data contains additional details such as timings, location, or availability, include those details.
3. If swimming pool information does NOT exist in hotelData.json, say: "I don't have information about a swimming pool at PRASHIV Hotel."
4. Never invent information. Do not assume or make up details not present in hotelData.json.
5. Understand user typos, phonetic spellings, and minor grammatical errors (for example, interpret "swimming poll" as "swimming pool"). Do not require the user to spell words perfectly.
6. Keep answers polite, helpful, and concise.
7. Use previous conversation context when answering follow-up questions.

PRASHIV HOTEL DATA:
${hotelContext}
`;

// Helper to prevent a stalled or overloaded candidate model from blocking execution indefinitely
function generateWithTimeout(model, prompt, timeoutMs = 8000) {
  return Promise.race([
    ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
      },
    }),
    new Promise((_, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Model ${model} request timed out after ${timeoutMs}ms`));
      }, timeoutMs);
      if (timer.unref) timer.unref();
    }),
  ]);
}

// Maximum conversation turns to send to avoid excessive token transmission and latency
const MAX_CONVERSATION_TURNS = 6;

async function generateAIResponse(message, conversation = []) {
  // Retain only the most recent conversation context to avoid sending excessive history tokens
  const recentConversation = Array.isArray(conversation)
    ? conversation.slice(-MAX_CONVERSATION_TURNS)
    : [];

  const conversationText = recentConversation.length > 0
    ? recentConversation
        .map((item) => `${item.role}: ${item.content}`)
        .join("\n")
    : "";

  const prompt = conversationText
    ? `Previous conversation:\n${conversationText}\n\nCurrent guest message:\n${message}`
    : `Current guest message:\n${message}`;

  let lastError;
  for (const model of candidateModels) {
    try {
      const response = await generateWithTimeout(model, prompt, 8000);

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err) {
      lastError = err;
      console.warn(`Model ${model} failed or timed out, trying fallback:`, err.message || err.status);
    }
  }

  throw lastError || new Error("Failed to generate response from all models");
}

module.exports = {
  generateAIResponse,
};