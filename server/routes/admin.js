const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const {
  getStats,
  getAllUsers,
  getAllInvoices,
  softDeleteUser
} = require('../controllers/adminController');

// All routes here require being logged in AND being an admin
router.use(auth);
router.use(isAdmin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/invoices', getAllInvoices);
router.delete('/users/:id', softDeleteUser);

module.exports = router;
