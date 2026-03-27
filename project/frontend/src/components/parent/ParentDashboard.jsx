/**
 * Parent Dashboard Component
 * Person 2: Frontend Developer
 */

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { childrenAPI, transactionsAPI } from '../../services/api';
import { Users, Plus, AlertCircle, TrendingUp } from 'lucide-react';
import ChildAccountCard from './ChildAccountCard';
import TransactionApproval from './TransactionApproval';

export default function ParentDashboard() {
  const { user } = useAuthStore();
  const [children, setChildren] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddChild, setShowAddChild] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [childrenRes, pendingRes] = await Promise.all([
        childrenAPI.getAll(),
        transactionsAPI.getPending(),
      ]);

      setChildren(childrenRes.data.children || []);
      setPendingTransactions(pendingRes.data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = children.reduce((sum, child) => sum + child.balance, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={() => setShowAddChild(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Add Child
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Children</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{children.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Balance</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">€{totalBalance.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{pendingTransactions.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Transactions */}
        {pendingTransactions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Approvals</h2>
            <TransactionApproval
              transactions={pendingTransactions}
              onUpdate={fetchData}
            />
          </div>
        )}

        {/* Children List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Children Accounts</h2>
          {children.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No children added yet</h3>
              <p className="text-gray-600 mb-6">Add your first child to get started</p>
              <button
                onClick={() => setShowAddChild(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Add First Child
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {children.map((child) => (
                <ChildAccountCard key={child.id} child={child} onUpdate={fetchData} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Child Modal would go here */}
    </div>
  );
}
