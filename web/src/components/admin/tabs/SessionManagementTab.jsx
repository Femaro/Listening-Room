import { Plus, Eye, Edit, Trash2 } from "lucide-react";

export default function SessionManagementTab({ sessions }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Session Management</h2>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Session</span>
        </button>
      </div>

      {/* Session Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
            All Sessions
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            Upcoming
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            Live
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            Completed
          </button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volunteer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {session.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        Code: {session.session_code}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">
                      {session.volunteer_name || "Unknown"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">
                        {new Date(session.session_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {session.start_time} ({session.duration_minutes}min)
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">
                      {session.current_participants || 0} /{" "}
                      {session.max_participants}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        session.status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : session.status === "live"
                            ? "bg-green-100 text-green-800"
                            : session.status === "completed"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
