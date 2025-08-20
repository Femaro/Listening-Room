import {
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Award,
  User,
} from "lucide-react";

export default function VolunteerManagementTab({ applications }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Volunteer Management
        </h2>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Award className="w-4 h-4" />
            <span>Assign Training</span>
          </button>
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Volunteer</span>
          </button>
        </div>
      </div>

      {/* Applications Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Pending Applications
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {applications
            .filter((app) => app.status === "pending")
            .map((application) => (
              <div key={application.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {application.name || "Unknown"}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {application.email}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          {application.country || "Unknown"}
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {application.created_at
                            ? new Date(
                                application.created_at,
                              ).toLocaleDateString()
                            : "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 flex items-center space-x-1">
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button className="bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {application.motivation && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {application.motivation}
                    </p>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
