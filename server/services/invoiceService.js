const invoiceRepository = require('../repositories/invoiceRepository');
const { generatePDF, getUsageStats } = require('./pdfService');
const { sendInvoiceEmail } = require('./emailService');
const User = require('../models/User');
const generateInvoiceNumber = require('../utils/generateInvoiceNumber');
const { sanitizeDates, sanitizeInvoiceNumber } = require('../utils/sanitizeData');

// ─── Invoice Service ──────────────────────────────────────────────────────────
// Business logic layer — no req/res handling.

/**
 * List invoices for a user with pagination.
 */
const listInvoices = async (userId, query) => {
  return invoiceRepository.findByUser(userId, query);
};

/**
 * Get a single invoice. Throws 404-style error if not found.
 */
const getInvoice = async (id, userId) => {
  const invoice = await invoiceRepository.findOneByUser(id, userId);
  if (!invoice) {
    const err = new Error('Invoice not found');
    err.statusCode = 404;
    throw err;
  }
  return invoice;
};

/**
 * Create a new invoice draft.
 * - Sanitizes empty date strings
 * - Auto-generates invoice number if missing
 */
const createInvoice = async (userId, data) => {
  sanitizeDates(data);

  if (!data.invoiceNumber) {
    data.invoiceNumber = generateInvoiceNumber();
  }

  return invoiceRepository.create(userId, data);
};

/**
 * Update an existing invoice.
 * - Sanitizes empty date strings
 * - Prevents blank invoice number overwrite
 */
const updateInvoice = async (id, userId, data) => {
  sanitizeDates(data);
  sanitizeInvoiceNumber(data);

  const invoice = await invoiceRepository.update(id, userId, data);
  if (!invoice) {
    const err = new Error('Invoice not found');
    err.statusCode = 404;
    throw err;
  }
  return invoice;
};

/**
 * Delete an invoice.
 */
const deleteInvoice = async (id, userId) => {
  const invoice = await invoiceRepository.remove(id, userId);
  if (!invoice) {
    const err = new Error('Invoice not found');
    err.statusCode = 404;
    throw err;
  }
  return invoice;
};

/**
 * Generate a PDF for an invoice.
 * @param {string} format - 'base64' or 'buffer' (default)
 * @returns {{ pdfBuffer?, pdfBase64?, contentType?, filename }}
 */
const generateInvoicePDF = async (id, userId, format) => {
  const invoice = await getInvoice(id, userId);

  const result = await generatePDF(invoice.toObject(), {
    userId,
    invoiceId: invoice._id,
  });

  if (!result.success) {
    const err = new Error(result.error);
    err.statusCode = result.statusCode || 500;
    err.errorType = result.errorType;
    throw err;
  }

  // PDF generation doesn't change invoice status (stays draft until sent)

  const filename = `invoice-${invoice.invoiceNumber || invoice._id}.pdf`;

  if (format === 'base64') {
    return {
      pdfBase64: result.pdfBase64,
      filename,
      contentType: result.contentType,
    };
  }

  return {
    pdfBuffer: result.pdfBuffer,
    filename,
    contentType: 'application/pdf',
  };
};

/**
 * Send an invoice via email.
 * - Generates PDF first
 * - Sends via Gmail
 * - Updates status to 'sent'
 */
const sendInvoice = async (id, userId) => {
  const invoice = await getInvoice(id, userId);

  if (!invoice.to?.email) {
    const err = new Error('Recipient email is required');
    err.statusCode = 400;
    throw err;
  }

  // Get user's refresh token
  const user = await User.findById(userId);
  if (!user.refreshToken) {
    const err = new Error('Gmail not connected. Please sign out and sign in again to authorize Gmail access.');
    err.statusCode = 401;
    err.errorType = 'TOKEN_REVOKED';
    throw err;
  }

  // Generate PDF
  const pdfResult = await generatePDF(invoice.toObject(), {
    userId,
    invoiceId: invoice._id,
  });

  if (!pdfResult.success) {
    const err = new Error(pdfResult.error || 'PDF generation failed');
    err.statusCode = pdfResult.statusCode || 500;
    err.errorType = pdfResult.errorType;
    throw err;
  }

  // Create payment link if not paid
  let paymentLink = null;
  if (invoice.status !== 'paid') {
    try {
      const paymentService = require('./paymentService');
      paymentLink = await paymentService.createPaymentLink(invoice._id, userId);
      console.log(`[Invoice Service] Payment link generated: ${paymentLink}`);
    } catch (paymentErr) {
      console.error('[Invoice Service] Failed to create payment link. Check your Razorpay keys in .env. Error:', paymentErr.message);
      // Continue without payment link if it fails
    }
  }

  // Send email
  const filename = `invoice-${invoice.invoiceNumber || invoice._id}.pdf`;
  const emailResult = await sendInvoiceEmail(userId, user.refreshToken, {
    invoice: invoice.toObject(),
    pdfBuffer: pdfResult.pdfBuffer,
    filename,
    paymentLink,
  });

  if (!emailResult.success) {
    const statusMap = {
      TOKEN_REVOKED: 401,
      PERMISSION_DENIED: 403,
      INVALID_RECIPIENT: 400,
      RATE_LIMIT: 429,
    };
    const err = new Error(emailResult.error);
    err.statusCode = statusMap[emailResult.errorType] || 500;
    err.errorType = emailResult.errorType;
    throw err;
  }

  // Update status
  await invoiceRepository.updateStatus(invoice._id, 'sent');

  return { messageId: emailResult.messageId };
};

/**
 * Get API usage stats for the current month.
 */
const getApiUsage = async (userId) => {
  return getUsageStats(userId);
};

/**
 * Update invoice status manually (PATCH endpoint).
 * Enforces valid transitions.
 */
const updateInvoiceStatus = async (id, userId, newStatus) => {
  const validStatuses = ['draft', 'sent', 'viewed', 'paid', 'overdue'];
  if (!validStatuses.includes(newStatus)) {
    const err = new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }

  const invoice = await getInvoice(id, userId);

  // Enforce valid status transitions
  const transitions = {
    draft: ['sent'],
    sent: ['viewed', 'paid', 'overdue'],
    viewed: ['paid', 'overdue'],
    overdue: ['paid'],
    paid: [], // terminal state
  };

  const allowedNext = transitions[invoice.status] || [];
  if (!allowedNext.includes(newStatus)) {
    const err = new Error(
      `Cannot transition from '${invoice.status}' to '${newStatus}'. Allowed: ${allowedNext.join(', ') || 'none (terminal state)'}`
    );
    err.statusCode = 400;
    throw err;
  }

  return invoiceRepository.updateStatus(invoice._id, newStatus);
};

module.exports = {
  listInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  generateInvoicePDF,
  sendInvoice,
  getApiUsage,
  updateInvoiceStatus,
};
