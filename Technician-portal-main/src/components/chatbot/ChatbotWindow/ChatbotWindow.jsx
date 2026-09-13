import { useEffect, useRef, useState } from "react";
import { FiX, FiMinus } from "react-icons/fi";
import ChatMessage from "../ChatMessage/ChatMessage";
import QuickReplies from "../QuickReplies/QuickReplies";
import ChatInput from "../ChatInput/ChatInput";
import { initialMessages } from "../../../data/messagesData";
import { quickReplyOptions } from "../../../data/chatbotData";
import { getBotReply, getTextReply } from "../../../utils/chatbotLogic";
import "./ChatbotWindow.css";

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatbotWindow({ isOpen, onClose }) {
  const [messages, setMessages] = useState(initialMessages);
  const [error, setError] = useState("");
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  function pushMessage(msg) {
    setMessages((prev) => [...prev, { id: `m-${Date.now()}-${Math.random()}`, time: now(), ...msg }]);
  }

  function botRespond(text) {
    setTimeout(() => {
      pushMessage({ sender: "bot", type: "text", text });
    }, 600);
  }

  function handleQuickSelect(option) {
    pushMessage({ sender: "user", type: "text", text: option.label });
    botRespond(getBotReply(option.id));
  }

  function handleSendText(text) {
    pushMessage({ sender: "user", type: "text", text });
    botRespond(getTextReply(text));
  }

  function handleSendMedia(media, caption) {
    pushMessage({ sender: "user", type: media.kind, url: media.url, fileName: media.fileName, text: caption });
    botRespond(
      media.kind === "image"
        ? "Thanks, I've received the photo. Our team will review it shortly."
        : "Thanks, I've received the video. Our team will review it shortly."
    );
  }

  if (!isOpen) return null;

  return (
    <div className="chatbot-window">
      <div className="chatbot-header">
        <div className="chatbot-header-info">
          <div className="chatbot-avatar">S</div>
          <div>
            <h4>ServiceHub Assistant</h4>
            <span className="chatbot-status">● Online</span>
          </div>
        </div>
        <div className="chatbot-header-actions">
          <button onClick={onClose}><FiMinus /></button>
          <button onClick={onClose}><FiX /></button>
        </div>
      </div>

      <div className="chatbot-body" ref={bodyRef}>
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {error && <div className="chatbot-error">{error}</div>}
      </div>

      <QuickReplies options={quickReplyOptions} onSelect={handleQuickSelect} />

      <ChatInput
        onSendText={handleSendText}
        onSendMedia={handleSendMedia}
        onError={(msg) => {
          setError(msg);
          setTimeout(() => setError(""), 3000);
        }}
      />
    </div>
  );
}
