import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token is not revoked
    const [tokens] = await pool.query(
      'SELECT is_revoked FROM session_tokens WHERE token = ?',
      [token]
    );

    if (tokens.length === 0 || tokens[0].is_revoked) {
      return res.status(401).json({ message: 'Invalid or revoked token' });
    }

    // Verify JWT
    jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};
