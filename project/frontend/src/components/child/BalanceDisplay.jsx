/**
 * Balance Display Component
 * Person 2: Frontend Developer
 */

import { Wallet, TrendingUp } from 'lucide-react';

export default function BalanceDisplay({ balance }) {
  return (
    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-white/20 p-3 rounded-full">
          <Wallet className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold">Available Balance</h3>
      </div>

      <div className="mb-6">
        <p className="text-5xl font-bold">€{balance.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-2">
          <TrendingUp className="w-4 h-4 text-green-200" />
          <p className="text-sm text-green-100">Keep saving to reach your goals!</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-xs text-green-100 mb-1">This Week</p>
          <p className="text-lg font-bold">€{(balance * 0.2).toFixed(2)}</p>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-xs text-green-100 mb-1">This Month</p>
          <p className="text-lg font-bold">€{(balance * 0.8).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
