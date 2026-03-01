const analyticsService = require('../services/analyticsService');

// ─── Analytics Controller ─────────────────────────────────────────────────────
// Thin layer — handles only HTTP request/response.

const getSummary = async (req, res, next) => {
  try {
    const summary = await analyticsService.getSummary(req.user._id);
    res.json(summary);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary };
