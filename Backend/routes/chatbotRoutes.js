import express from "express";

import {
  // Conversation
  getConversation,

  // Messages
  getMessages,
  sendMessage,

  // FAQs
  getFaqs,
  addFaq,
  updateFaq,
  deleteFaq,

  // Quick Replies
  getQuickReplies,
  addQuickReply,
  updateQuickReply,
  deleteQuickReply,
} from "../controllers/chatbotController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| CLIENT - CONVERSATION
|--------------------------------------------------------------------------
*/

// Get existing conversation or create new conversation
router.get(
  "/conversation",
  getConversation
);


/*
|--------------------------------------------------------------------------
| CLIENT - MESSAGES
|--------------------------------------------------------------------------
*/

// Get conversation messages
router.get(
  "/messages/:conversationId",
  getMessages
);

// Send user message and get automated bot reply
router.post(
  "/message",
  sendMessage
);


/*
|--------------------------------------------------------------------------
| CLIENT - QUICK REPLIES
|--------------------------------------------------------------------------
*/

// Get active quick replies
router.get(
  "/quick-replies",
  getQuickReplies
);


/*
|--------------------------------------------------------------------------
| ADMIN - FAQs
|--------------------------------------------------------------------------
*/

// Get all FAQs
router.get(
  "/faqs",
  getFaqs
);

// Add FAQ
router.post(
  "/faqs",
  addFaq
);

// Update FAQ
router.put(
  "/faqs/:id",
  updateFaq
);

// Delete FAQ
router.delete(
  "/faqs/:id",
  deleteFaq
);


/*
|--------------------------------------------------------------------------
| ADMIN - QUICK REPLIES
|--------------------------------------------------------------------------
*/

// Add quick reply
router.post(
  "/quick-replies",
  addQuickReply
);

// Update quick reply
router.put(
  "/quick-replies/:id",
  updateQuickReply
);

// Delete quick reply
router.delete(
  "/quick-replies/:id",
  deleteQuickReply
);


export default router;