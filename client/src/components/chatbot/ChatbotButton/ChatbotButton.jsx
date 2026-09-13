import { FiMessageCircle, FiX } from "react-icons/fi";
import "./ChatbotButton.css";

export default function ChatbotButton({ onClick, open }) {
  return (
    <button className="chatbot-fab" onClick={onClick} aria-label="Open support chat">
      {open ? <FiX /> : <FiMessageCircle />}
    </button>
  );
}
