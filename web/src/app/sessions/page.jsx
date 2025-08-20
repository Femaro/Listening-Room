"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  Users, 
  Search, 
  Filter,
  ArrowLeft,
  User,
  BookOpen,
  ArrowRight,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import useUser from "@/utils/useUser";

export default function SessionsPage() {
  const { data: user, loading: userLoading } = useUser();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/scheduled-sessions");
      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async (sessionId, sessionCode) => {
    try {
      setJoinLoading(true);
      setJoinError(null);

      const response = await fetch("/api/session-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduled_session_id: sessionId,
          session_code: sessionCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to join session");
      }

      const data = await response.json();
      alert(`Successfully booked session! You'll receive a reminder before it starts.`);
      
      // Refresh sessions to update participant count
      fetchSessions();
      setShowJoinModal(false);
      setJoinCode("");

    } catch (error) {
      console.error("Error joining session:", error);
      setJoinError(error.message);
    } finally {
      setJoinLoading(false);
    }
  };

  const handleJoinByCode = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setJoinError("Please enter a session code");
      return;
    }

    await handleJoinSession(null, joinCode.trim().toUpperCase());
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimeUntilSession = (sessionDate, startTime) => {
    const sessionDateTime = new Date(`${sessionDate}T${startTime}`);
    const now = new Date();
    const timeDiff = sessionDateTime.getTime() - now.getTime();
    
    if (timeDiff < 0) return "Session has passed";
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `In ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `In ${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `In ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return "Starting now";
  };

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.volunteer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to discover and join sessions</p>
          <a
            href="/account/signin"
            className="text-teal-600 hover:text-teal-700 font-medium"
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
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://ucarecdn.com/dc54868d-20c4-46fa-b583-6f27b18e95b5/-/format/auto/"
                alt="ListeningRoom"
                className="h-10 object-contain"
              />
              <h1 className="text-xl font-semibold text-gray-900">Available Sessions</h1>
            </div>
            <a
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Discover Listening Sessions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join scheduled sessions with experienced volunteers. Browse upcoming sessions or join with a session code.
          </p>
        </div>

        {/* Search and Join by Code */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Search Sessions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Sessions
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, description, or volunteer..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Join by Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Have a Session Code?
              </label>
              <button
                onClick={() => setShowJoinModal(true)}
                className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Join by Code
              </button>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mr-3"></div>
              <span className="text-gray-600">Loading sessions...</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-700">Error loading sessions: {error}</p>
            </div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No Sessions Found" : "No Sessions Available"}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? "Try adjusting your search terms or check back later for new sessions."
                : "Check back later for new scheduled sessions, or request immediate support on your dashboard."
              }
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{session.title}</h3>
                    <span className="text-sm text-teal-600 font-medium">
                      {getTimeUntilSession(session.session_date, session.start_time)}
                    </span>
                  </div>
                  
                  {session.description && (
                    <p className="text-gray-600 mb-3">{session.description}</p>
                  )}

                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    <span>Volunteer: {session.volunteer_name}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(session.session_date)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {formatTime(session.start_time)}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {session.duration_minutes} minutes
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {session.booked_participants}/{session.max_participants} joined
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Code: <code className="bg-gray-100 px-2 py-1 rounded font-mono">{session.session_code}</code>
                  </div>
                  <button
                    onClick={() => handleJoinSession(session.id)}
                    disabled={session.booked_participants >= session.max_participants}
                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {session.booked_participants >= session.max_participants ? (
                      "Session Full"
                    ) : (
                      <>
                        Join Session
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Join by Code Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Join Session by Code</h3>
            
            {joinError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{joinError}</p>
              </div>
            )}

            <form onSubmit={handleJoinByCode}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Code
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => {
                    setJoinCode(e.target.value.toUpperCase());
                    setJoinError(null);
                  }}
                  placeholder="Enter 6-character code"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-center font-mono text-lg"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowJoinModal(false);
                    setJoinCode("");
                    setJoinError(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={joinLoading || joinCode.length !== 6}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {joinLoading ? "Joining..." : "Join Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}