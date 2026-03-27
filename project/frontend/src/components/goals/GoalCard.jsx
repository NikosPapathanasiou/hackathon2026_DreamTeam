import { useState } from 'react';
import { Target, TrendingUp, Calendar, Trash2, Plus, Minus } from 'lucide-react';

const GoalCard = ({ goal, onContribute, onWithdraw, onDelete, childBalance }) => {
  const [showActions, setShowActions] = useState(false);
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState(null); // 'contribute' or 'withdraw'

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const daysLeft = goal.deadline
    ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const handleAction = () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) return;

    if (action === 'contribute') {
      onContribute(goal.id, value);
    } else if (action === 'withdraw') {
      onWithdraw(goal.id, value);
    }

    setAmount('');
    setAction(null);
    setShowActions(false);
  };

  const getGoalEmoji = () => {
    if (goal.imageUrl) return goal.imageUrl;
    if (goal.completed) return '🎉';
    return '🎯';
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-6 transition-all transform hover:scale-105 ${
        goal.completed ? 'border-4 border-green-400' : 'border-2 border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-5xl">{getGoalEmoji()}</div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{goal.title}</h3>
            {goal.description && (
              <p className="text-sm text-gray-600">{goal.description}</p>
            )}
          </div>
        </div>
        {!goal.completed && (
          <button
            onClick={() => onDelete(goal.id)}
            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className="font-bold text-blue-600">
            €{goal.currentAmount.toFixed(2)} / €{goal.targetAmount.toFixed(2)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${
              goal.completed
                ? 'bg-gradient-to-r from-green-400 to-green-600'
                : 'bg-gradient-to-r from-blue-400 to-purple-600'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="text-center mt-2">
          <span className="text-2xl font-bold text-gray-800">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {!goal.completed && (
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-700">
              <Target className="w-4 h-4" />
              <span className="text-xs font-semibold">Remaining</span>
            </div>
            <p className="text-lg font-bold text-yellow-800">
              €{remaining.toFixed(2)}
            </p>
          </div>
        )}

        {daysLeft !== null && !goal.completed && (
          <div
            className={`rounded-lg p-3 ${
              daysLeft < 7 ? 'bg-red-50' : 'bg-blue-50'
            }`}
          >
            <div
              className={`flex items-center gap-2 ${
                daysLeft < 7 ? 'text-red-700' : 'text-blue-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-semibold">Days Left</span>
            </div>
            <p
              className={`text-lg font-bold ${
                daysLeft < 7 ? 'text-red-800' : 'text-blue-800'
              }`}
            >
              {daysLeft > 0 ? daysLeft : 'Overdue'}
            </p>
          </div>
        )}

        {goal.completed && (
          <div className="bg-green-50 rounded-lg p-3 col-span-2">
            <div className="flex items-center gap-2 text-green-700 justify-center">
              <span className="text-2xl">🎉</span>
              <span className="text-lg font-bold">Goal Completed!</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {!goal.completed && (
        <div className="space-y-3">
          {!showActions ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setShowActions(true);
                  setAction('contribute');
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Money
              </button>
              <button
                onClick={() => {
                  setShowActions(true);
                  setAction('withdraw');
                }}
                disabled={goal.currentAmount === 0}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Minus className="w-5 h-5" />
                Withdraw
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  {action === 'contribute' ? 'Add Amount' : 'Withdraw Amount'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    max={
                      action === 'contribute'
                        ? Math.min(childBalance, remaining)
                        : goal.currentAmount
                    }
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                  <span className="flex items-center px-4 py-2 bg-gray-100 rounded-xl font-semibold text-gray-700">
                    €
                  </span>
                </div>
                {action === 'contribute' && (
                  <p className="text-xs text-gray-600 mt-1">
                    Available balance: €{childBalance.toFixed(2)}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setShowActions(false);
                    setAction(null);
                    setAmount('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalCard;
