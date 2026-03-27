/**
 * Transaction List Component
 * Person 2: Frontend Developer
 */

import { ArrowUpCircle, ArrowDownCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function TransactionList({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <p className="text-gray-600">No transactions yet</p>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700',
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow">
      <div className="divide-y divide-gray-100">
        {transactions.map((txn) => {
          const isIncome = txn.amount > 0;
          const amount = Math.abs(txn.amount);

          return (
            <div key={txn.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                {/* Left side - Icon & Details */}
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    isIncome ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {isIncome ? (
                      <ArrowUpCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <ArrowDownCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">{txn.description}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{txn.category}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {new Date(txn.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side - Amount & Status */}
                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    isIncome ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isIncome ? '+' : '-'}€{amount.toFixed(2)}
                  </p>
                  <div className="mt-1 flex items-center justify-end gap-2">
                    {getStatusIcon(txn.status)}
                    {getStatusBadge(txn.status)}
                  </div>
                </div>
              </div>

              {/* Pending message */}
              {txn.status === 'pending' && (
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                  <p className="text-xs text-yellow-700">
                    ⏳ Waiting for parent approval
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
