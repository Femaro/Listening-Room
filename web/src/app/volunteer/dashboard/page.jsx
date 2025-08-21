"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  Plus,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock3,
} from "lucide-react";
import { useVolunteerDashboard } from "@/hooks/useVolunteerDashboard";
import USAccessibilityBanner from "@/components/volunteer/dashboard/USAccessibilityBanner";
import iPhone16ProMaxOptimizer from "@/components/volunteer/dashboard/iPhone16ProMaxOptimizer";
import LoadingIndicator from "@/components/volunteer/dashboard/LoadingIndicator";
import AccessRequired from "@/components/volunteer/dashboard/AccessRequired";
import DashboardHeader from "@/components/volunteer/dashboard/DashboardHeader";
import DeviceCompatibility from "@/components/volunteer/dashboard/DeviceCompatibility";
import AvailabilityToggle from "@/components/volunteer/dashboard/AvailabilityToggle";
import VolunteerStats from "@/components/volunteer/dashboard/VolunteerStats";
import RealtimeTimer from "@/components/volunteer/dashboard/RealtimeTimer";
import NoActiveSession from "@/components/volunteer/dashboard/NoActiveSession";

export default function VolunteerDashboard() {
  const {
    user,
    loading,
    activeSession,
    stats,
    availability,
    fetchDashboardData,
    handleTimeUpdate,
    handleAutoTerminate,
  } = useVolunteerDashboard();

  const [activeTab, setActiveTab] = useState("overview");
  const [scheduledSessions, setScheduledSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [errorSessions, setErrorSessions] = useState(null);

  useEffect(() => {
    if (user && activeTab === "sessions") {
      fetchScheduledSessions();
    }
  }, [user, activeTab]);

  const fetchScheduledSessions = async () => {
    try {
      setLoadingSessions(true);
      const response = await fetch("/api/scheduled-sessions");
      if (!response.ok) {
        throw new Error("Failed to fetch scheduled sessions");
      }
      const data = await response.json();
      setScheduledSessions(data.sessions || []);
    } catch (error) {
      console.error("Error fetching scheduled sessions:", error);
      setErrorSessions(error.message);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleCopySessionCode = (sessionCode) => {
    navigator.clipboard.writeText(sessionCode);
  };

  const handleCancelSession = async (sessionId) => {
    if (
      !confirm(
        "Are you sure you want to cancel this session? This cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/scheduled-sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel session");
      }

      fetchScheduledSessions();
    } catch (error) {
      console.error("Error cancelling session:", error);
      setErrorSessions(error.message);
    }
  };

  const handleStartSession = async (sessionId) => {
    try {
      const response = await fetch(`/api/scheduled-sessions/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "live" }),
      });
      if (!response.ok) {
        throw new Error("Failed to start session");
      }
      // Navigate to session room
      window.location.href = `/session/${sessionId}`;
    } catch (error) {
      console.error("Error starting session:", error);
      setErrorSessions(error.message);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      scheduled: { bg: "bg-blue-100", text: "text-blue-800", icon: Clock3 },
      live: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
      completed: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: CheckCircle,
      },
      cancelled: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
    };

    const style = statusStyles[status] || statusStyles.scheduled;
    const IconComponent = style.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!user) {
    return <AccessRequired />;
  }

  return (
    <iPhone16ProMaxOptimizer>
      <div className="min-h-screen bg-gray-50">
        <USAccessibilityBanner />
        <DashboardHeader user={user} stats={stats} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Tab Navigation */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("sessions")}
                className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "sessions"
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Scheduled Sessions
              </button>
            </nav>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-4 sm:space-y-6">
              <DeviceCompatibility />
              <AvailabilityToggle
                availability={availability}
                onToggle={fetchDashboardData}
              />
              <VolunteerStats stats={stats} />
              {activeSession ? (
                <RealtimeTimer
                  sessionId={activeSession.id}
                  onTimeUpdate={handleTimeUpdate}
                  onAutoTerminate={handleAutoTerminate}
                />
              ) : (
                <NoActiveSession
                  isAvailable={availability?.is_available}
                  onRefresh={fetchDashboardData}
                />
              )}
            </div>
          )}

          {activeTab === "sessions" && (
            <div className="space-y-6">
              {/* Header with Create Button */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Scheduled Sessions
                  </h2>
                  <p className="text-gray-600">
                    Manage your upcoming and completed sessions
                  </p>
                </div>
                <a
                  href="/volunteer/sessions/create"
                  className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Session
                </a>
              </div>

              {/* Sessions List */}
              {loadingSessions ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mr-3"></div>
                    <span className="text-gray-600">Loading sessions...</span>
                  </div>
                </div>
              ) : errorSessions ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    <p className="text-red-700">
                      Error loading sessions: {errorSessions}
                    </p>
                  </div>
                </div>
              ) : scheduledSessions.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Sessions Yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create your first scheduled session to start helping users
                    at specific times.
                  </p>
                  <a
                    href="/volunteer/sessions/create"
                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Session
                  </a>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      Your Sessions
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {scheduledSessions.map((session) => (
                      <div key={session.id} className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h4 className="text-lg font-medium text-gray-900 mr-3">
                                {session.title}
                              </h4>
                              {getStatusBadge(session.status)}
                            </div>

                            {session.description && (
                              <p className="text-gray-600 mb-3">
                                {session.description}
                              </p>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {formatDate(session.session_date)}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                {formatTime(session.start_time)}
                              </div>
                              <div className="flex items-center">
                                <Clock3 className="w-4 h-4 mr-2" />
                                {session.duration_minutes} min
                              </div>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-2" />
                                {session.booked_participants || 0}/
                                {session.max_participants}
                              </div>
                            </div>

                            {/* Session Code */}
                            <div className="mt-3 flex items-center">
                              <span className="text-sm text-gray-500 mr-2">
                                Session Code:
                              </span>
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                                {session.session_code}
                              </code>
                              <button
                                onClick={() =>
                                  handleCopySessionCode(session.session_code)
                                }
                                className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                                title="Copy session code"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Participants */}
                            {session.participants &&
                              session.participants.length > 0 && (
                                <div className="mt-3">
                                  <span className="text-sm text-gray-500">
                                    Participants:
                                  </span>
                                  <div className="mt-1 space-y-1">
                                    {session.participants.map(
                                      (participant, index) => (
                                        <div
                                          key={index}
                                          className="text-sm text-gray-700"
                                        >
                                          {participant.name ||
                                            participant.email}
                                          <span className="ml-2 text-xs text-gray-500">
                                            ({participant.booking_status})
                                          </span>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>

                          {/* Actions */}
                          <div className="ml-4 flex flex-col space-y-2">
                            {session.status === "scheduled" && (
                              <div className="flex flex-col space-y-2">
                                <button
                                  onClick={() => handleStartSession(session.id)}
                                  className="inline-flex items-center px-3 py-1.5 text-sm text-teal-700 bg-teal-100 rounded hover:bg-teal-200 transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Start
                                </button>
                                <button
                                  onClick={() => handleCancelSession(session.id)}
                                  className="inline-flex items-center px-3 py-1.5 text-sm text-red-700 bg-red-100 rounded hover:bg-red-200 transition-colors"
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Cancel
                                </button>
                              </div>
                            )}
                            {session.status === "live" && (
                              <a
                                href={`/session/${session.id}`}
                                className="inline-flex items-center px-3 py-1.5 text-sm text-green-700 bg-green-100 rounded hover:bg-green-200 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Join
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </iPhone16ProMaxOptimizer>
  );
}
