/**
 * Transaction Controller
 * Person 1: Backend Developer
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Create new transaction
 * POST /api/transactions
 */
const createTransaction = async (req, res) => {
  try {
    const { childId, amount, description, category } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!childId || !amount || !description) {
      return res.status(400).json({ error: 'childId, amount, and description are required' });
    }

    // Verify child belongs to user
    const child = await prisma.child.findFirst({
      where: { id: parseInt(childId), userId }
    });

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        childId: parseInt(childId),
        amount: parseFloat(amount),
        description,
        category: category || 'Other',
        status: amount > 0 ? 'approved' : 'pending' // Auto-approve deposits, pending for spending
      }
    });

    // If it's a deposit (positive amount), update balance immediately
    if (amount > 0) {
      await prisma.child.update({
        where: { id: parseInt(childId) },
        data: {
          balance: {
            increment: parseFloat(amount)
          }
        }
      });
    }

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

/**
 * Get transactions for a child
 * GET /api/transactions/child/:childId
 */
const getTransactionsByChild = async (req, res) => {
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

    const transactions = await prisma.transaction.findMany({
      where: { childId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ transactions });
  } catch (error) {
    console.error('Fetch transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

/**
 * Approve transaction (parent approval)
 * PATCH /api/transactions/:transactionId/approve
 */
const approveTransaction = async (req, res) => {
  try {
    const transactionId = parseInt(req.params.transactionId);
    const userId = req.user.userId;

    // Get transaction and verify ownership
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { child: true }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.child.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ error: 'Transaction already processed' });
    }

    // Check if child has sufficient balance
    if (transaction.amount < 0 && Math.abs(transaction.amount) > transaction.child.balance) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Approve transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'approved' }
    });

    // Update child balance
    await prisma.child.update({
      where: { id: transaction.childId },
      data: {
        balance: {
          increment: transaction.amount // Negative amount will decrease balance
        }
      }
    });

    res.json({
      message: 'Transaction approved',
      transaction: updatedTransaction
    });
  } catch (error) {
    console.error('Approve transaction error:', error);
    res.status(500).json({ error: 'Failed to approve transaction' });
  }
};

/**
 * Reject transaction
 * PATCH /api/transactions/:transactionId/reject
 */
const rejectTransaction = async (req, res) => {
  try {
    const transactionId = parseInt(req.params.transactionId);
    const userId = req.user.userId;

    // Get transaction and verify ownership
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { child: true }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.child.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ error: 'Transaction already processed' });
    }

    // Reject transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'rejected' }
    });

    res.json({
      message: 'Transaction rejected',
      transaction: updatedTransaction
    });
  } catch (error) {
    console.error('Reject transaction error:', error);
    res.status(500).json({ error: 'Failed to reject transaction' });
  }
};

/**
 * Get pending transactions (for parent review)
 * GET /api/transactions/pending
 */
const getPendingTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all children for this parent
    const children = await prisma.child.findMany({
      where: { userId },
      select: { id: true }
    });

    const childIds = children.map(c => c.id);

    // Get pending transactions for all children
    const transactions = await prisma.transaction.findMany({
      where: {
        childId: { in: childIds },
        status: 'pending'
      },
      include: {
        child: {
          select: {
            id: true,
            name: true,
            balance: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ transactions });
  } catch (error) {
    console.error('Fetch pending transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch pending transactions' });
  }
};

module.exports = {
  createTransaction,
  getTransactionsByChild,
  approveTransaction,
  rejectTransaction,
  getPendingTransactions
};
