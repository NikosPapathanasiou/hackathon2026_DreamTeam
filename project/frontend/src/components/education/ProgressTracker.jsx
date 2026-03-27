import { useEffect, useState } from 'react';
import { TrendingUp, Award, Target, BookOpen } from 'lucide-react';
import api from '../../services/api';

const ProgressTracker = ({ childId }) => {
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, [childId]);

  const fetchProgress = async () => {
    try {
      const response = await api.get(`/education/progress/child/${childId}`);
      setProgress(response.data.progress);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8" />
              <span className="text-3xl font-bold">{stats.completedLessons}</span>
            </div>
            <p className="text-blue-100 font-semibold">Lessons Completed</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8" />
              <span className="text-3xl font-bold">{stats.completionRate}%</span>
            </div>
            <p className="text-green-100 font-semibold">Completion Rate</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8" />
              <span className="text-3xl font-bold">{stats.averageScore}%</span>
            </div>
            <p className="text-purple-100 font-semibold">Average Score</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8" />
              <span className="text-3xl font-bold">{stats.totalLessons}</span>
            </div>
            <p className="text-orange-100 font-semibold">Total Lessons</p>
          </div>
        </div>
      )}

      {/* Progress Chart */}
      {stats && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Learning Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">Completion Rate</span>
                <span className="text-sm font-bold text-green-600">{stats.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">Average Score</span>
                <span className="text-sm font-bold text-blue-600">{stats.averageScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${stats.averageScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lesson History */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Lesson History</h3>
        {progress.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No lessons completed yet</p>
            <p className="text-sm text-gray-400 mt-2">Start learning to see your progress here!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {progress.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    item.completed ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {item.completed ? (
                      <Award className="w-6 h-6 text-green-600" />
                    ) : (
                      <BookOpen className="w-6 h-6 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{item.lessonTitle}</h4>
                    <p className="text-sm text-gray-500">
                      {item.completedAt
                        ? new Date(item.completedAt).toLocaleDateString()
                        : 'In Progress'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {item.score !== null && (
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold ${
                        item.score >= 70 ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {item.score}%
                      </span>
                      {item.completed && (
                        <span className="text-2xl">
                          {item.score >= 90 ? '🌟' : item.score >= 70 ? '⭐' : '📚'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements Preview */}
      {stats && stats.completedLessons > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-yellow-600" />
            <h3 className="text-xl font-bold text-gray-800">Keep Going!</h3>
          </div>
          <p className="text-gray-700">
            You've completed <span className="font-bold text-yellow-600">{stats.completedLessons}</span> lessons!
            {stats.completedLessons >= 3 ? (
              <span> You're a learning superstar! 🌟</span>
            ) : (
              <span> Complete more lessons to earn badges!</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
