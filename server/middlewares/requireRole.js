// ─── Role-Based Access Control Middleware ─────────────────────────────────────
// Usage: router.get('/admin-only', auth, requireRole('admin'), handler)

/**
 * Returns middleware that restricts access to users with one of the specified roles.
 * Must be used AFTER the `auth` middleware (which attaches req.user).
 *
 * @param  {...string} roles — Allowed roles, e.g. 'admin', 'user'
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}.`,
      });
    }

    next();
  };
};

module.exports = requireRole;
