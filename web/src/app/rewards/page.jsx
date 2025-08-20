"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  DollarSign,
  Trophy,
  Star,
  TrendingUp,
  Gift,
  Timer,
  AlertCircle,
  CheckCircle,
  Heart,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";

function RewardCalculator() {
  const [minutes, setMinutes] = useState(1);
  const [continued, setContinued] = useState(false);

  const pointsPerMinute = 40;
  const pointsToDollar = 0.1; // 100 points = $10
  const continuationMultiplier = 1.5;

  const calculateRewards = (mins, isContinued = false) => {
    const multiplier = isContinued ? continuationMultiplier : 1;
    const points = mins * pointsPerMinute * multiplier;
    const amount = points * pointsToDollar;
    return { points: Math.floor(points), amount };
  };

  const { points, amount } = calculateRewards(minutes, continued);

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        Reward Calculator
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            Session Duration (minutes)
          </label>
          <input
            type="range"
            min="1"
            max="30"
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${((minutes - 1) / 29) * 100}%, #e5e7eb ${((minutes - 1) / 29) * 100}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-1">
            <span>1 min</span>
            <span className="font-medium text-teal-600 text-sm sm:text-base">
              {minutes} minutes
            </span>
            <span>30 min</span>
          </div>

          <div className="mt-4 sm:mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={continued}
                onChange={(e) => setContinued(e.target.checked)}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 w-4 h-4 sm:w-5 sm:h-5"
              />
              <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-700">
                Continued after 5-minute limit (1.5x multiplier)
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <div className="flex items-center mb-2">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 mr-2" />
              <span className="text-emerald-800 font-semibold text-sm sm:text-base">
                Points Earned
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-emerald-700">
              {points}
            </div>
            <div className="text-xs sm:text-sm text-emerald-600">
              {pointsPerMinute} pts/min {continued ? "× 1.5x" : ""}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-2" />
              <span className="text-green-800 font-semibold text-sm sm:text-base">
                Amount Earned
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-green-700">
              ${amount.toFixed(2)}
            </div>
            <div className="text-xs sm:text-sm text-green-600">
              100 points = $10.00
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RewardExamples() {
  const examples = [
    {
      scenario: "Quick Support Session",
      duration: "2 minutes",
      points: 80,
      amount: 8.0,
      description: "Short crisis support or quick question",
    },
    {
      scenario: "Standard Session",
      duration: "5 minutes",
      points: 200,
      amount: 20.0,
      description: "Full initial session before auto-termination",
    },
    {
      scenario: "Extended Session",
      duration: "10 minutes (5 min + 5 min continued)",
      points: 500, // 200 for first 5 min + 300 for continued 5 min (5 * 40 * 1.5)
      amount: 50.0,
      description: "Continued session with premium rates",
    },
    {
      scenario: "Long Support Session",
      duration: "20 minutes (5 min + 15 min continued)",
      points: 1100, // 200 + (15 * 40 * 1.5)
      amount: 110.0,
      description: "Extended emotional support session",
    },
  ];

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        Earning Examples
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {examples.map((example, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-0">
                {example.scenario}
              </h4>
              <div className="flex sm:flex-col items-start sm:items-end space-x-4 sm:space-x-0">
                <div className="text-lg sm:text-2xl font-bold text-emerald-600">
                  {example.points} pts
                </div>
                <div className="text-lg sm:text-2xl font-bold text-green-600">
                  ${example.amount.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mb-2 flex items-center">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              {example.duration}
            </div>
            <p className="text-sm sm:text-base text-gray-700">
              {example.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <a href="/">
                <img
                  src="https://ucarecdn.com/e05f1122-ee17-479a-b4b8-456584592d00/-/format/auto/"
                  alt="Listening Room"
                  className="h-8 sm:h-10 lg:h-14 object-contain"
                />
              </a>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <a
                href="/donate"
                className="text-orange-600 hover:text-orange-700 font-medium text-sm sm:text-base"
              >
                Donate
              </a>
              <a
                href="/account/signin"
                className="text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base"
              >
                Sign In
              </a>
              <a
                href="/account/signup"
                className="bg-teal-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors text-sm sm:text-base"
              >
                Get Started
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile-Optimized Hero Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 to-emerald-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
            <img
              src="https://ucarecdn.com/dc54868d-20c4-46fa-b583-6f27b18e95b5/-/format/auto/"
              alt="ListeningRoom Logo"
              className="h-10 sm:h-12 object-contain mr-0 sm:mr-4 mb-3 sm:mb-0"
            />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Volunteer Rewards System
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8">
            Get paid for making a difference. Our point-based reward system
            ensures volunteers are compensated fairly for their time helping
            others.
          </p>

          {/* Device Compatibility Indicator */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center justify-center space-x-3 sm:space-x-4 lg:space-x-6 text-blue-600 mb-3">
              <div className="flex flex-col items-center">
                <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                <span className="text-xs sm:text-sm font-medium">iPhone</span>
              </div>
              <div className="flex flex-col items-center">
                <Tablet className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                <span className="text-xs sm:text-sm font-medium">iPad</span>
              </div>
              <div className="flex flex-col items-center">
                <Monitor className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                <span className="text-xs sm:text-sm font-medium">Desktop</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-blue-600 font-medium">
              ✅ Fully optimized for all devices and screen sizes
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="/volunteer"
              className="bg-teal-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-teal-700 transition-colors"
            >
              Become a Volunteer
            </a>
            <a
              href="/volunteer/dashboard"
              className="border-2 border-teal-600 text-teal-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-teal-50 transition-colors"
            >
              Volunteer Dashboard
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Mobile-Responsive How It Works */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
            How the Reward System Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Timer className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Real-Time Tracking
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Your earnings are calculated in real-time as you help users.
                Watch your points and money grow every minute.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Escalating Rates
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Sessions auto-terminate at 5 minutes. Choose to continue for
                1.5x premium rates to help users who need more time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Monthly Payouts
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Request payouts when you reach $10 minimum. Get paid monthly via
                your preferred payment method.
              </p>
            </div>
          </div>
        </section>

        {/* Mobile-Optimized Reward Structure */}
        <section className="mb-12 sm:mb-16">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Reward Structure
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-teal-600 mb-1 sm:mb-2">
                  40
                </div>
                <div className="text-gray-700 font-medium mb-1 text-xs sm:text-sm lg:text-base">
                  Points per Minute
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Base rate for all volunteers
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1 sm:mb-2">
                  100
                </div>
                <div className="text-gray-700 font-medium mb-1 text-xs sm:text-sm lg:text-base">
                  Points = $10
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Point to dollar conversion
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">
                  5
                </div>
                <div className="text-gray-700 font-medium mb-1 text-xs sm:text-sm lg:text-base">
                  Minute Auto-End
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Free session limit
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">
                  1.5x
                </div>
                <div className="text-gray-700 font-medium mb-1 text-xs sm:text-sm lg:text-base">
                  Continuation Rate
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Premium session multiplier
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile-First Calculator */}
        <section className="mb-12 sm:mb-16">
          <RewardCalculator />
        </section>

        {/* Mobile-Responsive Examples */}
        <section className="mb-12 sm:mb-16">
          <RewardExamples />
        </section>

        {/* Mobile-Optimized Session Flow */}
        <section className="mb-12 sm:mb-16">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Session Flow & Timing
            </h3>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    Session Starts
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                    Timer begins, earning 40 points per minute (minimum 1 minute
                    for rewards)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    5-Minute Mark
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                    Session auto-terminates. You've earned 200 points ($20.00)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    Continuation Choice
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                    Choose to continue at 1.5x rate (60 points/min) or end
                    session and finalize earnings
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    Session Ends
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                    Final earnings calculated and added to your pending balance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile-Responsive Benefits */}
        <section className="mb-12 sm:mb-16">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg sm:rounded-xl text-white p-4 sm:p-6 lg:p-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Why Our Reward System Works
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h4 className="font-semibold mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Fair Compensation
                </h4>
                <p className="text-teal-100 mb-4 sm:mb-6 text-xs sm:text-sm lg:text-base">
                  Every minute of support is valued and compensated. No unpaid
                  emotional labor.
                </p>

                <h4 className="font-semibold mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Prevents Burnout
                </h4>
                <p className="text-teal-100 mb-4 sm:mb-6 text-xs sm:text-sm lg:text-base">
                  5-minute limits prevent volunteer fatigue while allowing
                  continuation when needed.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Quality Incentive
                </h4>
                <p className="text-teal-100 mb-4 sm:mb-6 text-xs sm:text-sm lg:text-base">
                  Premium rates for extended sessions encourage thorough support
                  when users need it most.
                </p>

                <h4 className="font-semibold mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Sustainable Model
                </h4>
                <p className="text-teal-100 text-xs sm:text-sm lg:text-base">
                  Reward system ensures long-term volunteer retention and
                  platform sustainability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile-Optimized CTA */}
        <section className="text-center">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4 sm:mb-6" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Get Paid to Make a Difference
            </h3>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8">
              Join hundreds of volunteers earning meaningful income while
              providing crucial mental health support.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="/volunteer"
                className="bg-teal-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-teal-700 transition-colors"
              >
                Apply to Volunteer
              </a>
              <a
                href="/volunteer/dashboard"
                className="border-2 border-teal-600 text-teal-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-teal-50 transition-colors"
              >
                View Dashboard Demo
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile-Friendly Custom Styles */}
      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #0d9488;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #0d9488;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        @media (max-width: 640px) {
          input[type="range"]::-webkit-slider-thumb {
            height: 24px;
            width: 24px;
          }
          
          input[type="range"]::-moz-range-thumb {
            height: 24px;
            width: 24px;
          }
        }
      `}</style>
    </div>
  );
}
