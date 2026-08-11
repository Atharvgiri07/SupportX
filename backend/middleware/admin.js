// Only lets admins through — use AFTER `protect`, since it relies on req.user being set
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Admin access only' });
};

module.exports = admin;
