import { MessageCircle } from "lucide-react";

function ChatButton({ onClick }) {
  return (
    <button className="chat-button" onClick={onClick}>
      <MessageCircle size={21} />

      <span>
        Hotel Concierge
      </span>
    </button>
  );
}

export default ChatButton;