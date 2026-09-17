const { GoogleGenAI } = require("@google/genai");
const hotelData = require("../data/hotelData.json");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const candidateModels = [
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
];

async function generateAIResponse(message, conversation = []) {
  const hotelContext = JSON.stringify(hotelData, null, 2);

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

  const conversationText = conversation
    .map((item) => `${item.role}: ${item.content}`)
    .join("\n");

  const prompt = `
Previous conversation:
${conversationText}

Current guest message:
${message}
`;

  let lastError;
  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err) {
      lastError = err;
      console.warn(`Model ${model} failed, trying fallback:`, err.message || err.status);
    }
  }

  throw lastError || new Error("Failed to generate response from all models");
}

module.exports = {
  generateAIResponse,
};