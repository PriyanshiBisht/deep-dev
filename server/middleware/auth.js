const jwt = require('jsonwebtoken');

// Reads "Authorization: Bearer <token>", verifies it, and puts the user's id on req.userId
module.exports = function auth(req, res, next) {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'Server is not configured correctly' });
  }

  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Login required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};