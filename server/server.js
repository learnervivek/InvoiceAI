require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const invoiceRoutes = require('./routes/invoices');
const chatRoutes = require('./routes/chat');
const analyticsRoutes = require('./routes/analytics');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({
  limit: '10mb',
  verify: (req, _res, buf) => {
    // Store raw body for webhook signature verification
    req.rawBody = buf.toString();
  },
}));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Error handler
app.use(errorHandler);
// Background jobs
const { startOverdueCron } = require('./utils/overdueCron');
const { startRecurringCron } = require('./utils/recurringCron');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startOverdueCron();
  startRecurringCron();
});

module.exports = app;
