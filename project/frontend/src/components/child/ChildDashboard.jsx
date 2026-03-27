/**
 * Child Dashboard Component
 * Person 2: Frontend Developer
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { childrenAPI, transactionsAPI, budgetsAPI } from '../../services/api';
import { Wallet, TrendingDown, Target, Book, Sparkles } from 'lucide-react';
import BalanceDisplay from './BalanceDisplay';
import BudgetTracker from './BudgetTracker';
import TransactionList from './TransactionList';
import VirtualCard from './VirtualCard';
import GoalTracker from '../goals/GoalTracker';

export default function ChildDashboard() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [childId]);

  const fetchData = async () => {
    try {
      const [childRes, txnRes, budgetRes] = await Promise.all([
        childrenAPI.getById(childId),
        transactionsAPI.getByChild(childId),
        budgetsAPI.getByChild(childId),
      ]);

      setChild(childRes.data.child);
      setTransactions(txnRes.data.transactions);
      setBudgets(budgetRes.data.budgets);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Child not found</p>
      </div>
    );
  }

  const totalSpending = transactions
    .filter((t) => t.amount < 0 && t.status === 'approved')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold">{child.name}'s Account</h1>
          <p className="text-purple-100 mt-2">Age {child.age} • Your financial journey</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance & Card Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BalanceDisplay balance={child.balance} />
          <VirtualCard childName={child.name} />
        </div>

        {/* Education Call-to-Action */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/child/${childId}/education`)}
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-full">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <h3 className="text-3xl font-bold mb-1">Start Learning!</h3>
                  <p className="text-purple-100 text-lg">
                    Play fun games and earn badges while learning about money
                  </p>
                </div>
              </div>
              <div className="text-6xl group-hover:scale-110 transition-transform">
                🎓
              </div>
            </div>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spending</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">€{totalSpending.toFixed(2)}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Budgets</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{budgets.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lessons Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {child.educationalProgress?.filter((p) => p.completed).length || 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Book className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Budgets */}
        {budgets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Budgets</h2>
            <BudgetTracker budgets={budgets} />
          </div>
        )}

        {/* Goals */}
        <div className="mb-8">
          <GoalTracker childId={childId} childBalance={child.balance} />
        </div>

        {/* Transactions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
