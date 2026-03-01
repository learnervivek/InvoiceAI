const engine = require('./conversationEngine');
const chatRepository = require('../repositories/chatRepository');

// ─── Chat Service ─────────────────────────────────────────────────────────────
// Business logic for processing chat messages.

/**
 * Process a chat message through the conversational engine.
 * Handles save/generate actions by persisting to the database.
 *
 * @param {string} userId
 * @param {{ message: string, invoiceId?: string, invoiceData?: object }} params
 * @returns {object} Response with botMessage, invoiceData, invoiceId, intent, etc.
 */
const processMessage = async (userId, { message, invoiceId, invoiceData }) => {
  // Run the conversational engine (pure, stateless)
  const result = engine.processMessage(message, invoiceData || null);

  // ── Handle save / generate actions ──────────────────────────────────────
  if (result.action === 'save' || result.action === 'generate') {
    const { _computed, ...stateToSave } = result.state;
    const status = result.action === 'generate' ? 'generated' : 'draft';

    const messages = [
      { role: 'user', message },
      { role: 'bot', message: `Invoice ${status === 'generated' ? 'generated' : 'saved as draft'}!` },
    ];

    let invoice;
    if (invoiceId) {
      invoice = await chatRepository.updateInvoiceWithHistory(
        invoiceId,
        userId,
        { ...stateToSave, status },
        messages
      );
    } else {
      invoice = await chatRepository.createInvoiceWithHistory(
        userId,
        { ...stateToSave, status },
        messages
      );
    }

    const actionMessage =
      result.action === 'generate'
        ? "Invoice saved! 🎉 Click the **'Download PDF'** button in the preview to generate your PDF."
        : 'Invoice saved as draft! 📝 You can find it in your dashboard.';

    return {
      botMessage: actionMessage,
      invoiceData: result.state,
      invoiceId: invoice._id,
      intent: result.intent,
      isComplete: true,
    };
  }

  // ── Normal response ─────────────────────────────────────────────────────
  return {
    botMessage: result.response,
    invoiceData: result.state,
    invoiceId: invoiceId || null,
    intent: result.intent,
    confidence: result.confidence,
    isComplete: false,
  };
};

module.exports = { processMessage };
