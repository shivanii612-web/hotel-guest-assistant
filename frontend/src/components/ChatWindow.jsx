import { X, Send, Bot } from "lucide-react";

function ChatWindow({ onClose }) {
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

        <button onClick={onClose}>
          <X size={19} />
        </button>
      </div>

      <div className="quick-actions">
        <button>Check-in & Check-out</button>
        <button>Rooms</button>
        <button>Breakfast</button>
        <button>Amenities</button>
        <button>Policies</button>
      </div>

      <div className="chat-messages">

        <div className="message ai-message">
          <div className="message-icon">
            <Bot size={16} />
          </div>

          <div className="message-bubble">
            Hello! 👋 How can I help you with your stay?
          </div>
        </div>

        <div className="message user-message">
          <div className="message-bubble">
            What time is check-in?
          </div>
        </div>

        <div className="message ai-message">
          <div className="message-icon">
            <Bot size={16} />
          </div>

          <div className="message-bubble">
            Check-in starts at <strong>2:00 PM</strong> and
            check-out is at <strong>11:00 AM</strong>.
          </div>
        </div>

      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask anything about your stay..."
        />

        <button>
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;