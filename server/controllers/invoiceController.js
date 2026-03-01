const invoiceService = require('../services/invoiceService');

// ─── Invoice Controller ───────────────────────────────────────────────────────
// Thin layer — handles only HTTP request/response, delegates to service.

const getInvoices = async (req, res, next) => {
  try {
    const result = await invoiceService.listInvoices(req.user._id, req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoice(req.params.id, req.user._id);
    res.json({ invoice });
  } catch (error) {
    next(error);
  }
};

const createInvoice = async (req, res, next) => {
  try {
    const data = req.validatedBody || req.body;
    const invoice = await invoiceService.createInvoice(req.user._id, data);
    res.status(201).json({ invoice });
  } catch (error) {
    next(error);
  }
};

const updateInvoice = async (req, res, next) => {
  try {
    const data = req.validatedBody || req.body;
    const invoice = await invoiceService.updateInvoice(req.params.id, req.user._id, data);
    res.json({ invoice });
  } catch (error) {
    next(error);
  }
};

const deleteInvoice = async (req, res, next) => {
  try {
    await invoiceService.deleteInvoice(req.params.id, req.user._id);
    res.json({ message: 'Invoice deleted' });
  } catch (error) {
    next(error);
  }
};

const generateInvoicePDF = async (req, res, next) => {
  try {
    const result = await invoiceService.generateInvoicePDF(
      req.params.id,
      req.user._id,
      req.query.format
    );

    if (req.query.format === 'base64') {
      return res.json(result);
    }

    res.set({
      'Content-Type': result.contentType,
      'Content-Disposition': `attachment; filename="${result.filename}"`,
    });
    res.send(result.pdfBuffer);
  } catch (error) {
    next(error);
  }
};

const sendInvoice = async (req, res, next) => {
  try {
    const result = await invoiceService.sendInvoice(req.params.id, req.user._id);
    res.json({ message: 'Invoice sent successfully', messageId: result.messageId });
  } catch (error) {
    next(error);
  }
};

const getApiUsage = async (req, res, next) => {
  try {
    const stats = await invoiceService.getApiUsage(req.user._id);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    const invoice = await invoiceService.updateInvoiceStatus(
      req.params.id,
      req.user._id,
      status
    );
    res.json({ invoice });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  generateInvoicePDF,
  sendInvoice,
  getApiUsage,
  updateStatus,
};
