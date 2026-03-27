/**
 * Authentication Middleware
 * Person 1: Backend Developer
 */

const jwt = require('jsonwebtoken');

/**
 * Verify JWT token from Authorization header
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user; // Attach user info to request
    next();
  });
};

/**
 * Verify user owns the child account
 */
const verifyChildOwnership = async (req, res, next) => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const childId = parseInt(req.params.childId || req.body.childId);

    if (!childId) {
      return res.status(400).json({ error: 'Child ID required' });
    }

    const child = await prisma.child.findUnique({
      where: { id: childId }
    });

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    if (child.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied: Not your child account' });
    }

    req.child = child;
    next();
  } catch (error) {
    console.error('Ownership verification error:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  authenticateToken,
  verifyChildOwnership
};
