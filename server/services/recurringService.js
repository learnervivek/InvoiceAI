const recurringRepository = require('../repositories/recurringRepository');
const generateInvoiceNumber = require('../utils/generateInvoiceNumber');

// ─── Recurring Service ────────────────────────────────────────────────────────
// Business logic for processing recurring invoices.

/**
 * Calculate the next run date based on recurring type.
 */
const calculateNextRunDate = (currentDate, recurringType) => {
  const next = new Date(currentDate);

  switch (recurringType) {
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
    default:
      return null;
  }

  return next;
};

/**
 * Calculate the due date offset from the issue date.
 * If the original had a dueDate, preserve the same day-gap.
 */
const calculateDueDate = (issueDate, originalIssueDate, originalDueDate) => {
  if (!originalDueDate) return null;

  const gap = originalDueDate.getTime() - originalIssueDate.getTime();
  return new Date(issueDate.getTime() + gap);
};

/**
 * Clone an invoice for recurring generation.
 * Inherits the full structure but resets status to draft.
 */
const cloneInvoice = (parentInvoice) => {
  const now = new Date();

  // Calculate due date with same offset as original
  const dueDate = calculateDueDate(
    now,
    parentInvoice.issueDate || parentInvoice.createdAt,
    parentInvoice.dueDate
  );

  return {
    userId: parentInvoice.userId,
    invoiceNumber: generateInvoiceNumber(),
    status: 'draft',
    from: parentInvoice.from ? { ...parentInvoice.from.toObject?.() || parentInvoice.from } : {},
    to: parentInvoice.to ? { ...parentInvoice.to.toObject?.() || parentInvoice.to } : {},
    items: parentInvoice.items?.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unit_cost: item.unit_cost,
      description: item.description || '',
    })) || [],
    taxRate: parentInvoice.taxRate || 0,
    discountRate: parentInvoice.discountRate || 0,
    shipping: parentInvoice.shipping || 0,
    currency: parentInvoice.currency || 'USD',
    notes: parentInvoice.notes || '',
    terms: parentInvoice.terms || '',
    issueDate: now,
    dueDate,
    // Link back to parent
    parentInvoiceId: parentInvoice._id,
    // Clone does NOT inherit recurring settings (only parent recurs)
    recurringType: null,
    nextRunDate: null,
    // Reset all status timestamps
    sentAt: null,
    viewedAt: null,
    paidAt: null,
    pdfUrl: '',
    conversationHistory: [],
  };
};

/**
 * Process all due recurring invoices.
 * @returns {{ processed, errors }} — counts of successful and failed
 */
const processRecurringInvoices = async () => {
  const dueInvoices = await recurringRepository.findDueRecurring();

  if (dueInvoices.length === 0) {
    return { processed: 0, errors: 0 };
  }

  let processed = 0;
  let errors = 0;

  for (const parent of dueInvoices) {
    try {
      // 1. Clone the invoice
      const cloneData = cloneInvoice(parent);
      const newInvoice = await recurringRepository.createClone(cloneData);

      // 2. Calculate and update the next run date on the parent
      const nextRunDate = calculateNextRunDate(parent.nextRunDate, parent.recurringType);
      await recurringRepository.updateNextRunDate(parent._id, nextRunDate);

      console.log(
        `[Recurring] Created invoice ${newInvoice.invoiceNumber} from parent ${parent.invoiceNumber || parent._id} ` +
        `(${parent.recurringType}). Next run: ${nextRunDate?.toISOString().slice(0, 10) || 'none'}`
      );

      processed++;
    } catch (error) {
      console.error(
        `[Recurring] Failed to process invoice ${parent._id}:`,
        error.message
      );
      errors++;
    }
  }

  return { processed, errors };
};

module.exports = {
  processRecurringInvoices,
  calculateNextRunDate,
  cloneInvoice,
};
