import { useState } from "react";
import { FiSend } from "react-icons/fi";
import MediaUpload from "../MediaUpload/MediaUpload";
import MediaPreview from "../MediaPreview/MediaPreview";
import "./ChatInput.css";

export default function ChatInput({ onSendText, onSendMedia, onError }) {
  const [text, setText] = useState("");
  const [pendingMedia, setPendingMedia] = useState(null);

  function handleSend() {
    if (pendingMedia) {
      onSendMedia(pendingMedia, text.trim());
      setPendingMedia(null);
      setText("");
      return;
    }
    if (!text.trim()) return;
    onSendText(text.trim());
    setText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat-input-wrap">
      <MediaPreview media={pendingMedia} onRemove={() => setPendingMedia(null)} />
      <div className="chat-input-row">
        <MediaUpload onFileSelected={setPendingMedia} onError={onError} />
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="chat-send-btn" onClick={handleSend}>
          <FiSend />
        </button>
      </div>
    </div>
  );
}
