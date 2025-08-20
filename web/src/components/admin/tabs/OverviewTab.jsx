import {
  Users,
  UserCheck,
  Calendar,
  Clock,
  User,
} from "lucide-react";

export default function OverviewTab({ data }) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">
                {data.users.length}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Volunteers
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {data.volunteers.filter((v) => v.is_available).length}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Sessions Today
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {
                  data.sessions.filter(
                    (s) =>
                      new Date(s.session_date).toDateString() ===
                      new Date().toDateString(),
                  ).length
                }
              </p>
            </div>
            <Calendar className="w-8 h-8 text-teal-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Applications
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {data.applications.filter((a) => a.status === "pending").length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Applications
          </h3>
          <div className="space-y-3">
            {data.applications.slice(0, 5).map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {app.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">{app.email}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    app.status === "pending"
                      ? "bg-orange-100 text-orange-800"
                      : app.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Sessions
          </h3>
          <div className="space-y-3">
            {data.sessions.slice(0, 5).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{session.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(session.session_date).toLocaleDateString()} at{" "}
                      {session.start_time}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    session.status === "scheduled"
                      ? "bg-blue-100 text-blue-800"
                      : session.status === "live"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {session.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
