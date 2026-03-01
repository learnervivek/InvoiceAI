const aiService = require('../services/aiService');

/**
 * Controller for Natural Language Invoice Building using AI.
 */
const createInvoiceFromPrompt = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const result = await aiService.extractInvoiceData(prompt);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
};

const Invoice = require('../models/Invoice');

const editInvoiceFromPrompt = async (req, res, next) => {
  try {
    const { prompt, currentInvoice } = req.body;

    if (!prompt || !currentInvoice) {
      return res.status(400).json({ message: 'Prompt and currentInvoice are required' });
    }

    const result = await aiService.editInvoiceData(currentInvoice, prompt);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
};

const getAIInsights = async (req, res, next) => {
  try {
    const invoices = await Invoice.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    if (invoices.length === 0) {
      return res.json({ data: null, message: 'Not enough data for insights yet.' });
    }

    const insights = await aiService.generateBusinessInsights(invoices);
    res.json({ data: insights });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvoiceFromPrompt,
  editInvoiceFromPrompt,
  getAIInsights,
};
