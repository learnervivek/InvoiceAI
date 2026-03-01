const express = require('express');
const { getSummary } = require('../controllers/analyticsController');
const auth = require('../middlewares/auth');

const router = express.Router();

// All analytics routes require authentication
router.use(auth);

router.get('/summary', getSummary);

module.exports = router;
