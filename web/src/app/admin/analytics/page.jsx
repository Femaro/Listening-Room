import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  MessageCircle,
  Clock,
  TrendingUp,
  Calendar,
  Star,
  Heart,
  DollarSign,
  Globe,
  Settings,
  ArrowLeft,
} from "lucide-react";
import useUser from "@/utils/useUser";

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("30");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, userLoading]);

  useEffect(() => {
    if (profile?.user_type === "admin") {
      fetchAnalytics();
    }
  }, [profile, period, activeTab]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profiles");
      if (!response.ok) throw new Error("Failed to fetch profile");
      
      const data = await response.json();
      if (!data.profile) {
        window.location.href = "/onboarding";
        return;
      }

      if (data.profile.user_type !== "admin") {
        window.location.href = "/dashboard";
        return;
      }

      setProfile(data.profile);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?period=${period}&type=${activeTab}`);
      if (!response.ok) throw new Error("Failed to fetch analytics");
      
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (userLoading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 animate-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <a
                href="/dashboard"
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </a>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    ListeningRoom Analytics
                  </h1>
                  <p className="text-sm text-gray-600">
                    Platform insights and metrics
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "sessions", label: "Sessions", icon: MessageCircle },
              { id: "feedback", label: "Feedback", icon: Star },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && analytics?.overview && (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <MessageCircle className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Sessions</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.overview.total_sessions.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">New Users</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.overview.new_users.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Clock className="h-8 w-8 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Avg Duration</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.overview.avg_duration_minutes}m
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <DollarSign className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Donations</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(analytics.overview.total_donations)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {analytics.overview.donation_count} donors
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Session Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Completed</span>
                        <span className="text-sm font-medium">
                          {analytics.overview.completed_sessions} ({analytics.overview.completion_rate}%)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active</span>
                        <span className="text-sm font-medium">{analytics.overview.active_volunteers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Waiting</span>
                        <span className="text-sm font-medium">{analytics.overview.waiting_sessions}</span>
                      </div>
                    </div>
                  </div>

                  {/* Language Distribution */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Languages</h3>
                    <div className="space-y-3">
                      {analytics.language_stats?.slice(0, 5).map((lang, index) => (
                        <div key={lang.language} className="flex justify-between">
                          <span className="text-sm text-gray-600 capitalize">
                            {lang.language === 'en' ? 'English' : 
                             lang.language === 'es' ? 'Spanish' : lang.language}
                          </span>
                          <span className="text-sm font-medium">{lang.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* User Types */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">User Types</h3>
                    <div className="space-y-3">
                      {analytics.user_type_stats?.map((type, index) => (
                        <div key={type.user_type} className="flex justify-between">
                          <span className="text-sm text-gray-600 capitalize">{type.user_type}s</span>
                          <span className="text-sm font-medium">{type.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Daily Sessions Chart */}
                {analytics.daily_stats && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Activity</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.daily_stats.slice().reverse()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => new Date(value).toLocaleDateString()}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            labelFormatter={(value) => new Date(value).toLocaleDateString()}
                            formatter={(value, name) => [value, name === 'sessions' ? 'Total Sessions' : 'Completed']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="sessions" 
                            stroke="#3B82F6" 
                            strokeWidth={2}
                            dot={{ fill: '#3B82F6' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="completed" 
                            stroke="#10B981" 
                            strokeWidth={2}
                            dot={{ fill: '#10B981' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Sessions Tab */}
            {activeTab === "sessions" && analytics?.sessions && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Sessions</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Session
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Participants
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Started
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.sessions.map((session) => (
                        <tr key={session.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">#{session.id}</div>
                            {session.topic && (
                              <div className="text-sm text-gray-500">{session.topic}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              session.session_type === 'group' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {session.session_type === 'group' ? 'Group' : 'One-on-One'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {session.participant_count || 1}
                            {session.max_participants && `/${session.max_participants}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              session.status === 'ended' ? 'bg-gray-100 text-gray-800' :
                              session.status === 'active' ? 'bg-green-100 text-green-800' :
                              session.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {session.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(session.started_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {session.ended_at ? 
                              Math.round((new Date(session.ended_at) - new Date(session.started_at)) / (1000 * 60)) + 'm' :
                              '-'
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Feedback Tab */}
            {activeTab === "feedback" && analytics?.stats && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Star className="h-8 w-8 text-yellow-500" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Avg Rating</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {parseFloat(analytics.stats.avg_rating || 0).toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <MessageCircle className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Feedback</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.stats.total_feedback || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Heart className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Helpful Sessions</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.round(((analytics.stats.helpful_count || 0) / (analytics.stats.total_feedback || 1)) * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Star className="h-8 w-8 text-yellow-500" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">5-Star Reviews</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.stats.five_star_count || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Feedback */}
                {analytics.recent_feedback && (
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Recent Feedback</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {analytics.recent_feedback.slice(0, 10).map((feedback) => (
                        <div key={feedback.id} className="px-6 py-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < (feedback.rating || 0)
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  {feedback.seeker_username}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  feedback.was_helpful 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {feedback.was_helpful ? 'Helpful' : 'Not Helpful'}
                                </span>
                              </div>
                              {feedback.feedback_text && (
                                <p className="text-sm text-gray-600 mt-1">
                                  "{feedback.feedback_text}"
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(feedback.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MainComponent;