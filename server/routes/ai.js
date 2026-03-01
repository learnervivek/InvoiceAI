const express = require('express');
const { createInvoiceFromPrompt, editInvoiceFromPrompt, getAIInsights } = require('../controllers/aiController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Protected AI routes
router.post('/create-invoice', auth, createInvoiceFromPrompt);
router.post('/edit-invoice', auth, editInvoiceFromPrompt);
router.get('/insights', auth, getAIInsights);

module.exports = router;
