const Razorpay = require('razorpay');

// ─── Razorpay Payment Repository ──────────────────────────────────────────────
// Wraps the Razorpay SDK. Pure external API operations.

let razorpayInstance = null;

/**
 * Get or create the Razorpay SDK instance.
 */
const getInstance = () => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

/**
 * Create a Razorpay order.
 * @param {number} amount - Amount in smallest currency unit (paise for INR, cents for USD)
 * @param {string} currency
 * @param {string} receipt - Unique receipt ID (invoice ID)
 * @param {object} notes - Metadata to attach
 */
const createOrder = async ({ amount, currency, receipt, notes }) => {
  const rzp = getInstance();
  return rzp.orders.create({
    amount,
    currency,
    receipt,
    notes,
  });
};

/**
 * Fetch an order by ID.
 */
const fetchOrder = async (orderId) => {
  const rzp = getInstance();
  return rzp.orders.fetch(orderId);
};

module.exports = { createOrder, fetchOrder };
