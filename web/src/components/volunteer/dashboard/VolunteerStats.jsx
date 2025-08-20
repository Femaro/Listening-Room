"use client";

import { MessageCircle, Clock, Trophy, DollarSign } from "lucide-react";

export default function VolunteerStats({ stats }) {
  return (
    <div className="stats-grid-iphone16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600 mb-2 sm:mb-0 sm:mr-3" />
          <div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {stats.totalSessions || 0}
            </div>
            <div className="text-gray-600 text-xs sm:text-sm">
              Sessions Completed
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 mb-2 sm:mb-0 sm:mr-3" />
          <div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {stats.totalHours || 0}h
            </div>
            <div className="text-gray-600 text-xs sm:text-sm">Total Time</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 mb-2 sm:mb-0 sm:mr-3" />
          <div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {stats.totalPoints || 0}
            </div>
            <div className="text-gray-600 text-xs sm:text-sm">Total Points</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mb-2 sm:mb-0 sm:mr-3" />
          <div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              ${stats.totalEarnings || 0}
            </div>
            <div className="text-gray-600 text-xs sm:text-sm">Total Earned</div>
          </div>
        </div>
      </div>
    </div>
  );
}
