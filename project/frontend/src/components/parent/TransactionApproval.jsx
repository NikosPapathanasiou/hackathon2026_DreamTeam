/**
 * Transaction Approval Component
 * Person 2: Frontend Developer
 */

import { useState } from 'react';
import { transactionsAPI } from '../../services/api';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function TransactionApproval({ transactions, onUpdate }) {
  const [processing, setProcessing] = useState(null);

  const handleApprove = async (transactionId) => {
    setProcessing(transactionId);
    try {
      await transactionsAPI.approve(transactionId);
      onUpdate();
    } catch (error) {
      console.error('Failed to approve transaction:', error);
      alert('Failed to approve transaction');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (transactionId) => {
    setProcessing(transactionId);
    try {
      await transactionsAPI.reject(transactionId);
      onUpdate();
    } catch (error) {
      console.error('Failed to reject transaction:', error);
      alert('Failed to reject transaction');
    } finally {
      setProcessing(null);
    }
  };

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-orange-600" />
        <h3 className="text-lg font-bold text-gray-900">Pending Approvals</h3>
      </div>

      <div className="space-y-4">
        {transactions.map((txn) => (
          <div
            key={txn.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{txn.child.name}</h4>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    Age {txn.child.age}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{txn.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Category: {txn.category} • {new Date(txn.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className="text-2xl font-bold text-red-600">
                  -€{Math.abs(txn.amount).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  Balance: €{txn.child.balance.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleApprove(txn.id)}
                disabled={processing === txn.id}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {processing === txn.id ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={() => handleReject(txn.id)}
                disabled={processing === txn.id}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                {processing === txn.id ? 'Processing...' : 'Reject'}
              </button>
            </div>

            {/* Warning if insufficient balance */}
            {Math.abs(txn.amount) > txn.child.balance && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-2">
                <p className="text-xs text-red-700">
                  ⚠️ Warning: Insufficient balance! This will result in negative balance.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
