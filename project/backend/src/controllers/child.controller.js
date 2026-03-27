/**
 * Child Account Controller
 * Person 1: Backend Developer
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Create new child account
 * POST /api/children
 */
const createChild = async (req, res) => {
  try {
    const { name, age, pin } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!name || !age) {
      return res.status(400).json({ error: 'Name and age are required' });
    }

    if (age < 8 || age > 17) {
      return res.status(400).json({ error: 'Age must be between 8 and 17' });
    }

    // Create child
    const child = await prisma.child.create({
      data: {
        name,
        age: parseInt(age),
        pin: pin || null,
        userId
      }
    });

    res.status(201).json({
      message: 'Child account created successfully',
      child: {
        id: child.id,
        name: child.name,
        age: child.age,
        balance: child.balance
      }
    });
  } catch (error) {
    console.error('Create child error:', error);
    res.status(500).json({ error: 'Failed to create child account' });
  }
};

/**
 * Get all children for logged-in parent
 * GET /api/children
 */
const getChildren = async (req, res) => {
  try {
    const userId = req.user.userId;

    const children = await prisma.child.findMany({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        budgets: true,
        _count: {
          select: {
            transactions: true,
            educationalProgress: true
          }
        }
      }
    });

    res.json({ children });
  } catch (error) {
    console.error('Fetch children error:', error);
    res.status(500).json({ error: 'Failed to fetch children' });
  }
};

/**
 * Get single child by ID
 * GET /api/children/:childId
 */
const getChildById = async (req, res) => {
  try {
    const childId = parseInt(req.params.childId);
    const userId = req.user.userId;

    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        userId
      },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' }
        },
        budgets: true,
        educationalProgress: true
      }
    });

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    res.json({ child });
  } catch (error) {
    console.error('Fetch child error:', error);
    res.status(500).json({ error: 'Failed to fetch child' });
  }
};

/**
 * Update child account
 * PATCH /api/children/:childId
 */
const updateChild = async (req, res) => {
  try {
    const childId = parseInt(req.params.childId);
    const userId = req.user.userId;
    const { name, age, pin } = req.body;

    // Verify ownership
    const existingChild = await prisma.child.findFirst({
      where: { id: childId, userId }
    });

    if (!existingChild) {
      return res.status(404).json({ error: 'Child not found' });
    }

    // Update child
    const child = await prisma.child.update({
      where: { id: childId },
      data: {
        ...(name && { name }),
        ...(age && { age: parseInt(age) }),
        ...(pin !== undefined && { pin })
      }
    });

    res.json({
      message: 'Child updated successfully',
      child
    });
  } catch (error) {
    console.error('Update child error:', error);
    res.status(500).json({ error: 'Failed to update child' });
  }
};

/**
 * Delete child account
 * DELETE /api/children/:childId
 */
const deleteChild = async (req, res) => {
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

    // Delete child (cascade will delete related records)
    await prisma.child.delete({
      where: { id: childId }
    });

    res.json({ message: 'Child account deleted successfully' });
  } catch (error) {
    console.error('Delete child error:', error);
    res.status(500).json({ error: 'Failed to delete child' });
  }
};

/**
 * Get child balance
 * GET /api/children/:childId/balance
 */
const getBalance = async (req, res) => {
  try {
    const childId = parseInt(req.params.childId);
    const userId = req.user.userId;

    const child = await prisma.child.findFirst({
      where: { id: childId, userId },
      select: {
        id: true,
        name: true,
        balance: true
      }
    });

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    res.json({ balance: child.balance, child });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
};

module.exports = {
  createChild,
  getChildren,
  getChildById,
  updateChild,
  deleteChild,
  getBalance
};
