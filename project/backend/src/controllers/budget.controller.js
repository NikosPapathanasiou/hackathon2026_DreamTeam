/**
 * Budget Controller
 * Person 1: Backend Developer
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Create budget/spending limit
 * POST /api/budgets
 */
const createBudget = async (req, res) => {
  try {
    const { childId, category, limitAmount, period } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!childId || !category || !limitAmount) {
      return res.status(400).json({ error: 'childId, category, and limitAmount are required' });
    }

    // Verify child belongs to user
    const child = await prisma.child.findFirst({
      where: { id: parseInt(childId), userId }
    });

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    // Create budget
    const budget = await prisma.budget.create({
      data: {
        childId: parseInt(childId),
        category,
        limitAmount: parseFloat(limitAmount),
        period: period || 'weekly'
      }
    });

    res.status(201).json({
      message: 'Budget created successfully',
      budget
    });
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({ error: 'Failed to create budget' });
  }
};

/**
 * Get budgets for a child
 * GET /api/budgets/child/:childId
 */
const getBudgetsByChild = async (req, res) => {
  try {
    const childId = parseInt(req.params.childId);
    const userId = req.user.userId;

    // Verify ownership
    const child = await prisma.child.findFirst({
      where: { id: childId, userId }
    });

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    const budgets = await prisma.budget.findMany({
      where: { childId },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate budget status
    const budgetsWithStatus = budgets.map(budget => ({
      ...budget,
      percentUsed: (budget.currentSpent / budget.limitAmount) * 100,
      remaining: budget.limitAmount - budget.currentSpent
    }));

    res.json({ budgets: budgetsWithStatus });
  } catch (error) {
    console.error('Fetch budgets error:', error);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
};

/**
 * Update budget
 * PATCH /api/budgets/:budgetId
 */
const updateBudget = async (req, res) => {
  try {
    const budgetId = parseInt(req.params.budgetId);
    const userId = req.user.userId;
    const { category, limitAmount, currentSpent, period } = req.body;

    // Get budget and verify ownership
    const existingBudget = await prisma.budget.findUnique({
      where: { id: budgetId },
      include: { child: true }
    });

    if (!existingBudget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    if (existingBudget.child.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update budget
    const budget = await prisma.budget.update({
      where: { id: budgetId },
      data: {
        ...(category && { category }),
        ...(limitAmount && { limitAmount: parseFloat(limitAmount) }),
        ...(currentSpent !== undefined && { currentSpent: parseFloat(currentSpent) }),
        ...(period && { period })
      }
    });

    res.json({
      message: 'Budget updated successfully',
      budget
    });
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({ error: 'Failed to update budget' });
  }
};

/**
 * Delete budget
 * DELETE /api/budgets/:budgetId
 */
const deleteBudget = async (req, res) => {
  try {
    const budgetId = parseInt(req.params.budgetId);
    const userId = req.user.userId;

    // Get budget and verify ownership
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
      include: { child: true }
    });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    if (budget.child.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete budget
    await prisma.budget.delete({
      where: { id: budgetId }
    });

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ error: 'Failed to delete budget' });
  }
};

/**
 * Reset budget spending (for new period)
 * POST /api/budgets/:budgetId/reset
 */
const resetBudget = async (req, res) => {
  try {
    const budgetId = parseInt(req.params.budgetId);
    const userId = req.user.userId;

    // Get budget and verify ownership
    const existingBudget = await prisma.budget.findUnique({
      where: { id: budgetId },
      include: { child: true }
    });

    if (!existingBudget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    if (existingBudget.child.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Reset currentSpent to 0
    const budget = await prisma.budget.update({
      where: { id: budgetId },
      data: { currentSpent: 0 }
    });

    res.json({
      message: 'Budget reset successfully',
      budget
    });
  } catch (error) {
    console.error('Reset budget error:', error);
    res.status(500).json({ error: 'Failed to reset budget' });
  }
};

module.exports = {
  createBudget,
  getBudgetsByChild,
  updateBudget,
  deleteBudget,
  resetBudget
};
