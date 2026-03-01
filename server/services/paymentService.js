const crypto = require('crypto');
const paymentRepository = require('../repositories/paymentRepository');
const invoiceRepository = require('../repositories/invoiceRepository');

// ─── Payment Service ──────────────────────────────────────────────────────────
// Business logic for Razorpay payment processing.

/**
 * Create a Razorpay order for an invoice.
 */
const createOrder = async (invoiceId, userId) => {
  const invoice = await invoiceRepository.findOneByUser(invoiceId, userId);

  if (!invoice) {
    const err = new Error('Invoice not found');
    err.statusCode = 404;
    throw err;
  }

  if (invoice.status === 'paid') {
    const err = new Error('Invoice is already paid');
    err.statusCode = 400;
    throw err;
  }

  // Calculate total (same logic as virtual)
  const subtotal = (invoice.items || []).reduce(
    (sum, item) => sum + item.quantity * item.unit_cost, 0
  );
  const tax = subtotal * ((invoice.taxRate || 0) / 100);
  const discount = subtotal * ((invoice.discountRate || 0) / 100);
  const total = subtotal + tax - discount + (invoice.shipping || 0);

  // Razorpay expects amount in smallest currency unit (paise for INR)
  const currency = invoice.currency || 'INR';
  const amountInSmallestUnit = Math.round(total * 100);

  if (amountInSmallestUnit <= 0) {
    const err = new Error('Invoice total must be greater than 0');
    err.statusCode = 400;
    throw err;
  }

  const order = await paymentRepository.createOrder({
    amount: amountInSmallestUnit,
    currency,
    receipt: `inv_${invoice._id}`,
    notes: {
      invoiceId: invoice._id.toString(),
      invoiceNumber: invoice.invoiceNumber || '',
      userId: userId.toString(),
    },
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    invoiceId: invoice._id,
    invoiceNumber: invoice.invoiceNumber,
    keyId: process.env.RAZORPAY_KEY_ID,
  };
};

/**
 * Verify Razorpay payment signature and update invoice status.
 */
const verifyPayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  invoiceId,
  userId,
}) => {
  // Verify signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    const err = new Error('Payment verification failed — invalid signature');
    err.statusCode = 400;
    throw err;
  }

  // Update invoice to paid
  const invoice = await invoiceRepository.updateStatus(invoiceId, 'paid');

  if (!invoice) {
    const err = new Error('Invoice not found');
    err.statusCode = 404;
    throw err;
  }

  return {
    success: true,
    invoiceId: invoice._id,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
  };
};

/**
 * Handle Razorpay webhook events.
 * Verifies webhook signature and processes payment.captured event.
 */
const handleWebhook = async (body, signature) => {
  // Verify webhook signature
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== signature) {
    const err = new Error('Webhook signature verification failed');
    err.statusCode = 400;
    throw err;
  }

  const event = JSON.parse(body);

  if (event.event === 'payment.captured') {
    const payment = event.payload?.payment?.entity;
    const invoiceId = payment?.notes?.invoiceId;

    if (invoiceId) {
      await invoiceRepository.updateStatus(invoiceId, 'paid');
      console.log(`[Webhook] Payment captured for invoice ${invoiceId}, payment ID: ${payment.id}`);
    }
  }

  return { received: true };
};

/**
 * Create a professional Razorpay Payment Link for an invoice.
 * Used for embedding "Pay Now" buttons in emails.
 */
const createPaymentLink = async (invoiceId, userId) => {
  const invoice = await invoiceRepository.findOneByUser(invoiceId, userId);

  if (!invoice) {
    const err = new Error('Invoice not found');
    err.statusCode = 404;
    throw err;
  }

  // Calculate total (same logic as virtual)
  const subtotal = (invoice.items || []).reduce(
    (sum, item) => sum + item.quantity * item.unit_cost, 0
  );
  const tax = subtotal * ((invoice.taxRate || 0) / 100);
  const discount = subtotal * ((invoice.discountRate || 0) / 100);
  const total = subtotal + tax - discount + (invoice.shipping || 0);

  const amountInSmallestUnit = Math.round(total * 100);
  const currency = invoice.currency || 'INR';

  const rzp = new (require('razorpay'))({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const paymentLink = await rzp.paymentLink.create({
    amount: amountInSmallestUnit,
    currency: currency,
    accept_partial: false,
    description: `Invoice #${invoice.invoiceNumber || invoice._id}`,
    customer: {
      name: invoice.to?.name || 'Customer',
      email: invoice.to?.email || '',
      contact: invoice.to?.phone || '',
    },
    notify: {
      sms: false,
      email: true,
    },
    reminder_enable: true,
    notes: {
      invoiceId: invoice._id.toString(),
      userId: userId.toString(),
    },
    callback_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?payment=success&invoiceId=${invoice._id}`,
    callback_method: 'get',
  });

  return paymentLink.short_url;
};

/**
 * Mock payment verification for development/testing.
 * Directly updates status to paid without checking signatures.
 */
const mockVerifyPayment = async (invoiceId, userId) => {
  // Update invoice to paid
  const invoice = await invoiceRepository.updateStatus(invoiceId, 'paid');

  if (!invoice) {
    const err = new Error('Invoice not found');
    err.statusCode = 404;
    throw err;
  }

  return {
    success: true,
    invoiceId: invoice._id,
    mock: true,
  };
};

module.exports = { createOrder, verifyPayment, handleWebhook, createPaymentLink, mockVerifyPayment };
