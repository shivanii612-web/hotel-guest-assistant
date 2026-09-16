const { generateAIResponse } = require("../services/aiService");

const chat = async (req, res) => {
  try {
    const { message, conversation = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const answer = await generateAIResponse(message, conversation);

    res.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("Chat Error:", error);

    res.status(500).json({
      success: false,
      message: "Sorry, I'm unable to respond right now.",
    });
  }
};

module.exports = {
  chat,
};