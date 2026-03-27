/**
 * Educational Progress Controller
 * Person 1: Backend Developer
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Record lesson completion
 * POST /api/education/progress
 */
const recordProgress = async (req, res) => {
  try {
    const { childId, lessonId, lessonTitle, completed, score } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!childId || !lessonId || !lessonTitle) {
      return res.status(400).json({ error: 'childId, lessonId, and lessonTitle are required' });
    }

    // Verify child belongs to user
    const child = await prisma.child.findFirst({
      where: { id: parseInt(childId), userId }
    });

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    // Check if progress already exists
    const existingProgress = await prisma.educationalProgress.findFirst({
      where: {
        childId: parseInt(childId),
        lessonId: parseInt(lessonId)
      }
    });

    let progress;

    if (existingProgress) {
      // Update existing progress
      progress = await prisma.educationalProgress.update({
        where: { id: existingProgress.id },
        data: {
          completed: completed !== undefined ? completed : existingProgress.completed,
          score: score !== undefined ? parseInt(score) : existingProgress.score,
          completedAt: completed ? new Date() : existingProgress.completedAt
        }
      });
    } else {
      // Create new progress record
      progress = await prisma.educationalProgress.create({
        data: {
          childId: parseInt(childId),
          lessonId: parseInt(lessonId),
          lessonTitle,
          completed: completed || false,
          score: score ? parseInt(score) : null,
          completedAt: completed ? new Date() : null
        }
      });
    }

    res.status(201).json({
      message: 'Progress recorded successfully',
      progress
    });
  } catch (error) {
    console.error('Record progress error:', error);
    res.status(500).json({ error: 'Failed to record progress' });
  }
};

/**
 * Get educational progress for a child
 * GET /api/education/progress/child/:childId
 */
const getProgressByChild = async (req, res) => {
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

    const progress = await prisma.educationalProgress.findMany({
      where: { childId },
      orderBy: { completedAt: 'desc' }
    });

    // Calculate statistics
    const completedLessons = progress.filter(p => p.completed).length;
    const totalLessons = progress.length;
    const averageScore = progress
      .filter(p => p.score !== null)
      .reduce((sum, p) => sum + p.score, 0) / (progress.filter(p => p.score !== null).length || 1);

    res.json({
      progress,
      stats: {
        completedLessons,
        totalLessons,
        averageScore: Math.round(averageScore),
        completionRate: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Fetch progress error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
};

/**
 * Get specific lesson progress
 * GET /api/education/progress/child/:childId/lesson/:lessonId
 */
const getLessonProgress = async (req, res) => {
  try {
    const childId = parseInt(req.params.childId);
    const lessonId = parseInt(req.params.lessonId);
    const userId = req.user.userId;

    // Verify ownership
    const child = await prisma.child.findFirst({
      where: { id: childId, userId }
    });

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    const progress = await prisma.educationalProgress.findFirst({
      where: {
        childId,
        lessonId
      }
    });

    if (!progress) {
      return res.status(404).json({ error: 'Progress not found for this lesson' });
    }

    res.json({ progress });
  } catch (error) {
    console.error('Fetch lesson progress error:', error);
    res.status(500).json({ error: 'Failed to fetch lesson progress' });
  }
};

module.exports = {
  recordProgress,
  getProgressByChild,
  getLessonProgress
};
