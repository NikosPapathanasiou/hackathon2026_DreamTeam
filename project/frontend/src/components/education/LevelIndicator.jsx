import { useEffect, useState } from 'react';
import { Zap, TrendingUp, Star } from 'lucide-react';
import api from '../../services/api';
import lessonsData from '../../data/lessons.json';

const LevelIndicator = ({ childId }) => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  // Level thresholds
  const levels = [
    { level: 1, name: 'Beginner', minPoints: 0, maxPoints: 100, icon: '🌱', color: 'from-green-400 to-green-600' },
    { level: 2, name: 'Learner', minPoints: 100, maxPoints: 250, icon: '📚', color: 'from-blue-400 to-blue-600' },
    { level: 3, name: 'Explorer', minPoints: 250, maxPoints: 450, icon: '🔍', color: 'from-purple-400 to-purple-600' },
    { level: 4, name: 'Expert', minPoints: 450, maxPoints: 700, icon: '⭐', color: 'from-yellow-400 to-yellow-600' },
    { level: 5, name: 'Master', minPoints: 700, maxPoints: 1000, icon: '🏆', color: 'from-orange-400 to-orange-600' },
    { level: 6, name: 'Legend', minPoints: 1000, maxPoints: Infinity, icon: '👑', color: 'from-pink-400 to-pink-600' },
  ];

  useEffect(() => {
    fetchLevelData();
  }, [childId]);

  const fetchLevelData = async () => {
    try {
      const response = await api.get(`/education/progress/child/${childId}`);
      const completedProgress = response.data.progress.filter(
        (p) => p.completed && p.score >= 70
      );

      // Calculate total points from completed lessons
      const points = completedProgress.reduce((sum, progress) => {
        const lesson = lessonsData.lessons.find((l) => l.id === progress.lessonId);
        return sum + (lesson?.points || 0);
      }, 0);

      setTotalPoints(points);
      calculateLevel(points);
    } catch (error) {
      console.error('Failed to fetch level data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateLevel = (points) => {
    const currentLevel = levels.find(
      (lvl) => points >= lvl.minPoints && points < lvl.maxPoints
    ) || levels[levels.length - 1];

    setLevel(currentLevel.level);

    // Calculate progress to next level
    const pointsInLevel = points - currentLevel.minPoints;
    const pointsNeeded = currentLevel.maxPoints - currentLevel.minPoints;
    const progressPercent = Math.min((pointsInLevel / pointsNeeded) * 100, 100);

    setProgress(progressPercent);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentLevel = levels[level - 1];
  const nextLevel = levels[level] || null;
  const pointsToNext = nextLevel ? nextLevel.minPoints - totalPoints : 0;

  return (
    <div className="space-y-4">
      {/* Main Level Display */}
      <div className={`bg-gradient-to-r ${currentLevel.color} text-white rounded-2xl p-6 shadow-xl`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{currentLevel.icon}</div>
            <div>
              <div className="text-sm font-semibold opacity-90">Level {currentLevel.level}</div>
              <div className="text-3xl font-bold">{currentLevel.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-6 h-6" />
              <span className="text-3xl font-bold">{totalPoints}</span>
            </div>
            <div className="text-sm opacity-90">Total Points</div>
          </div>
        </div>

        {/* Progress Bar */}
        {nextLevel && (
          <div>
            <div className="flex justify-between text-sm mb-2 opacity-90">
              <span>Progress to Level {nextLevel.level}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-4 overflow-hidden">
              <div
                className="bg-white h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${progress}%` }}
              >
                {progress > 10 && <Star className="w-3 h-3" />}
              </div>
            </div>
            <div className="text-sm mt-2 opacity-90 text-center">
              {pointsToNext} points to {nextLevel.name}
            </div>
          </div>
        )}

        {!nextLevel && (
          <div className="text-center py-2">
            <p className="text-lg font-semibold">🎉 Maximum Level Reached! 🎉</p>
          </div>
        )}
      </div>

      {/* Level Milestones */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Level Milestones
        </h3>
        <div className="space-y-3">
          {levels.map((lvl, index) => {
            const isCompleted = totalPoints >= lvl.minPoints;
            const isCurrent = lvl.level === currentLevel.level;

            return (
              <div
                key={lvl.level}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-blue-50 border-2 border-blue-400'
                    : isCompleted
                    ? 'bg-green-50 border-2 border-green-400'
                    : 'bg-gray-50 border-2 border-gray-300'
                }`}
              >
                <div
                  className={`text-4xl transition-all ${
                    isCompleted ? 'opacity-100 scale-110' : 'opacity-30 grayscale'
                  }`}
                >
                  {lvl.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">Level {lvl.level}</span>
                    <span className={`font-semibold ${isCurrent ? 'text-blue-600' : 'text-gray-600'}`}>
                      {lvl.name}
                    </span>
                    {isCurrent && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                        CURRENT
                      </span>
                    )}
                    {isCompleted && !isCurrent && (
                      <span className="text-green-600 font-bold">✓</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {lvl.minPoints} - {lvl.maxPoints === Infinity ? '∞' : lvl.maxPoints} points
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Unlocked */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <Star className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-800">Your Achievements</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{level}</div>
            <div className="text-sm text-gray-600">Current Level</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{totalPoints}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{Math.round(progress)}%</div>
            <div className="text-sm text-gray-600">Next Level</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {levels.filter((lvl) => totalPoints >= lvl.minPoints).length}
            </div>
            <div className="text-sm text-gray-600">Levels Unlocked</div>
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      {nextLevel && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-gray-700">
            Keep learning! Just <span className="font-bold text-yellow-600">{pointsToNext} more points</span> to reach{' '}
            <span className="font-bold">{nextLevel.name}</span> level!
          </p>
        </div>
      )}
    </div>
  );
};

export default LevelIndicator;
