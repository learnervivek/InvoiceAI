const Invoice = require('../models/Invoice');
const mongoose = require('mongoose');

// ─── Analytics Repository ─────────────────────────────────────────────────────
// MongoDB aggregation pipelines for analytics data.

/**
 * Get total revenue for a user (sum of all paid invoices).
 */
const getTotalRevenue = async (userId) => {
  const result = await Invoice.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'paid' } },
    {
      $project: {
        total: {
          $add: [
            {
              $subtract: [
                {
                  $add: [
                    {
                      $reduce: {
                        input: '$items',
                        initialValue: 0,
                        in: { $add: ['$$value', { $multiply: ['$$this.quantity', '$$this.unit_cost'] }] },
                      },
                    },
                    {
                      $multiply: [
                        {
                          $reduce: {
                            input: '$items',
                            initialValue: 0,
                            in: { $add: ['$$value', { $multiply: ['$$this.quantity', '$$this.unit_cost'] }] },
                          },
                        },
                        { $divide: ['$taxRate', 100] },
                      ],
                    },
                  ],
                },
                {
                  $multiply: [
                    {
                      $reduce: {
                        input: '$items',
                        initialValue: 0,
                        in: { $add: ['$$value', { $multiply: ['$$this.quantity', '$$this.unit_cost'] }] },
                      },
                    },
                    { $divide: ['$discountRate', 100] },
                  ],
                },
              ],
            },
            { $ifNull: ['$shipping', 0] },
          ],
        },
      },
    },
    { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
  ]);

  return result[0]?.totalRevenue || 0;
};

/**
 * Get monthly revenue grouped by month (last 12 months).
 */
const getMonthlyRevenue = async (userId) => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const result = await Invoice.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: 'paid',
        paidAt: { $gte: twelveMonthsAgo },
      },
    },
    {
      $project: {
        month: { $month: '$paidAt' },
        year: { $year: '$paidAt' },
        total: {
          $add: [
            {
              $subtract: [
                {
                  $add: [
                    {
                      $reduce: {
                        input: '$items',
                        initialValue: 0,
                        in: { $add: ['$$value', { $multiply: ['$$this.quantity', '$$this.unit_cost'] }] },
                      },
                    },
                    {
                      $multiply: [
                        {
                          $reduce: {
                            input: '$items',
                            initialValue: 0,
                            in: { $add: ['$$value', { $multiply: ['$$this.quantity', '$$this.unit_cost'] }] },
                          },
                        },
                        { $divide: ['$taxRate', 100] },
                      ],
                    },
                  ],
                },
                {
                  $multiply: [
                    {
                      $reduce: {
                        input: '$items',
                        initialValue: 0,
                        in: { $add: ['$$value', { $multiply: ['$$this.quantity', '$$this.unit_cost'] }] },
                      },
                    },
                    { $divide: ['$discountRate', 100] },
                  ],
                },
              ],
            },
            { $ifNull: ['$shipping', 0] },
          ],
        },
      },
    },
    {
      $group: {
        _id: { year: '$year', month: '$month' },
        revenue: { $sum: '$total' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Fill in missing months with 0
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const found = result.find((r) => r._id.year === year && r._id.month === month);
    const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    months.push({
      month: label,
      revenue: found ? Math.round(found.revenue * 100) / 100 : 0,
    });
  }

  return months;
};

/**
 * Get pending amount (sum of sent + viewed invoices).
 */
const getPendingAmount = async (userId) => {
  const result = await Invoice.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: { $in: ['sent', 'viewed'] },
      },
    },
    {
      $project: {
        total: {
          $add: [
            {
              $subtract: [
                {
                  $add: [
                    {
                      $reduce: {
                        input: '$items',
                        initialValue: 0,
                        in: { $add: ['$$value', { $multiply: ['$$this.quantity', '$$this.unit_cost'] }] },
                      },
                    },
                    {
                      $multiply: [
                        {
                          $reduce: {
                            input: '$items',
                            initialValue: 0,
                            in: { $add: ['$$value', { $multiply: ['$$this.quantity', '$$this.unit_cost'] }] },
                          },
                        },
                        { $divide: ['$taxRate', 100] },
                      ],
                    },
                  ],
                },
                {
                  $multiply: [
                    {
                      $reduce: {
                        input: '$items',
                        initialValue: 0,
                        in: { $add: ['$$value', { $multiply: ['$$this.quantity', '$$this.unit_cost'] }] },
                      },
                    },
                    { $divide: ['$discountRate', 100] },
                  ],
                },
              ],
            },
            { $ifNull: ['$shipping', 0] },
          ],
        },
      },
    },
    { $group: { _id: null, pendingAmount: { $sum: '$total' } } },
  ]);

  return result[0]?.pendingAmount || 0;
};

/**
 * Get overdue invoices count.
 */
const getOverdueCount = async (userId) => {
  return Invoice.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
    status: 'overdue',
  });
};

/**
 * Get top 5 clients by revenue.
 */
const getTopClients = async (userId) => {
  const result = await Invoice.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: 'paid',
        'to.name': { $ne: '' },
      },
    },
    {
      $project: {
        clientName: '$to.name',
        clientEmail: '$to.email',
        total: {
          $add: [
            {
              $subtract: [
                {
                  $add: [
                    {
                      $reduce: {
                        input: '$items',
                        initialValue: 0,
                        in: { $add: ['$$value', { $multiply: ['$$this.quantity', '$$this.unit_cost'] }] },
                      },
                    },
                    {
                      $multiply: [
                        {
                          $reduce: {
                            input: '$items',
                            initialValue: 0,
                            in: { $add: ['$$value', { $multiply: ['$$this.quantity', '$$this.unit_cost'] }] },
                          },
                        },
                        { $divide: ['$taxRate', 100] },
                      ],
                    },
                  ],
                },
                {
                  $multiply: [
                    {
                      $reduce: {
                        input: '$items',
                        initialValue: 0,
                        in: { $add: ['$$value', { $multiply: ['$$this.quantity', '$$this.unit_cost'] }] },
                      },
                    },
                    { $divide: ['$discountRate', 100] },
                  ],
                },
              ],
            },
            { $ifNull: ['$shipping', 0] },
          ],
        },
      },
    },
    {
      $group: {
        _id: '$clientName',
        email: { $first: '$clientEmail' },
        totalRevenue: { $sum: '$total' },
        invoiceCount: { $sum: 1 },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 5 },
    {
      $project: {
        _id: 0,
        name: '$_id',
        email: 1,
        totalRevenue: { $round: ['$totalRevenue', 2] },
        invoiceCount: 1,
      },
    },
  ]);

  return result;
};

/**
 * Get invoice status distribution counts.
 */
const getStatusCounts = async (userId) => {
  const result = await Invoice.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const counts = { draft: 0, sent: 0, viewed: 0, paid: 0, overdue: 0 };
  result.forEach((r) => {
    if (counts.hasOwnProperty(r._id)) {
      counts[r._id] = r.count;
    }
  });
  counts.total = Object.values(counts).reduce((a, b) => a + b, 0);

  return counts;
};

module.exports = {
  getTotalRevenue,
  getMonthlyRevenue,
  getPendingAmount,
  getOverdueCount,
  getTopClients,
  getStatusCounts,
};
