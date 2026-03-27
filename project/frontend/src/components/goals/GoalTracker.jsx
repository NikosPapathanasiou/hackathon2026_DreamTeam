import { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp, Award, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import GoalCard from './GoalCard';
import CreateGoalModal from './CreateGoalModal';
import { useToast } from '../../hooks/useToast';

const GoalTracker = ({ childId, childBalance }) => {
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchGoals();
  }, [childId]);

  const fetchGoals = async () => {
    try {
      const response = await api.get(`/goals/child/${childId}`);
      setGoals(response.data.goals);
      setStats(response.data.stats);
    } catch (err) {
      console.error('Failed to fetch goals:', err);
      showError('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (goalData) => {
    try {
      await api.post('/goals', {
        childId,
        ...goalData,
      });
      success('Goal created successfully!');
      fetchGoals();
    } catch (err) {
      showError('Failed to create goal');
    }
  };

  const handleContribute = async (goalId, amount) => {
    try {
      await api.post(`/goals/${goalId}/contribute`, { amount });
      success(`€${amount.toFixed(2)} added to goal!`);
      fetchGoals();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to contribute to goal');
    }
  };

  const handleWithdraw = async (goalId, amount) => {
    try {
      await api.post(`/goals/${goalId}/withdraw`, { amount });
      success(`€${amount.toFixed(2)} withdrawn from goal`);
      fetchGoals();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to withdraw from goal');
    }
  };

  const handleDelete = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal? Any saved money will be returned.')) {
      return;
    }

    try {
      await api.delete(`/goals/${goalId}`);
      success('Goal deleted successfully');
      fetchGoals();
    } catch (err) {
      showError('Failed to delete goal');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Target className="w-12 h-12" />
            <div>
              <h2 className="text-4xl font-bold">My Goals</h2>
              <p className="text-blue-100 mt-1">Save for what you want!</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            New Goal
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5" />
                <span className="text-sm font-semibold">Active Goals</span>
              </div>
              <p className="text-3xl font-bold">{stats.activeGoals}</p>
            </div>

            <div className="bg-white/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-semibold">Completed</span>
              </div>
              <p className="text-3xl font-bold">{stats.completedGoals}</p>
            </div>

            <div className="bg-white/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5" />
                <span className="text-sm font-semibold">Total Saved</span>
              </div>
              <p className="text-3xl font-bold">€{stats.totalSaved}</p>
            </div>

            <div className="bg-white/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-semibold">Progress</span>
              </div>
              <p className="text-3xl font-bold">{stats.overallProgress}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Active Goals ({activeGoals.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                childBalance={childBalance}
                onContribute={handleContribute}
                onWithdraw={handleWithdraw}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Completed Goals ({completedGoals.length}) 🎉
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                childBalance={childBalance}
                onContribute={handleContribute}
                onWithdraw={handleWithdraw}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">🎯</div>
          <h3 className="text-3xl font-bold text-gray-800 mb-3">
            No Goals Yet!
          </h3>
          <p className="text-gray-600 text-lg mb-6">
            Start saving for something you really want!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-6 h-6" />
            Create Your First Goal
          </button>
        </div>
      )}

      {/* Motivational Tips */}
      {activeGoals.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Saving Tips
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Save a little bit each week - it adds up fast!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Think twice before withdrawing - stay focused on your goal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Set realistic deadlines to stay motivated</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Celebrate when you complete a goal!</span>
            </li>
          </ul>
        </div>
      )}

      {/* Create Goal Modal */}
      <CreateGoalModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateGoal}
      />
    </div>
  );
};

export default GoalTracker;
