/**
 * Virtual Card Component
 * Person 2: Frontend Developer
 */

import { CreditCard, Wifi } from 'lucide-react';

export default function VirtualCard({ childName }) {
  return (
    <div className="relative">
      {/* Card */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-2xl p-8 text-white aspect-[1.586/1] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        {/* Card Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium opacity-90">Future Proof Card</p>
              <p className="text-xs opacity-75 mt-1">National Bank of Greece</p>
            </div>
            <Wifi className="w-8 h-8 rotate-90" />
          </div>

          {/* Card Number */}
          <div>
            <div className="flex gap-4 mb-4">
              <span className="text-2xl font-mono tracking-wider">••••</span>
              <span className="text-2xl font-mono tracking-wider">••••</span>
              <span className="text-2xl font-mono tracking-wider">••••</span>
              <span className="text-2xl font-mono tracking-wider">1234</span>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-75 mb-1">CARDHOLDER</p>
                <p className="text-lg font-semibold uppercase">{childName}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="mt-4 bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-600">Daily Limit</p>
            <p className="text-sm font-bold text-gray-900">€50</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Status</p>
            <p className="text-sm font-bold text-green-600">Active</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Type</p>
            <p className="text-sm font-bold text-gray-900">Debit</p>
          </div>
        </div>
      </div>
    </div>
  );
}
