/**
 * Child Account Routes
 * Person 1: Backend Developer
 */

const express = require('express');
const router = express.Router();
const {
  createChild,
  getChildren,
  getChildById,
  updateChild,
  deleteChild,
  getBalance
} = require('../controllers/child.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticateToken);

router.post('/', createChild);
router.get('/', getChildren);
router.get('/:childId', getChildById);
router.patch('/:childId', updateChild);
router.delete('/:childId', deleteChild);
router.get('/:childId/balance', getBalance);

module.exports = router;
