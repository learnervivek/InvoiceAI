const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  quantity: { type: Number, default: 1 },
  unit_cost: { type: Number, default: 0 },
  description: { type: String, default: '' },
});

const invoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'viewed', 'paid', 'overdue'],
      default: 'draft',
    },
    invoiceNumber: {
      type: String,
      default: '',
    },
    // Sender info
    from: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      address: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    // Recipient info
    to: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      address: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    // Line items
    items: [lineItemSchema],
    // Financial
    taxRate: { type: Number, default: 0 },
    discountRate: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    // Extra
    notes: { type: String, default: '' },
    terms: { type: String, default: '' },
    dueDate: { type: Date },
    issueDate: { type: Date, default: Date.now },
    // Status timestamps
    sentAt: { type: Date },
    viewedAt: { type: Date },
    paidAt: { type: Date },
    // PDF
    pdfUrl: { type: String, default: '' },
    // Recurring
    recurringType: {
      type: String,
      enum: ['weekly', 'monthly', 'yearly', null],
      default: null,
    },
    nextRunDate: { type: Date, default: null },
    parentInvoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      default: null,
    },
    // Chat history for this invoice
    conversationHistory: [
      {
        role: { type: String, enum: ['user', 'bot'] },
        message: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: computed subtotal
invoiceSchema.virtual('subtotal').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0);
});

// Virtual: computed total
invoiceSchema.virtual('total').get(function () {
  const subtotal = this.items.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0);
  const tax = subtotal * (this.taxRate / 100);
  const discount = subtotal * (this.discountRate / 100);
  return subtotal + tax - discount + (this.shipping || 0);
});

// ── Compound Indexes ──────────────────────────────────────────────────────────
invoiceSchema.index({ userId: 1, status: 1 });
invoiceSchema.index({ userId: 1, createdAt: -1 });
invoiceSchema.index({ userId: 1, invoiceNumber: 1 });
invoiceSchema.index({ status: 1, dueDate: 1 });
// Index for recurring cron: find invoices due for regeneration
invoiceSchema.index({ recurringType: 1, nextRunDate: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
