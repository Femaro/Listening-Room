import { Shield, Activity, User } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Shield className="w-8 h-8 text-teal-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Platform management and control
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">System Online</span>
            </div>
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-teal-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
