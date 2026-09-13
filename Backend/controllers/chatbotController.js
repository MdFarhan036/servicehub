import { db } from "../config/db.js";

/*
|--------------------------------------------------------------------------
| GET /api/chatbot/conversation
| Get existing conversation or create new one
|--------------------------------------------------------------------------
*/

export const getConversation = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers["x-chat-session"];

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Chat session is required",
      });
    }

    // Check existing conversation
    const [rows] = await db.query(
      `
      SELECT *
      FROM chatbot_conversations
      WHERE session_id = ?
      LIMIT 1
      `,
      [sessionId]
    );

    if (rows.length > 0) {
      return res.json({
        success: true,
        data: rows[0],
      });
    }

    // Create new conversation
    const [result] = await db.query(
      `
      INSERT INTO chatbot_conversations
      (user_id, session_id)
      VALUES (?, ?)
      `,
      [userId, sessionId]
    );

    const [conversation] = await db.query(
      `
      SELECT *
      FROM chatbot_conversations
      WHERE id = ?
      `,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      data: conversation[0],
    });

  } catch (error) {
    console.error("getConversation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create conversation",
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET MESSAGES
| GET /api/chatbot/messages/:conversationId
|--------------------------------------------------------------------------
*/

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    const [messages] = await db.query(
      `
      SELECT
        id,
        sender,
        message_type,
        message,
        media_url,
        file_name,
        created_at
      FROM chatbot_messages
      WHERE conversation_id = ?
      ORDER BY id ASC
      `,
      [conversationId]
    );

    res.json({
      success: true,
      data: messages,
    });

  } catch (error) {
    console.error("getMessages error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};


/*
|--------------------------------------------------------------------------
| CLIENT - SEND MESSAGE
| POST /api/chatbot/message
|--------------------------------------------------------------------------
*/

export const sendMessage = async (req, res) => {
  try {
    const {
      conversationId,
      message,
      category
    } = req.body;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required"
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const userMessage = message.trim();

    // ==================================================
    // SAVE USER MESSAGE
    // ==================================================

    await db.query(
      `
      INSERT INTO chatbot_messages
      (
        conversation_id,
        sender,
        message_type,
        message
      )
      VALUES (?, 'user', 'text', ?)
      `,
      [
        conversationId,
        userMessage
      ]
    );

    // ==================================================
    // NORMALIZE
    // ==================================================

    const normalized =
      userMessage
        .toLowerCase()
        .trim();

    let reply = "";
    let action = "fallback";
    let data = {};

    // ==================================================
    // 1. GREETING
    // ==================================================

    const greetingWords = [
      "hi",
      "hello",
      "hey",
      "hii",
      "hiii",
      "good morning",
      "good afternoon",
      "good evening",
      "greetings"
    ];

    if (
      greetingWords.some(word =>
        normalized === word ||
        normalized.startsWith(word + " ")
      )
    ) {

      action = "greeting";

      reply =
        "Hi 👋 I'm ServiceHub Assistant. How can I help you today?";
    }

    // ==================================================
    // 2. QUICK REPLIES
    // ==================================================

    else if (
      category === "quick_replies" ||
      normalized.includes("what can you help") ||
      normalized.includes("quick repl") ||
      normalized === "help"
    ) {

      action = "quick_replies";

      reply =
        "Sure! Please choose one of the options below so I can help you.";
    }

    // ==================================================
    // 3. FAQ
    // ==================================================

    else if (
      category === "faq" ||
      normalized === "faq" ||
      normalized.includes("frequently asked")
    ) {

      action = "faq";

      reply =
        "Sure! Please choose a frequently asked question below.";

    }

    // ==================================================
    // 4. BOOKING HELP
    // ==================================================

    else if (
      category === "booking_help" ||
      normalized.includes("booking help") ||
      normalized.includes("help with my booking") ||
      normalized.includes("booking issue")
    ) {

      action = "booking_help";

      reply =
        "Sure! Please share your Booking ID, for example JB-2291, and tell me what issue you're facing.";
    }

    // ==================================================
    // 5. TRACK BOOKING
    // ==================================================

    else if (
      category === "track_booking" ||
      normalized.includes("track booking") ||
      normalized.includes("track my booking") ||
      normalized.includes("booking status")
    ) {

      action = "track_booking";

      reply =
        "Sure! Please provide your Booking ID, for example JB-2291.";

    }

    // ==================================================
    // 6. CANCEL / RESCHEDULE
    // ==================================================

    else if (
      category === "cancel_reschedule" ||
      normalized.includes("cancel") ||
      normalized.includes("reschedule")
    ) {

      action = "cancel_reschedule";

      reply =
        "I can help with that. Please provide your Booking ID and tell me whether you'd like to cancel or reschedule it.";

    }

    // ==================================================
    // 7. PHOTO UPLOAD
    // ==================================================

    else if (
      category === "photo_upload" ||
      normalized.includes("photo upload") ||
      normalized.includes("upload photo") ||
      normalized.includes("upload image")
    ) {

      action = "photo_upload";

      reply =
        "Sure! Please select a photo using the attachment button.";

    }

    // ==================================================
    // 8. VIDEO UPLOAD
    // ==================================================

    else if (
      category === "video_upload" ||
      normalized.includes("video upload") ||
      normalized.includes("upload video")
    ) {

      action = "video_upload";

      reply =
        "Sure! Please select a video using the attachment button.";

    }

    // ==================================================
    // 9. TALK TO AGENT
    // ==================================================

    else if (
      category === "talk_to_agent" ||
      normalized.includes("talk to an agent") ||
      normalized.includes("talk to agent") ||
      normalized.includes("human") ||
      normalized.includes("customer support") ||
      normalized.includes("support agent")
    ) {

      action = "talk_to_agent";

      reply =
        "Sure! I'll connect you with our support team. Please describe your issue while we arrange an agent.";

    }

    // ==================================================
    // 10. FAQ DATABASE MATCH
    // ==================================================

    else {

      const [faqs] = await db.query(
        `
        SELECT
          id,
          question,
          answer,
          category,
          keywords,
          priority
        FROM chatbot_faqs
        WHERE is_active = 1
        ORDER BY priority DESC, id ASC
        `
      );

      let matchedFaq = null;
      let bestScore = 0;

      for (const faq of faqs) {

        let score = 0;

        const question =
          (faq.question || "")
            .toLowerCase();

        const keywords =
          (faq.keywords || "")
            .toLowerCase()
            .split(",")
            .map(k => k.trim())
            .filter(Boolean);

        // Exact question
        if (question === normalized) {
          score += 100;
        }

        // Question contains message
        if (
          normalized.length > 3 &&
          question.includes(normalized)
        ) {
          score += 50;
        }

        // Message contains question
        if (
          question.length > 3 &&
          normalized.includes(question)
        ) {
          score += 40;
        }

        // Keyword match
        for (const keyword of keywords) {

          if (
            keyword.length > 1 &&
            normalized.includes(keyword)
          ) {
            score += 20;
          }

        }

        if (score > bestScore) {
          bestScore = score;
          matchedFaq = faq;
        }
      }

      // Only accept meaningful match
      if (matchedFaq && bestScore >= 20) {

        action = "faq";

        reply = matchedFaq.answer;

        data = {
          faqId: matchedFaq.id
        };

      } else {

        action = "fallback";

        reply =
          "I'm sorry, I couldn't find an answer to that. Please select one of the options below or contact our support team.";
      }
    }

    // ==================================================
    // SAVE BOT MESSAGE
    // ==================================================

    await db.query(
      `
      INSERT INTO chatbot_messages
      (
        conversation_id,
        sender,
        message_type,
        message
      )
      VALUES (?, 'bot', 'text', ?)
      `,
      [
        conversationId,
        reply
      ]
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.json({
      success: true,
      reply,
      action,
      data
    });

  } catch (error) {

    console.error(
      "sendMessage error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to process chatbot message"
    });
  }
};
/*
|--------------------------------------------------------------------------
| ADMIN - GET FAQS
|--------------------------------------------------------------------------
*/

export const getFaqs = async (req, res) => {

  try {

    const [rows] = await db.query(
      `
      SELECT *
      FROM chatbot_faqs
      ORDER BY priority DESC, created_at DESC
      `
    );

    res.json({
      success: true,
      data: rows,
    });

  } catch (error) {

    console.error(
      "Get chatbot FAQs error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch chatbot FAQs",
    });

  }

};


/*
|--------------------------------------------------------------------------
| ADMIN - ADD FAQ
|--------------------------------------------------------------------------
*/

export const addFaq = async (req, res) => {

  try {

    const {
      question,
      answer,
      category,
      keywords,
      is_active,
      priority,
    } = req.body;


    if (!question || !answer) {

      return res.status(400).json({
        success: false,
        message: "Question and answer are required",
      });

    }


    const [result] = await db.query(
      `
      INSERT INTO chatbot_faqs
      (
        question,
        answer,
        category,
        keywords,
        is_active,
        priority
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        question.trim(),
        answer.trim(),
        category || "general",
        keywords || "",
        is_active ?? 1,
        priority ?? 0,
      ]
    );


    res.status(201).json({
      success: true,
      message: "FAQ added successfully",
      id: result.insertId,
    });

  } catch (error) {

    console.error(
      "Add chatbot FAQ error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to add FAQ",
    });

  }

};


/*
|--------------------------------------------------------------------------
| ADMIN - UPDATE FAQ
|--------------------------------------------------------------------------
*/

export const updateFaq = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      question,
      answer,
      category,
      keywords,
      is_active,
      priority,
    } = req.body;


    if (!question || !answer) {

      return res.status(400).json({
        success: false,
        message: "Question and answer are required",
      });

    }


    await db.query(
      `
      UPDATE chatbot_faqs
      SET
        question = ?,
        answer = ?,
        category = ?,
        keywords = ?,
        is_active = ?,
        priority = ?
      WHERE id = ?
      `,
      [
        question.trim(),
        answer.trim(),
        category || "general",
        keywords || "",
        is_active ?? 1,
        priority ?? 0,
        id,
      ]
    );


    res.json({
      success: true,
      message: "FAQ updated successfully",
    });

  } catch (error) {

    console.error(
      "Update chatbot FAQ error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update FAQ",
    });

  }

};


/*
|--------------------------------------------------------------------------
| ADMIN - DELETE FAQ
|--------------------------------------------------------------------------
*/

export const deleteFaq = async (req, res) => {

  try {

    const { id } = req.params;

    await db.query(
      `
      DELETE FROM chatbot_faqs
      WHERE id = ?
      `,
      [id]
    );


    res.json({
      success: true,
      message: "FAQ deleted successfully",
    });

  } catch (error) {

    console.error(
      "Delete chatbot FAQ error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete FAQ",
    });

  }

};


/*
|--------------------------------------------------------------------------
| CLIENT - QUICK REPLIES
|--------------------------------------------------------------------------
*/

export const getQuickReplies = async (req, res) => {

  try {

    const [rows] = await db.query(
      `
      SELECT
        id,
        label,
        message,
        category
      FROM chatbot_quick_replies
      WHERE is_active = 1
      ORDER BY sort_order ASC, id ASC
      `
    );


    res.json({
      success: true,
      data: rows,
    });

  } catch (error) {

    console.error(
      "getQuickReplies error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch quick replies",
    });

  }

};

export const addQuickReply = async (req, res) => {
  try {
    const {
      label,
      message,
      category,
      is_active,
      sort_order,
    } = req.body;

    if (!label || !message) {
      return res.status(400).json({
        success: false,
        message: "Label and message are required",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO chatbot_quick_replies
      (
        label,
        message,
        category,
        is_active,
        sort_order
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        label.trim(),
        message.trim(),
        category || "general",
        is_active ?? 1,
        sort_order ?? 0,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Quick reply added successfully",
      id: result.insertId,
    });

  } catch (error) {
    console.error(
      "Add chatbot quick reply error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to add quick reply",
    });
  }
};


/*
|--------------------------------------------------------------------------
| ADMIN - UPDATE QUICK REPLY
| PUT /api/chatbot/quick-replies/:id
|--------------------------------------------------------------------------
*/

export const updateQuickReply = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      label,
      message,
      category,
      is_active,
      sort_order,
    } = req.body;

    if (!label || !message) {
      return res.status(400).json({
        success: false,
        message: "Label and message are required",
      });
    }

    await db.query(
      `
      UPDATE chatbot_quick_replies
      SET
        label = ?,
        message = ?,
        category = ?,
        is_active = ?,
        sort_order = ?
      WHERE id = ?
      `,
      [
        label.trim(),
        message.trim(),
        category || "general",
        is_active ?? 1,
        sort_order ?? 0,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Quick reply updated successfully",
    });

  } catch (error) {
    console.error(
      "Update chatbot quick reply error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update quick reply",
    });
  }
};


/*
|--------------------------------------------------------------------------
| ADMIN - DELETE QUICK REPLY
| DELETE /api/chatbot/quick-replies/:id
|--------------------------------------------------------------------------
*/

export const deleteQuickReply = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      DELETE FROM chatbot_quick_replies
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Quick reply deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete chatbot quick reply error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete quick reply",
    });
  }
};
export const getClientFaqs = async (req, res) => {
  try {

    const [rows] = await db.query(
      `
      SELECT
        id,
        question,
        answer,
        category
      FROM chatbot_faqs
      WHERE is_active = 1
      ORDER BY priority DESC, id ASC
      `
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {

    console.error(
      "getClientFaqs error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs"
    });

  }
};