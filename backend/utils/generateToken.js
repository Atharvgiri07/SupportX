const jwt = require('jsonwebtoken');

const generateToken = (userOrId, role = 'employee', tokenVersion = 0) => {
  let payload;
  if (typeof userOrId === 'object' && userOrId !== null) {
    payload = {
      id: userOrId._id || userOrId.id,
      role: userOrId.role || 'employee',
      tokenVersion: userOrId.tokenVersion || 0,
    };
  } else {
    payload = {
      id: userOrId,
      role,
      tokenVersion,
    };
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = generateToken;
