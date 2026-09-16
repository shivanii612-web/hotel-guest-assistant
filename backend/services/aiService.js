const { GoogleGenAI } = require("@google/genai");
const hotelData = require("../data/hotelData.json");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateAIResponse(message, conversation = []) {
  const hotelContext = JSON.stringify(hotelData, null, 2);

  const systemInstruction = `
You are the AI guest assistant for PRASHIV Hotel & Resort.

Your job is to help hotel guests with questions about:
- Rooms
- Room prices
- Room capacity
- Amenities
- Food and menu
- Dining
- Room service
- Spa
- Hotel services
- Policies
- Check-in and check-out
- Nearby places
- FAQs

IMPORTANT RULES:
1. Answer only using the hotel information provided below.
2. Never invent hotel information.
3. Never make up room availability.
4. Never make up prices, timings, amenities, policies or services.
5. If the information is not available, clearly say that you don't have that information.
6. Be friendly, concise and helpful.
7. Remember the previous conversation when answering follow-up questions.

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

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction,
    },
  });

  return response.text;
}

module.exports = {
  generateAIResponse,
};