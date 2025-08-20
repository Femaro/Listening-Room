import { AlertCircle } from "lucide-react";

export default function AccessRequired() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-md w-full text-center">
        <AlertCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
          Access Required
        </h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Please sign in to access your volunteer dashboard.
        </p>
        <a
          href="/account/signin"
          className="w-full inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors text-sm sm:text-base touch-target"
        >
          Sign In
        </a>
      </div>
    </div>
  );
}
