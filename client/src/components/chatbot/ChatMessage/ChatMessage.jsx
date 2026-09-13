import "./ChatMessage.css";

export default function ChatMessage({ message }) {
  const isBot = message.sender === "bot";

  return (
    <div className={`chat-msg-row ${isBot ? "bot" : "user"}`}>
      {isBot && <div className="chat-avatar">S</div>}
      <div className="chat-bubble">
        {message.type === "text" && <p>{message.text}</p>}

        {message.type === "image" && (
          <div className="chat-media">
            <img src={message.url} alt={message.fileName || "uploaded"} />
            {message.text && <p>{message.text}</p>}
          </div>
        )}

        {message.type === "video" && (
          <div className="chat-media">
            <video src={message.url} controls />
            {message.text && <p>{message.text}</p>}
          </div>
        )}

        <span className="chat-time">{message.time}</span>
      </div>
    </div>
  );
}
