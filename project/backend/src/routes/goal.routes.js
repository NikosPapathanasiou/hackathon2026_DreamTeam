/**
 * Goal Routes
 */

const express = require('express');
const router = express.Router();
const {
  getGoalsByChild,
  getGoalById,
  createGoal,
  updateGoal,
  contributeToGoal,
  withdrawFromGoal,
  deleteGoal
} = require('../controllers/goal.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticateToken);

// Get all goals for a child
router.get('/child/:childId', getGoalsByChild);

// Get specific goal
router.get('/:id', getGoalById);

// Create new goal
router.post('/', createGoal);

// Update goal
router.patch('/:id', updateGoal);

// Contribute money to goal
router.post('/:id/contribute', contributeToGoal);

// Withdraw money from goal
router.post('/:id/withdraw', withdrawFromGoal);

// Delete goal
router.delete('/:id', deleteGoal);

module.exports = router;
