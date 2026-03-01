const analyticsRepository = require('../repositories/analyticsRepository');

// ─── Analytics Service ────────────────────────────────────────────────────────
// Aggregates all analytics data into a single summary.

/**
 * Get full analytics summary for a user.
 */
const getSummary = async (userId) => {
  const [
    totalRevenue,
    monthlyRevenue,
    pendingAmount,
    overdueCount,
    topClients,
    statusCounts,
  ] = await Promise.all([
    analyticsRepository.getTotalRevenue(userId),
    analyticsRepository.getMonthlyRevenue(userId),
    analyticsRepository.getPendingAmount(userId),
    analyticsRepository.getOverdueCount(userId),
    analyticsRepository.getTopClients(userId),
    analyticsRepository.getStatusCounts(userId),
  ]);

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    monthlyRevenue,
    pendingAmount: Math.round(pendingAmount * 100) / 100,
    overdueCount,
    topClients,
    statusCounts,
  };
};

module.exports = { getSummary };
