"use client";

import { useState, useEffect } from "react";
import { Trophy, DollarSign, AlertCircle } from "lucide-react";
import { formatTime } from "@/utils/formatTime";

export default function RealtimeTimer({ sessionId, onTimeUpdate, onAutoTerminate }) {
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [showTerminationDialog, setShowTerminationDialog] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!sessionId || !isActive) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/chat-sessions/${sessionId}/rewards`);
        if (!response.ok) return;

        const data = await response.json();
        const session = data.session;

        const newTimeSpent = Math.floor(session.time_spent_minutes * 60);
        setTimeSpent(newTimeSpent);
        setCurrentPoints(session.current_points);
        setCurrentAmount(session.current_amount);

        // Check for auto-termination
        if (session.should_auto_terminate && !showTerminationDialog) {
          setShowTerminationDialog(true);
          onAutoTerminate();
        }

        onTimeUpdate({
          time: newTimeSpent,
          points: session.current_points,
          amount: session.current_amount,
        });
      } catch (error) {
        console.error("Error fetching session rewards:", error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    sessionId,
    isActive,
    onTimeUpdate,
    onAutoTerminate,
    showTerminationDialog,
  ]);

  const handleContinueSession = async () => {
    try {
      const response = await fetch(`/api/chat-sessions/${sessionId}/rewards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "continue" }),
      });

      if (response.ok) {
        setShowTerminationDialog(false);
      }
    } catch (error) {
      console.error("Error continuing session:", error);
    }
  };

  const handleEndSession = async () => {
    try {
      await fetch(`/api/chat-sessions/${sessionId}/end`, {
        method: "POST",
      });
      setIsActive(false);
      setShowTerminationDialog(false);
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
          Active Session Timer
        </h2>
        {isActive ? (
          <div className="flex items-center text-green-600">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="font-medium text-sm sm:text-base">Live</span>
          </div>
        ) : (
          <div className="flex items-center text-gray-500">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 rounded-full mr-2"></div>
            <span className="font-medium text-sm sm:text-base">Ended</span>
          </div>
        )}
      </div>

      <div className="text-center mb-6 sm:mb-8">
        <div className="timer-display text-4xl sm:text-5xl lg:text-6xl font-mono font-bold text-teal-600 mb-2">
          {formatTime(timeSpent)}
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Time helping this user
        </p>
      </div>

      <div className="earnings-cards grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mr-2" />
            <span className="text-emerald-800 font-semibold text-sm sm:text-base">
              Points Earned
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-700">
            {currentPoints}
          </div>
          <div className="text-xs sm:text-sm text-emerald-600">
            40 pts/min base rate
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-semibold text-sm sm:text-base">
              Amount Earned
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-green-700">
            ${currentAmount.toFixed(2)}
          </div>
          <div className="text-xs sm:text-sm text-green-600">
            100 pts = $10.00
          </div>
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
          <div
            className="bg-teal-600 h-full transition-all duration-1000"
            style={{ width: `${Math.min((timeSpent / 300) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs sm:text-sm mt-1 sm:mt-2 text-gray-600">
          <span>0:00</span>
          <span className="font-medium">
            {timeSpent >= 300 ? "OVERTIME" : "Auto-ends at 5:00"}
          </span>
          <span>5:00</span>
        </div>
      </div>

      {showTerminationDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="session-dialog bg-white rounded-xl sm:rounded-xl shadow-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-6 mx-4">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-2 sm:mb-4">
                5-Minute Session Limit Reached
              </h3>
              <p className="text-orange-700 mb-4 sm:mb-6 text-sm sm:text-base">
                The initial 5-minute free session has ended. Continue with
                premium rates (1.5x multiplier) or end the session now.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-orange-800">
                  <strong>Premium Rate:</strong> $6.00/minute (1.5x standard
                  rate)
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleContinueSession}
                  className="availability-toggle w-full sm:flex-1 bg-orange-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors text-sm sm:text-base touch-target"
                >
                  Continue Session (1.5x Rate)
                </button>
                <button
                  onClick={handleEndSession}
                  className="availability-toggle w-full sm:flex-1 border border-orange-600 text-orange-600 px-4 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors text-sm sm:text-base touch-target"
                >
                  End Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
