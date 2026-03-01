const User = require('../models/User');
const Invoice = require('../models/Invoice');

/**
 * Get platform-wide statistics for the admin dashboard.
 */
const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ deletedAt: null });
    const totalInvoices = await Invoice.countDocuments();
    
    // Sum platform-wide revenue using aggregation
    const revenueData = await Invoice.aggregate([
      {
        $project: {
          total: {
            $add: [
              { $add: [
                { $reduce: {
                  input: "$items",
                  initialValue: 0,
                  in: { $add: ["$$value", { $multiply: ["$$this.quantity", "$$this.unit_cost"] }] }
                }},
                { $multiply: [
                  { $reduce: {
                    input: "$items",
                    initialValue: 0,
                    in: { $add: ["$$value", { $multiply: ["$$this.quantity", "$$this.unit_cost"] }] }
                  }},
                  { $divide: ["$taxRate", 100] }
                ]}
              ]},
              { $subtract: [
                { $add: ["$shipping", 0] },
                { $multiply: [
                  { $reduce: {
                    input: "$items",
                    initialValue: 0,
                    in: { $add: ["$$value", { $multiply: ["$$this.quantity", "$$this.unit_cost"] }] }
                  }},
                  { $divide: ["$discountRate", 100] }
                ]}
              ]}
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" }
        }
      }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalInvoices,
        totalRevenue: Math.round(totalRevenue * 100) / 100
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all users (excluding sensitive info).
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ deletedAt: null })
      .select('name email role googleId createdAt')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

/**
 * List all invoices across the entire platform.
 */
const getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, invoices });
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete a user by setting deletedAt timestamp.
 */
const softDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own admin account." });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ success: true, message: "User soft-deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getAllUsers,
  getAllInvoices,
  softDeleteUser
};
