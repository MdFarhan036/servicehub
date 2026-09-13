import { useEffect, useRef, useState } from "react";
import { FiX, FiMinus } from "react-icons/fi";

import ChatMessage from "../ChatMessage/ChatMessage";
import QuickReplies from "../QuickReplies/QuickReplies";
import ChatInput from "../ChatInput/ChatInput";

import "./ChatbotWindow.css";
import API from "../../../services/api.js";

function now() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function createSessionId() {
  return (
    "chat-" +
    Date.now() +
    "-" +
    Math.random().toString(36).substring(2, 10)
  );
}

export default function ChatbotWindow({
  isOpen,
  onClose,
  onRequestMedia,
}) {
  const [messages, setMessages] = useState([]);
  const [quickReplies, setQuickReplies] = useState([]);
  const [conversationId, setConversationId] = useState(null);
const [faqs, setFaqs] = useState([]);
const [showFaqs, setShowFaqs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  const bodyRef = useRef(null);

  // ==================================================
  // SESSION
  // ==================================================

  function getSessionId() {
    let sessionId = sessionStorage.getItem("chat_session_id");

    if (!sessionId) {
      sessionId = createSessionId();

      sessionStorage.setItem(
        "chat_session_id",
        sessionId
      );
    }

    return sessionId;
  }

  // ==================================================
  // INITIALIZE CHAT
  // ==================================================

  useEffect(() => {
    if (!isOpen) return;

    initializeChat();
  }, [isOpen]);

  async function initializeChat() {
    try {
      setInitialLoading(true);
      setError("");

      const sessionId = getSessionId();

      // ----------------------------------------------
      // GET / CREATE CONVERSATION
      // ----------------------------------------------

      const conversationResponse = await API.get(
        "/chatbot/conversation",
        {
          headers: {
            "x-chat-session": sessionId,
          },
        }
      );

      const conversation =
        conversationResponse.data?.data;

      if (!conversation?.id) {
        throw new Error(
          "Conversation ID not received"
        );
      }

      setConversationId(conversation.id);

      // ----------------------------------------------
      // LOAD EXISTING MESSAGES
      // ----------------------------------------------

      const messagesResponse = await API.get(
        `/chatbot/messages/${conversation.id}`
      );

      const backendMessages =
        messagesResponse.data?.data || [];

      const formattedMessages =
        backendMessages.map((message) => ({
          id: `server-${message.id}`,
          sender: message.sender,
          type: message.message_type,
          text: message.message,
          url: message.media_url,
          fileName: message.file_name,

          time: new Date(
            message.created_at
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

      setMessages(formattedMessages);

      // ----------------------------------------------
      // LOAD QUICK REPLIES
      // ----------------------------------------------

      const quickResponse =
        await API.get(
          "/chatbot/quick-replies"
        );

      setQuickReplies(
        quickResponse.data?.data || []
      );

      // ----------------------------------------------
      // GREETING
      // ----------------------------------------------

      /*
       * Backend can return:
       *
       * {
       *   greeting: true,
       *   reply: "Hi Rohit 👋 ..."
       * }
       *
       * We only show it when conversation
       * doesn't already contain messages.
       */

      if (
        formattedMessages.length === 0 &&
        conversationResponse.data?.greeting
      ) {
        pushMessage({
          sender: "bot",
          type: "text",
          text:
            conversationResponse.data.greeting,
        });
      }

    } catch (err) {
      console.error(
        "Chatbot initialization error:",
        err
      );

      setError(
        "Unable to connect to chatbot."
      );
    } finally {
      setInitialLoading(false);
    }
  }

  // ==================================================
  // AUTO SCROLL
  // ==================================================

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop =
        bodyRef.current.scrollHeight;
    }
  }, [messages, isOpen, loading]);

  // ==================================================
  // ADD MESSAGE
  // ==================================================

  function pushMessage(msg) {
    setMessages((prev) => [
      ...prev,
      {
        id:
          `m-${Date.now()}-` +
          Math.random(),
        time: now(),
        ...msg,
      },
    ]);
  }

  // ==================================================
  // SEND MESSAGE TO BACKEND
  // ==================================================

async function sendToBackend(
  text,
  extraData = {}
) {
  if (!conversationId) {
    setError("Chat session is not ready.");
    return;
  }

  try {

    setLoading(true);
    setError("");

    const response = await API.post(
      "/chatbot/message",
      {
        conversationId,
        message: text,
        ...extraData,
      }
    );

    const data = response.data;

    // ================================================
    // BOT MESSAGE
    // ================================================

    if (
      data?.success &&
      data?.reply
    ) {

      pushMessage({
        sender: "bot",
        type: "text",
        text: data.reply,
      });

    }

    // ================================================
    // ACTION
    // ================================================

    if (data?.action) {

      handleBotAction(
        data.action,
        data
      );

    }

  } catch (err) {

    console.error(
      "Chatbot message error:",
      err
    );

    setError(
      "Sorry, something went wrong. Please try again."
    );

  } finally {

    setLoading(false);

  }
}
  // ==================================================
  // BOT ACTIONS
  // ==================================================
function handleBotAction(action, data) {

  switch (action) {

    case "greeting":
      // Quick replies remain visible
      break;

    case "quick_replies":
      // Quick replies remain visible
      break;

    case "faq":
      // FAQ system
      loadFaqs();
      break;

    case "booking_help":
      // User should provide Booking ID
      break;

    case "track_booking":
      // User should provide Booking ID
      break;

    case "cancel_reschedule":
      // User should provide Booking ID
      break;

    case "photo_upload":

      if (onRequestMedia) {
        onRequestMedia("image");
      }

      break;

    case "video_upload":

      if (onRequestMedia) {
        onRequestMedia("video");
      }

      break;

    case "talk_to_agent":

      // Later connect this with admin/agent
      break;

    case "fallback":
      // Quick replies remain visible
      break;

    default:
      break;
  }
}
async function loadFaqs() {

  try {

    const response =
      await API.get(
        "/chatbot/faqs"
      );

    setFaqs(
      response.data?.data || []
    );

    setShowFaqs(true);

  } catch (error) {

    console.error(
      "FAQ loading error:",
      error
    );

  }
}
  // ==================================================
  // QUICK REPLY
  // ==================================================

async function handleQuickSelect(option) {
  if (!option || loading) return;

  // Show selected option
  pushMessage({
    sender: "user",
    type: "text",
    text: option.label,
  });

  // ================================================
  // PHOTO
  // ================================================

  if (option.category === "photo_upload") {

    pushMessage({
      sender: "bot",
      type: "text",
      text: "Sure! Please select a photo to upload.",
    });

    if (onRequestMedia) {
      onRequestMedia("image");
    }

    return;
  }

  // ================================================
  // VIDEO
  // ================================================

  if (option.category === "video_upload") {

    pushMessage({
      sender: "bot",
      type: "text",
      text: "Sure! Please select a video to upload.",
    });

    if (onRequestMedia) {
      onRequestMedia("video");
    }

    return;
  }

  // ================================================
  // NORMAL ACTION
  // ================================================

  await sendToBackend(
    option.message,
    {
      category: option.category
    }
  );
}
  // ==================================================
  // NORMAL MESSAGE
  // ==================================================

  async function handleSendText(text) {
    const cleanText = text?.trim();

    if (!cleanText || loading) {
      return;
    }

    pushMessage({
      sender: "user",
      type: "text",
      text: cleanText,
    });

    await sendToBackend(cleanText);
  }

  // ==================================================
  // MEDIA
  // ==================================================

  async function handleSendMedia(
    media,
    caption
  ) {
    if (!media) return;

    pushMessage({
      sender: "user",
      type: media.kind,
      url: media.url,
      fileName: media.fileName,
      text: caption || "",
    });

    /*
     * Current UI preview.
     *
     * Once your backend upload endpoint is ready,
     * replace this with:
     *
     * POST /chatbot/media
     */

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "conversationId",
        conversationId
      );

      formData.append(
        "media",
        media.file
      );

      if (caption) {
        formData.append(
          "caption",
          caption
        );
      }

      const response = await API.post(
        "/chatbot/media",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      if (
        response.data?.success &&
        response.data?.reply
      ) {
        pushMessage({
          sender: "bot",
          type: "text",
          text: response.data.reply,
        });
      }

    } catch (err) {
      console.error(
        "Chatbot media error:",
        err
      );

      setError(
        "Unable to upload the file."
      );

    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // ERROR
  // ==================================================

  function handleError(msg) {
    setError(msg);

    setTimeout(() => {
      setError("");
    }, 3000);
  }

  // ==================================================
  // CLOSED
  // ==================================================

  if (!isOpen) {
    return null;
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="chatbot-window">

      {/* HEADER */}

      <div className="chatbot-header">

        <div className="chatbot-header-info">

          <div className="chatbot-avatar">
            S
          </div>

          <div>
            <h4>
              ServiceHub Assistant
            </h4>

            <span className="chatbot-status">
              ● Online
            </span>
          </div>

        </div>

        <div className="chatbot-header-actions">

          <button
            type="button"
            onClick={onClose}
          >
            <FiMinus />
          </button>

          <button
            type="button"
            onClick={onClose}
          >
            <FiX />
          </button>

        </div>

      </div>

      {/* BODY */}

      <div
        className="chatbot-body"
        ref={bodyRef}
      >

        {initialLoading && (
          <div className="chatbot-loading">
            Loading chat...
          </div>
        )}

        {!initialLoading &&
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
            />
          ))}

        {loading && (
          <div className="chat-msg-row bot">

            <div className="chat-avatar">
              S
            </div>

            <div className="chat-bubble">
              <p>
                Typing...
              </p>
            </div>

          </div>
        )}

        {error && (
          <div className="chatbot-error">
            {error}
          </div>
        )}

      </div>

      {/* QUICK REPLIES */}

      {!initialLoading &&
        quickReplies.length > 0 && (
          <QuickReplies
            options={quickReplies}
            onSelect={handleQuickSelect}
            disabled={loading}
          />
        )}

      {/* INPUT */}

      <ChatInput
        onSendText={handleSendText}
        onSendMedia={handleSendMedia}
        onError={handleError}
        disabled={loading}
      />

    </div>
  );
}