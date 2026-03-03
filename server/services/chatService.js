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
const User = require('../models/User');

const processMessage = async (userId, { message, invoiceId, invoiceData }) => {
  // Fetch user to get profile details (companyName, address, phone)
  const user = await User.findById(userId).lean();
  
  // ── Smart Intent Detection ───────────────────────────────────────────
  // If the message looks like a complex creation prompt, bypass the rule-based engine
  const looksLikeComplexPrompt = /^(create|make|build)\s+(a\s+)?invoice\s+for/i.test(message);
  
  if (looksLikeComplexPrompt) {
    console.log('Detected complex prompt in chat, routing to AI extraction...');
    const aiService = require('./aiService');
    const result = await aiService.extractInvoiceData(message);
    
    // Merge user's profile info if not provided by AI
    const from = {
      name: result.senderName || user?.companyName || user?.name || '',
      email: user?.email || '',
      address: result.senderAddress || user?.address || '',
      phone: user?.phone || '',
    };

    const finalState = {
      ...engine.createDefaultState(user),
      from,
      to: {
        name: result.clientName || '',
        email: result.clientEmail || '',
        address: result.clientAddress || '',
      },
      items: result.items || [],
      taxRate: result.tax || 0,
      currency: result.currency || 'INR',
      dueDate: result.dueDate || '',
    };

    return {
      botMessage: `✨ I've generated an invoice for **${finalState.to.name || 'your client'}** based on your message!`,
      invoiceData: engine.recalculateTotals(finalState),
      invoiceId: invoiceId || null,
      intent: 'AI_CREATE',
      isComplete: true,
    };
  }

  // Run the conversational engine (stateless logic, but handles default initialization)
  const result = engine.processMessage(message, invoiceData || null, user);

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
