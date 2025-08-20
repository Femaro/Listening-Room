import { Shield } from "lucide-react";

export default function AdminAuthRequired() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Authentication Required
        </h1>
        <p className="text-gray-600 mb-4">
          Please sign in to access the admin dashboard.
        </p>
        <a
          href="/account/signin"
          className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
        >
          Sign In
        </a>
      </div>
    </div>
  );
}
