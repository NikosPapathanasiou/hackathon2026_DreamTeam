/**
 * Educational Progress Routes
 * Person 1: Backend Developer
 */

const express = require('express');
const router = express.Router();
const {
  recordProgress,
  getProgressByChild,
  getLessonProgress
} = require('../controllers/education.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticateToken);

router.post('/progress', recordProgress);
router.get('/progress/child/:childId', getProgressByChild);
router.get('/progress/child/:childId/lesson/:lessonId', getLessonProgress);

module.exports = router;
