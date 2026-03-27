import { useEffect, useState } from 'react';
import { Award, Lock, Sparkles } from 'lucide-react';
import api from '../../services/api';
import lessonsData from '../../data/lessons.json';

const BadgeSystem = ({ childId }) => {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, [childId]);

  const fetchBadges = async () => {
    try {
      const response = await api.get(`/education/progress/child/${childId}`);
      const completedProgress = response.data.progress.filter(
        (p) => p.completed && p.score >= 70
      );

      // Map completed lessons to badges
      const badges = completedProgress.map((progress) => {
        const lesson = lessonsData.lessons.find((l) => l.id === progress.lessonId);
        return {
          ...lesson?.badge,
          lessonId: progress.lessonId,
          lessonTitle: progress.lessonTitle,
          score: progress.score,
          earnedAt: progress.completedAt,
          points: lesson?.points || 0,
        };
      }).filter(badge => badge.name); // Filter out any undefined badges

      setEarnedBadges(badges);
    } catch (error) {
      console.error('Failed to fetch badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const allPossibleBadges = lessonsData.lessons.map((lesson) => ({
    ...lesson.badge,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    points: lesson.points,
    isEarned: earnedBadges.some((b) => b.lessonId === lesson.id),
  }));

  const totalPoints = earnedBadges.reduce((sum, badge) => sum + badge.points, 0);
  const badgeCount = earnedBadges.length;
  const totalBadges = allPossibleBadges.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Badge Collection</h2>
            <p className="text-yellow-100">Collect badges by completing lessons!</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{badgeCount}</div>
            <div className="text-yellow-100">of {totalBadges} badges</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/20 rounded-full px-6 py-3 inline-block">
          <Sparkles className="w-6 h-6" />
          <span className="font-bold text-xl">{totalPoints} Total Points</span>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPossibleBadges.map((badge) => {
          const earned = earnedBadges.find((b) => b.lessonId === badge.lessonId);
          const isEarned = !!earned;

          return (
            <div
              key={badge.lessonId}
              className={`relative rounded-2xl p-6 transition-all transform hover:scale-105 ${
                isEarned
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 shadow-lg'
                  : 'bg-gray-100 border-2 border-gray-300'
              }`}
            >
              {/* Badge Icon */}
              <div className="text-center mb-4">
                <div
                  className={`text-7xl mb-2 transition-all ${
                    isEarned ? 'animate-pulse' : 'opacity-30 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>
                {!isEarned && (
                  <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Lock className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Badge Info */}
              <div className="text-center">
                <h3
                  className={`text-xl font-bold mb-2 ${
                    isEarned ? '' : 'text-gray-500'
                  }`}
                  style={isEarned ? { color: badge.color } : {}}
                >
                  {badge.name}
                </h3>
                <p className={`text-sm mb-3 ${isEarned ? 'text-gray-700' : 'text-gray-500'}`}>
                  {badge.lessonTitle}
                </p>

                {isEarned ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-yellow-600">
                      <Award className="w-5 h-5" />
                      <span className="font-semibold">+{badge.points} points</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Score: <span className="font-bold text-green-600">{earned.score}%</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Earned {new Date(earned.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm font-semibold">Complete lesson to unlock</span>
                  </div>
                )}
              </div>

              {/* Shine Effect for Earned Badges */}
              {isEarned && (
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl pointer-events-none">
                  <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Motivational Message */}
      {badgeCount === 0 ? (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold text-blue-800 mb-2">Start Your Journey!</h3>
          <p className="text-blue-700">
            Complete lessons with a score of 70% or higher to earn your first badge!
          </p>
        </div>
      ) : badgeCount === totalBadges ? (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold text-purple-800 mb-2">
            Congratulations, Master Learner!
          </h3>
          <p className="text-purple-700">
            You've earned all {totalBadges} badges! You're a financial literacy champion!
          </p>
        </div>
      ) : (
        <div className="bg-green-50 border-2 border-green-300 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">🌟</div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">Great Progress!</h3>
          <p className="text-green-700">
            You've earned {badgeCount} out of {totalBadges} badges. Keep learning to collect them all!
          </p>
        </div>
      )}
    </div>
  );
};

// Add animation keyframes to your global CSS or tailwind config
const style = document.createElement('style');
style.textContent = `
  @keyframes shine {
    0% { transform: translateX(0); }
    100% { transform: translateX(200%); }
  }
  .animate-shine {
    animation: shine 3s infinite;
  }
`;
document.head.appendChild(style);

export default BadgeSystem;
