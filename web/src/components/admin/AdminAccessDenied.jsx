import { AlertCircle } from "lucide-react";

export default function AdminAccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-4">
          You don't have permission to access the admin dashboard.
        </p>
        <a
          href="/"
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
