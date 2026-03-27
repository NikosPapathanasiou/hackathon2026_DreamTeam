/**
 * Budget Routes
 * Person 1: Backend Developer
 */

const express = require('express');
const router = express.Router();
const {
  createBudget,
  getBudgetsByChild,
  updateBudget,
  deleteBudget,
  resetBudget
} = require('../controllers/budget.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticateToken);

router.post('/', createBudget);
router.get('/child/:childId', getBudgetsByChild);
router.patch('/:budgetId', updateBudget);
router.delete('/:budgetId', deleteBudget);
router.post('/:budgetId/reset', resetBudget);

module.exports = router;
