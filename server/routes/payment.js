const express = require('express');
const { createOrder, verifyPayment, handleWebhook, mockVerifyPayment } = require('../controllers/paymentController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Authenticated endpoints
router.post('/create-order', auth, createOrder);
router.post('/verify', auth, verifyPayment);
router.post('/mock-verify', auth, mockVerifyPayment);

// Webhook — no auth (Razorpay calls this directly)
// Signature verification is done in the service layer
router.post('/webhook', handleWebhook);

module.exports = router;
