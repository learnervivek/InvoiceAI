const Invoice = require('../models/Invoice');

// ─── Chat Repository ──────────────────────────────────────────────────────────
// Database operations for chat/conversation features.

/**
 * Update an existing invoice with new data and push conversation messages.
 */
const updateInvoiceWithHistory = async (invoiceId, userId, data, messages) => {
  return Invoice.findOneAndUpdate(
    { _id: invoiceId, userId },
    {
      $set: data,
      $push: {
        conversationHistory: { $each: messages },
      },
    },
    { new: true }
  );
};

/**
 * Create a new invoice with initial conversation history.
 */
const createInvoiceWithHistory = async (userId, data, messages) => {
  return Invoice.create({
    userId,
    ...data,
    conversationHistory: messages,
  });
};

module.exports = { updateInvoiceWithHistory, createInvoiceWithHistory };
