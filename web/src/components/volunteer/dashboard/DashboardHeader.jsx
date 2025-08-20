import { Star } from "lucide-react";

export default function DashboardHeader({ user, stats }) {
    return (
        <header className="bg-white shadow-sm">
          <div className="header-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-3 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Volunteer Dashboard
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Welcome back, {user.name || "Volunteer"}
                </p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                <span className="text-base sm:text-lg font-semibold text-gray-900">
                  {stats.rating || "5.0"} Rating
                </span>
              </div>
            </div>
          </div>
        </header>
    )
}
