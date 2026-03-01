const chatService = require('../services/chatService');

// ─── Chat Controller ──────────────────────────────────────────────────────────
// Thin layer — handles only HTTP request/response, delegates to service.

const processMessage = async (req, res, next) => {
  try {
    const { message, invoiceId, invoiceData } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Message is required' });
    }

    const result = await chatService.processMessage(req.user._id, {
      message,
      invoiceId,
      invoiceData,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { processMessage };
