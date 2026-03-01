const Invoice = require('../models/Invoice');

// ─── Recurring Repository ─────────────────────────────────────────────────────
// Database operations for recurring invoice processing.

/**
 * Find all invoices due for recurring generation.
 * Matches invoices where recurringType is set and nextRunDate <= now.
 */
const findDueRecurring = async () => {
  const now = new Date();
  return Invoice.find({
    recurringType: { $ne: null },
    nextRunDate: { $lte: now, $ne: null },
  });
};

/**
 * Create a cloned invoice from a parent.
 * Strips _id, timestamps, status fields so it starts fresh as a draft.
 */
const createClone = async (invoiceData) => {
  return Invoice.create(invoiceData);
};

/**
 * Update the nextRunDate for a recurring parent invoice.
 */
const updateNextRunDate = async (invoiceId, nextRunDate) => {
  return Invoice.findByIdAndUpdate(
    invoiceId,
    { nextRunDate },
    { new: true }
  );
};

module.exports = { findDueRecurring, createClone, updateNextRunDate };
