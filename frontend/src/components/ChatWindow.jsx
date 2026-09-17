import { useState, useRef, useEffect } from "react";
import { X, Send, Bot } from "lucide-react";
import { toast } from "react-hot-toast";
import { sendChatMessage } from "../services/api";

function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! 👋 How can I help you with your stay?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const isSendingRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const quickQuestions = [
    "Check-in & Check-out",
    "Rooms",
    "Breakfast",
    "Amenities",
    "Policies",
  ];

  const handleSend = async (text = input) => {
    if (isSendingRef.current || loading) return;
    const userText = (typeof text === "string" ? text : input).trim();
    if (!userText) return;

    // Immediately lock synchronously to avoid any rapid duplicate requests
    isSendingRef.current = true;
    setLoading(true);

    // Keep the user's message visible immediately
    const updatedMessages = [
      ...messages,
      {
        type: "user",
        text: userText,
      },
    ];
    setMessages(updatedMessages);
    setInput("");

    try {
      const conversationHistory = updatedMessages
        .filter((msg) => msg.type === "user" || msg.type === "bot")
        .map((msg) => ({
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.text,
        }));

      const data = await sendChatMessage({
        message: userText,
        conversation: conversationHistory.slice(-7, -1),
      });

      if (data && data.answer) {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: data.answer,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: "I'd be happy to help. You can ask me about rooms, check-in, breakfast, amenities, policies, or availability.",
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to get chat response:", err);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "I'm having trouble connecting right now. Please try again in a moment, or ask me about rooms, check-in, breakfast, amenities, policies, or availability.",
        },
      ]);
      toast.error("Unable to get a response right now. Please try again.");
    } finally {
      isSendingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-title">
          <div className="chat-avatar">
            <Bot size={20} />
          </div>

          <div>
            <h3>Hotel Concierge</h3>
            <span>Ask me anything about your stay</span>
          </div>
        </div>

        <button onClick={onClose} type="button">
          <X size={19} />
        </button>
      </div>

      <div className="quick-actions">
        {quickQuestions.map((question) => (
          <button
            key={question}
            disabled={loading}
            onClick={() => {
              if (!loading && !isSendingRef.current) handleSend(question);
            }}
            type="button"
            style={{
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {question}
          </button>
        ))}
      </div>

      <div className="chat-messages">
        {messages.map((item, index) => (
          <div
            key={index}
            className={`message ${
              item.type === "user" ? "user-message" : "ai-message"
            }`}
          >
            {item.type === "bot" && (
              <div className="message-icon">
                <Bot size={16} />
              </div>
            )}

            <div className="message-bubble">{item.text}</div>
          </div>
        ))}

        {loading && (
          <div className="message ai-message">
            <div className="message-icon">
              <Bot size={16} />
            </div>
            <div
              className="message-bubble"
              style={{ fontStyle: "italic", opacity: 0.85 }}
            >
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (!loading && !isSendingRef.current && input.trim()) {
                handleSend();
              }
            }
          }}
          placeholder={loading ? "Thinking..." : "Ask anything about your stay..."}
        />

        <button
          disabled={loading || !input.trim()}
          onClick={(e) => {
            e.preventDefault();
            if (!loading && !isSendingRef.current && input.trim()) {
              handleSend();
            }
          }}
          type="button"
          style={{
            opacity: loading || !input.trim() ? 0.6 : 1,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
          }}
        >
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;