import { MessageCircle } from "lucide-react";

export default function NoActiveSession({ isAvailable, onRefresh }) {
    return (
        <div className="bg-white rounded-lg sm:rounded-xl shadow p-6 sm:p-8 text-center">
            <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            No Active Sessions
            </h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            {isAvailable
                ? "You're available for new sessions. Users will be matched with you automatically."
                : "Set yourself as available to start helping users."}
            </p>
            {!isAvailable && (
            <button
                onClick={onRefresh}
                className="availability-toggle touch-target w-full sm:w-auto bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors text-sm sm:text-base"
            >
                Refresh Status
            </button>
            )}
        </div>
    )
}
