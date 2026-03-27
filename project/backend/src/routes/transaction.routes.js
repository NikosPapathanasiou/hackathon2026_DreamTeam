/**
 * Transaction Routes
 * Person 1: Backend Developer
 */

const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactionsByChild,
  approveTransaction,
  rejectTransaction,
  getPendingTransactions
} = require('../controllers/transaction.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticateToken);

router.post('/', createTransaction);
router.get('/child/:childId', getTransactionsByChild);
router.get('/pending', getPendingTransactions);
router.patch('/:transactionId/approve', approveTransaction);
router.patch('/:transactionId/reject', rejectTransaction);

module.exports = router;
