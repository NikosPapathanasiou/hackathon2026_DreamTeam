/**
 * Budget Tracker Component
 * Person 2: Frontend Developer
 */

import { Target, TrendingUp } from 'lucide-react';

export default function BudgetTracker({ budgets }) {
  if (!budgets || budgets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No budgets set yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {budgets.map((budget) => {
        const percentUsed = (budget.currentSpent / budget.limitAmount) * 100;
        const remaining = budget.limitAmount - budget.currentSpent;
        const isOverBudget = percentUsed > 100;

        return (
          <div key={budget.id} className="bg-white rounded-xl shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  isOverBudget ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <Target className={`w-5 h-5 ${
                    isOverBudget ? 'text-red-600' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{budget.category}</h3>
                  <p className="text-xs text-gray-500 capitalize">{budget.period}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Limit</p>
                <p className="text-lg font-bold text-gray-900">€{budget.limitAmount.toFixed(2)}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Spent</span>
                <span className="font-semibold text-gray-900">
                  €{budget.currentSpent.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isOverBudget
                      ? 'bg-red-500'
                      : percentUsed > 75
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(percentUsed, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">{percentUsed.toFixed(0)}% used</span>
                <span className={`text-xs font-semibold ${
                  remaining < 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {remaining < 0 ? 'Over by' : 'Remaining'}: €{Math.abs(remaining).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Status Message */}
            <div className={`rounded-lg p-3 ${
              isOverBudget
                ? 'bg-red-50 border border-red-200'
                : percentUsed > 75
                ? 'bg-yellow-50 border border-yellow-200'
                : 'bg-green-50 border border-green-200'
            }`}>
              <p className={`text-sm ${
                isOverBudget
                  ? 'text-red-700'
                  : percentUsed > 75
                  ? 'text-yellow-700'
                  : 'text-green-700'
              }`}>
                {isOverBudget
                  ? '⚠️ You have exceeded your budget limit!'
                  : percentUsed > 75
                  ? '⚠️ You are close to your budget limit.'
                  : '✅ Great job staying within budget!'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
