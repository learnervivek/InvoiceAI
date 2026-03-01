const paymentService = require('../services/paymentService');

// ─── Payment Controller ───────────────────────────────────────────────────────
// Thin layer — handles only HTTP request/response.

/**
 * Create a Razorpay order for an invoice.
 */
const createOrder = async (req, res, next) => {
  try {
    const { invoiceId } = req.body;

    if (!invoiceId) {
      return res.status(400).json({ message: 'invoiceId is required' });
    }

    const order = await paymentService.createOrder(invoiceId, req.user._id);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

/**
 * Verify payment after Razorpay checkout completion.
 */
const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      invoiceId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !invoiceId) {
      return res.status(400).json({ message: 'Missing payment verification fields' });
    }

    const result = await paymentService.verifyPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      invoiceId,
      userId: req.user._id,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Razorpay webhook handler.
 * NOTE: Uses raw body (not JSON parsed) for signature verification.
 */
const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];

    if (!signature) {
      return res.status(400).json({ message: 'Missing signature header' });
    }

    const result = await paymentService.handleWebhook(req.rawBody, signature);
    res.json(result);
  } catch (error) {
    console.error('[Webhook Error]', error.message);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

/**
 * Mock verify payment (Dev only).
 */
const mockVerifyPayment = async (req, res, next) => {
  try {
    const { invoiceId } = req.body;

    if (!invoiceId) {
      return res.status(400).json({ message: 'invoiceId is required' });
    }

    const result = await paymentService.mockVerifyPayment(invoiceId, req.user._id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, verifyPayment, handleWebhook, mockVerifyPayment };
