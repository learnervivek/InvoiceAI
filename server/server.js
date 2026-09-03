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
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB middleware for Vercel serverless requests
app.use(async (req, res, next) => {
  // Non-database routes do not need to wait for DB connection
  if (req.path === '/api' || req.path === '/api/health' || req.path === '/api/auth/google') {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database middleware error:', err.message);
    res.status(500).json({ message: 'Database connection failed: ' + err.message });
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
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
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'Invoice Generator API Server is running', timestamp: new Date().toISOString() });
});

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
app.use('/api/ai', aiRoutes);

// Error handler
app.use(errorHandler);

// Only start background server & cron jobs in standalone / local development mode
if (require.main === module) {
  const { startOverdueCron } = require('./utils/overdueCron');
  const { startRecurringCron } = require('./utils/recurringCron');

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startOverdueCron();
    startRecurringCron();
  });
}

module.exports = app;
