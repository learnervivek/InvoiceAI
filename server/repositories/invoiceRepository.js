const Invoice = require('../models/Invoice');

// ─── Invoice Repository ───────────────────────────────────────────────────────
// Pure database operations — no business logic.

/**
 * Find all invoices for a user with optional filtering and pagination.
 * @returns {{ invoices, total }}
 */
const findByUser = async (userId, { status, page = 1, limit = 20 } = {}) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const filter = { userId };
  if (status && ['draft', 'sent', 'viewed', 'paid', 'overdue'].includes(status)) {
    filter.status = status;
  }

  const [invoices, total] = await Promise.all([
    Invoice.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-conversationHistory'),
    Invoice.countDocuments(filter),
  ]);

  return {
    invoices,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  };
};

/**
 * Find a single invoice belonging to a user.
 */
const findOneByUser = async (id, userId) => {
  return Invoice.findOne({ _id: id, userId });
};

/**
 * Create a new invoice for a user.
 */
const create = async (userId, data) => {
  return Invoice.create({ userId, ...data });
};

/**
 * Update an invoice belonging to a user.
 * @returns {Invoice|null}
 */
const update = async (id, userId, data) => {
  return Invoice.findOneAndUpdate(
    { _id: id, userId },
    { $set: data },
    { new: true, runValidators: true }
  );
};

/**
 * Delete an invoice belonging to a user.
 * @returns {Invoice|null}
 */
const remove = async (id, userId) => {
  return Invoice.findOneAndDelete({ _id: id, userId });
};

/**
 * Update invoice status with corresponding timestamp.
 */
const updateStatus = async (id, status) => {
  const updateData = { status };

  // Set timestamps based on status transition
  if (status === 'sent') updateData.sentAt = new Date();
  if (status === 'viewed') updateData.viewedAt = new Date();
  if (status === 'paid') updateData.paidAt = new Date();

  return Invoice.findByIdAndUpdate(id, updateData, { new: true });
};

/**
 * Find invoices that are past due and not paid.
 */
const findOverdueInvoices = async () => {
  const now = new Date();
  return Invoice.find({
    status: { $nin: ['paid', 'overdue'] },
    dueDate: { $lt: now, $ne: null },
  });
};

/**
 * Bulk mark invoices as overdue.
 */
const bulkMarkOverdue = async (invoiceIds) => {
  return Invoice.updateMany(
    { _id: { $in: invoiceIds } },
    { $set: { status: 'overdue' } }
  );
};

module.exports = {
  findByUser,
  findOneByUser,
  create,
  update,
  remove,
  updateStatus,
  findOverdueInvoices,
  bulkMarkOverdue,
};
