/**
 * Role-Based Access Control (RBAC) Middleware & Permission Enforcement
 */

// Restricts route to specific roles (e.g. requireRole('admin'))
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ message: 'Forbidden: Insufficient role privileges' });
  };
};

const requireAdmin = requireRole('admin');

module.exports = {
  requireRole,
  requireAdmin,
};
