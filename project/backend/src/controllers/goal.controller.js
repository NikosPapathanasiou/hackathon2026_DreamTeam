/**
 * Goal Controller
 * Handles savings goals for children
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get all goals for a child
 * GET /api/goals/child/:childId
 */
const getGoalsByChild = async (req, res) => {
  try {
    const childId = parseInt(req.params.childId);
    const userId = req.user.userId;

    // Verify child belongs to user
    const child = await prisma.child.findFirst({
      where: { id: childId, userId }
    });

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    const goals = await prisma.goal.findMany({
      where: { childId },
      orderBy: [
        { completed: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    // Calculate statistics
    const activeGoals = goals.filter(g => !g.completed);
    const completedGoals = goals.filter(g => g.completed);
    const totalSaved = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0);
    const totalTarget = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0);

    res.json({
      goals,
      stats: {
        activeGoals: activeGoals.length,
        completedGoals: completedGoals.length,
        totalSaved: totalSaved.toFixed(2),
        totalTarget: totalTarget.toFixed(2),
        overallProgress: totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Fetch goals error:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
};

/**
 * Get specific goal
 * GET /api/goals/:id
 */
const getGoalById = async (req, res) => {
  try {
    const goalId = parseInt(req.params.id);
    const userId = req.user.userId;

    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        child: { userId }
      },
      include: {
        child: true
      }
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ goal });
  } catch (error) {
    console.error('Fetch goal error:', error);
    res.status(500).json({ error: 'Failed to fetch goal' });
  }
};

/**
 * Create new goal
 * POST /api/goals
 */
const createGoal = async (req, res) => {
  try {
    const { childId, title, description, targetAmount, deadline, imageUrl } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!childId || !title || !targetAmount) {
      return res.status(400).json({
        error: 'childId, title, and targetAmount are required'
      });
    }

    if (targetAmount <= 0) {
      return res.status(400).json({ error: 'Target amount must be greater than 0' });
    }

    // Verify child belongs to user
    const child = await prisma.child.findFirst({
      where: { id: parseInt(childId), userId }
    });

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    const goal = await prisma.goal.create({
      data: {
        childId: parseInt(childId),
        title,
        description: description || null,
        targetAmount: parseFloat(targetAmount),
        deadline: deadline ? new Date(deadline) : null,
        imageUrl: imageUrl || null
      }
    });

    res.status(201).json({
      message: 'Goal created successfully',
      goal
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
};

/**
 * Update goal
 * PATCH /api/goals/:id
 */
const updateGoal = async (req, res) => {
  try {
    const goalId = parseInt(req.params.id);
    const userId = req.user.userId;
    const { title, description, targetAmount, deadline, imageUrl } = req.body;

    // Verify goal belongs to user's child
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        child: { userId }
      }
    });

    if (!existingGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    if (existingGoal.completed) {
      return res.status(400).json({ error: 'Cannot update completed goal' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (targetAmount !== undefined) {
      if (targetAmount <= 0) {
        return res.status(400).json({ error: 'Target amount must be greater than 0' });
      }
      updateData.targetAmount = parseFloat(targetAmount);
    }
    if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: updateData
    });

    res.json({
      message: 'Goal updated successfully',
      goal
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
};

/**
 * Add money to goal
 * POST /api/goals/:id/contribute
 */
const contributeToGoal = async (req, res) => {
  try {
    const goalId = parseInt(req.params.id);
    const { amount } = req.body;
    const userId = req.user.userId;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Get goal with child
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        child: { userId }
      },
      include: { child: true }
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    if (goal.completed) {
      return res.status(400).json({ error: 'Goal already completed' });
    }

    // Check if child has enough balance
    if (goal.child.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const newAmount = goal.currentAmount + parseFloat(amount);
    const isNowCompleted = newAmount >= goal.targetAmount;

    // Update goal and child balance in transaction
    const [updatedGoal, updatedChild] = await prisma.$transaction([
      prisma.goal.update({
        where: { id: goalId },
        data: {
          currentAmount: newAmount,
          completed: isNowCompleted,
          completedAt: isNowCompleted ? new Date() : null
        }
      }),
      prisma.child.update({
        where: { id: goal.childId },
        data: {
          balance: {
            decrement: parseFloat(amount)
          }
        }
      })
    ]);

    res.json({
      message: isNowCompleted ? 'Goal completed! 🎉' : 'Contribution added successfully',
      goal: updatedGoal,
      child: updatedChild
    });
  } catch (error) {
    console.error('Contribute to goal error:', error);
    res.status(500).json({ error: 'Failed to contribute to goal' });
  }
};

/**
 * Withdraw money from goal
 * POST /api/goals/:id/withdraw
 */
const withdrawFromGoal = async (req, res) => {
  try {
    const goalId = parseInt(req.params.id);
    const { amount } = req.body;
    const userId = req.user.userId;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Get goal with child
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        child: { userId }
      },
      include: { child: true }
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    if (goal.currentAmount < amount) {
      return res.status(400).json({ error: 'Insufficient funds in goal' });
    }

    const newAmount = goal.currentAmount - parseFloat(amount);

    // Update goal and child balance in transaction
    const [updatedGoal, updatedChild] = await prisma.$transaction([
      prisma.goal.update({
        where: { id: goalId },
        data: {
          currentAmount: newAmount,
          completed: false,
          completedAt: null
        }
      }),
      prisma.child.update({
        where: { id: goal.childId },
        data: {
          balance: {
            increment: parseFloat(amount)
          }
        }
      })
    ]);

    res.json({
      message: 'Withdrawal successful',
      goal: updatedGoal,
      child: updatedChild
    });
  } catch (error) {
    console.error('Withdraw from goal error:', error);
    res.status(500).json({ error: 'Failed to withdraw from goal' });
  }
};

/**
 * Delete goal
 * DELETE /api/goals/:id
 */
const deleteGoal = async (req, res) => {
  try {
    const goalId = parseInt(req.params.id);
    const userId = req.user.userId;

    // Verify goal belongs to user's child
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        child: { userId }
      },
      include: { child: true }
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    // Return money to child if there's any in the goal
    if (goal.currentAmount > 0) {
      await prisma.child.update({
        where: { id: goal.childId },
        data: {
          balance: {
            increment: goal.currentAmount
          }
        }
      });
    }

    await prisma.goal.delete({
      where: { id: goalId }
    });

    res.json({
      message: 'Goal deleted successfully',
      refunded: goal.currentAmount
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
};

module.exports = {
  getGoalsByChild,
  getGoalById,
  createGoal,
  updateGoal,
  contributeToGoal,
  withdrawFromGoal,
  deleteGoal
};
