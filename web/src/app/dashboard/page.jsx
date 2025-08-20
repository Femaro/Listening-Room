"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Plus,
  Settings,
  LogOut,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Award,
  Activity,
  MessageSquare,
  Star,
  Play,
  Pause,
  User,
  Shield
} from "lucide-react";

export default function VolunteerDashboard() {
  const { data: user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [trainingModules, setTrainingModules] = useState([]);
  const [stats, setStats] = useState({});
  const [isOnline, setIsOnline] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
      return;
    }

    if (user) {
      checkVolunteerAccess();
    }
  }, [user, userLoading]);

  const checkVolunteerAccess = async () => {
    try {
      const response = await fetch("/api/profiles");
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      
      const data = await response.json();
      if (!data.profile) {
        window.location.href = "/onboarding";
        return;
      }

      if (data.profile.user_type !== "volunteer") {
        window.location.href = "/"; // Redirect non-volunteers
        return;
      }

      setProfile(data.profile);
      loadDashboardData();
    } catch (err) {
      console.error("Error checking access:", err);
      setError("Failed to load profile");
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [sessionsRes, trainingRes, statsRes, availabilityRes] = await Promise.all([
        fetch("/api/scheduled-sessions"),
        fetch("/api/training/modules"),
        fetch("/api/volunteers/stats"),
        fetch("/api/volunteers/availability")
      ]);

      if (sessionsRes.ok) {
        const sessionData = await sessionsRes.json();
        setSessions(sessionData.sessions || []);
      }

      if (trainingRes.ok) {
        const trainingData = await trainingRes.json();
        setTrainingModules(trainingData.modules || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData || {});
      }

      if (availabilityRes.ok) {
        const availData = await availabilityRes.json();
        setIsOnline(availData.is_online || false);
        setIsAvailable(availData.is_available || false);
      }

    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      const response = await fetch("/api/volunteers/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_online: !isOnline,
          is_available: !isAvailable
        })
      });

      if (response.ok) {
        setIsOnline(!isOnline);
        setIsAvailable(!isAvailable);
      } else {
        throw new Error("Failed to update availability");
      }
    } catch (err) {
      console.error("Error updating availability:", err);
      setError("Failed to update availability status");
    }
  };

  const createNewSession = () => {
    window.location.href = "/volunteer/sessions/create";
  };

  const viewSession = (sessionId) => {
    window.location.href = `/session/${sessionId}`;
  };

  const editSession = (sessionId) => {
    window.location.href = `/volunteer/sessions/edit/${sessionId}`;
  };

  const deleteSession = async (sessionId) => {
    if (!confirm("Are you sure you want to delete this session?")) return;

    try {
      const response = await fetch(`/api/scheduled-sessions/${sessionId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setSessions(sessions.filter(s => s.id !== sessionId));
      } else {
        throw new Error("Failed to delete session");
      }
    } catch (err) {
      console.error("Error deleting session:", err);
      setError("Failed to delete session");
    }
  };

  const startTraining = (moduleId) => {
    window.location.href = `/training/module/${moduleId}`;
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h1>
          <p className="text-gray-600 mb-4">Please sign in to access the volunteer dashboard.</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img
                src="https://ucarecdn.com/e05f1122-ee17-479a-b4b8-456584592d00/-/format/auto/"
                alt="Listening Room Logo"
                className="h-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Volunteer Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {profile?.username || user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Availability Toggle */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Available</span>
                <button
                  onClick={toggleAvailability}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                    isAvailable ? 'bg-teal-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isAvailable ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Activity className={`w-5 h-5 ${isOnline ? 'text-green-500' : 'text-gray-400'}`} />
                <span className="text-sm text-gray-600">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              
              <button
                onClick={() => window.location.href = '/settings'}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => window.location.href = '/account/logout'}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSessions || 0}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-gray-900">{stats.monthSessions || 0}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900">{stats.avgRating || '0.0'}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalHours || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-teal-500" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sessions Management */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">My Sessions</h2>
                <button
                  onClick={createNewSession}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Session</span>
                </button>
              </div>

              <div className="divide-y divide-gray-200">
                {sessions.length > 0 ? (
                  sessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{session.title}</h3>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(session.session_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {session.start_time} ({session.duration_minutes}min)
                            </span>
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {session.current_participants || 0}/{session.max_participants}
                            </span>
                          </div>
                          {session.description && (
                            <p className="mt-2 text-sm text-gray-600">{session.description}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            session.status === 'live' ? 'bg-green-100 text-green-800' :
                            session.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {session.status}
                          </span>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => viewSession(session.id)}
                              className="p-2 text-gray-400 hover:text-blue-600"
                              title="View Session"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {session.status === 'scheduled' && (
                              <>
                                <button
                                  onClick={() => editSession(session.id)}
                                  className="p-2 text-gray-400 hover:text-green-600"
                                  title="Edit Session"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteSession(session.id)}
                                  className="p-2 text-gray-400 hover:text-red-600"
                                  title="Delete Session"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
                    <p className="text-gray-600 mb-4">Create your first listening session to help others.</p>
                    <button
                      onClick={createNewSession}
                      className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                    >
                      Create Your First Session
                    </button>
                  </div>
                )}
              </div>

              {sessions.length > 5 && (
                <div className="p-4 border-t border-gray-200 text-center">
                  <button
                    onClick={() => window.location.href = '/volunteer/sessions'}
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    View All Sessions
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Training Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Training Modules
                </h2>
              </div>
              <div className="p-6">
                {trainingModules.length > 0 ? (
                  <div className="space-y-4">
                    {trainingModules.slice(0, 4).map((module) => (
                      <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 text-sm">{module.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {module.duration_minutes} minutes
                            </p>
                            {module.is_completed && (
                              <div className="flex items-center mt-2 text-xs text-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            {module.is_completed ? (
                              <button
                                onClick={() => startTraining(module.id)}
                                className="p-1 text-gray-400 hover:text-blue-600"
                                title="Review Module"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => startTraining(module.id)}
                                className="p-1 text-gray-400 hover:text-green-600"
                                title="Start Training"
                              >
                                <Play className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">No training modules available</p>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => window.location.href = '/training'}
                    className="w-full text-center text-teal-600 hover:text-teal-700 text-sm font-medium"
                  >
                    View All Training
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-sm font-medium text-gray-900">{stats.completionRate || '0%'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-medium text-gray-900">{stats.avgResponseTime || '0m'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Training Progress</span>
                  <span className="text-sm font-medium text-gray-900">
                    {trainingModules.filter(m => m.is_completed).length}/{trainingModules.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/volunteer/sessions/create'}
                  className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 text-sm font-medium"
                >
                  Schedule New Session
                </button>
                <button
                  onClick={() => window.location.href = '/training'}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 text-sm font-medium"
                >
                  Continue Training
                </button>
                <button
                  onClick={() => window.location.href = '/settings'}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 text-sm font-medium"
                >
                  Update Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}