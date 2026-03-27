/**
 * Child Account Card Component
 * Person 2: Frontend Developer
 */

import { Link } from 'react-router-dom';
import { User, TrendingUp, Award, ArrowRight } from 'lucide-react';

export default function ChildAccountCard({ child, onUpdate }) {
  const completionRate = child._count?.educationalProgress
    ? Math.round((child._count.educationalProgress / 10) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-3">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{child.name}</h3>
            <p className="text-sm text-gray-600">Age {child.age}</p>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600 mb-1">Current Balance</p>
        <p className="text-3xl font-bold text-gray-900">€{child.balance.toFixed(2)}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <p className="text-xs text-gray-600">Transactions</p>
          </div>
          <p className="text-lg font-bold text-gray-900">{child._count?.transactions || 0}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-yellow-600" />
            <p className="text-xs text-gray-600">Progress</p>
          </div>
          <p className="text-lg font-bold text-gray-900">{completionRate}%</p>
        </div>
      </div>

      {/* Recent Transactions */}
      {child.transactions && child.transactions.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">Recent Activity</p>
          <div className="space-y-2">
            {child.transactions.slice(0, 2).map((txn) => (
              <div key={txn.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-700 truncate">{txn.description}</span>
                <span
                  className={`font-semibold ${
                    txn.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {txn.amount > 0 ? '+' : ''}€{Math.abs(txn.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Details Button */}
      <Link
        to={`/child/${child.id}`}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        View Details
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
