"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Heart,
  MessageCircle,
  Settings,
  Phone,
  PhoneCall,
  Globe,
  Users,
  Star,
  Filter,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Loader,
  MapPin,
  Clock,
  Target,
  ArrowRight,
} from "lucide-react";
import useUser from "@/utils/useUser";

function SpecializationSelector({ onSelect, selectedSpecializations = [] }) {
  const [specializations, setSpecializations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await fetch('/api/volunteer-specializations');
        const data = await response.json();
        setSpecializations(data.categorized_specializations || {});
      } catch (error) {
        console.error('Failed to load specializations:', error);
      }
      setLoading(false);
    };

    fetchSpecializations();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Target className="w-5 h-5 text-teal-600" />
        <h3 className="font-semibold text-gray-900">Choose Your Support Type</h3>
      </div>
      
      <div className="space-y-6">
        {Object.entries(specializations).map(([category, specs]) => (
          <div key={category}>
            <h4 className="font-medium text-gray-800 mb-3 capitalize">
              {category.replace(/_/g, ' ')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {specs.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => onSelect(spec.id)}
                  className={`p-3 text-left rounded-lg border transition-colors ${
                    selectedSpecializations.includes(spec.id)
                      ? 'border-teal-500 bg-teal-50 text-teal-900'
                      : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                  }`}
                >
                  <div className="font-medium text-sm">{spec.name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {spec.volunteer_count} volunteers available
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActiveSessionCard({ session, onCall }) {
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    if (!session) return;

    const startTime = new Date(session.started_at);
    const interval = setInterval(() => {
      const now = new Date();
      const diffInSeconds = Math.floor((now - startTime) / 1000);
      setTimeSpent(diffInSeconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  if (!session) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg shadow-lg text-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-semibold">Active Session</span>
        </div>
        <div className="text-2xl font-mono font-bold">
          {formatTime(timeSpent)}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-teal-100 text-sm mb-2">Connected with volunteer from:</p>
        <p className="font-medium">{session.volunteer_country || 'Global'}</p>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => onCall(session.id)}
          className="flex-1 bg-white text-teal-600 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
        >
          <PhoneCall className="w-5 h-5" />
          <span>Voice Call</span>
        </button>
        <button
          onClick={() => window.location.href = `/chat/${session.id}`}
          className="flex-1 bg-teal-400 text-white px-4 py-3 rounded-lg font-medium hover:bg-teal-300 transition-colors flex items-center justify-center space-x-2"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Continue Chat</span>
        </button>
      </div>

      {timeSpent >= 300 && (
        <div className="mt-4 p-3 bg-orange-500 rounded-lg">
          <p className="text-sm font-medium">
            Free session ended. Continuing at premium rates.
          </p>
        </div>
      )}
    </div>
  );
}

function QuickMatchCard({ onStartMatching, selectedSpecializations, selectedLocation }) {
  const [isMatching, setIsMatching] = useState(false);

  const handleQuickMatch = async () => {
    setIsMatching(true);
    await onStartMatching();
    setIsMatching(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Heart className="w-5 h-5 text-pink-600" />
        <h3 className="font-semibold text-gray-900">Quick Connect</h3>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-4 h-4" />
            <span>Location: {selectedLocation?.country_name || 'Global'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>
              {selectedSpecializations.length > 0 
                ? `${selectedSpecializations.length} specializations selected`
                : 'Any volunteer'
              }
            </span>
          </div>
        </div>

        <button
          onClick={handleQuickMatch}
          disabled={isMatching}
          className="w-full bg-teal-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isMatching ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Finding volunteer...</span>
            </>
          ) : (
            <>
              <Heart className="w-5 h-5" />
              <span>Start Free Chat</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          First 5 minutes are completely free
        </p>
      </div>
    </div>
  );
}

function SettingsModal({ isOpen, onClose, preferences, onSave }) {
  const [formData, setFormData] = useState({
    preferred_languages: ['en'],
    preferred_specializations: [],
    preferred_volunteer_gender: 'any',
    ...preferences
  });
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchSpecializations = async () => {
        try {
          const response = await fetch('/api/volunteer-specializations');
          const data = await response.json();
          setSpecializations(data.specializations || []);
        } catch (error) {
          console.error('Failed to load specializations:', error);
        }
      };
      fetchSpecializations();
    }
  }, [isOpen]);

  const handleSave = async () => {
    setLoading(true);
    await onSave(formData);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Preferences & Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Language Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Preferred Languages
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['en', 'es', 'fr', 'de', 'it', 'pt', 'ar', 'zh', 'hi', 'sw'].map(lang => (
                <label key={lang} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.preferred_languages.includes(lang)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          preferred_languages: [...prev.preferred_languages, lang]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          preferred_languages: prev.preferred_languages.filter(l => l !== lang)
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{lang}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Volunteer Gender Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Volunteer Gender Preference
            </label>
            <select
              value={formData.preferred_volunteer_gender}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                preferred_volunteer_gender: e.target.value
              }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="any">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non_binary">Non-binary</option>
            </select>
          </div>

          {/* Preferred Specializations */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Preferred Support Types
            </label>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {specializations.map(spec => (
                <label key={spec.id} className="flex items-start space-x-2 mb-3 last:mb-0">
                  <input
                    type="checkbox"
                    checked={formData.preferred_specializations.includes(spec.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          preferred_specializations: [...prev.preferred_specializations, spec.id]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          preferred_specializations: prev.preferred_specializations.filter(id => id !== spec.id)
                        }));
                      }
                    }}
                    className="mt-1 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{spec.name}</div>
                    <div className="text-xs text-gray-500">{spec.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Preferences</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SeekerDashboard() {
  const { data: user, loading } = useUser();
  const [activeSession, setActiveSession] = useState(null);
  const [preferences, setPreferences] = useState({});
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch active sessions
      const sessionsResponse = await fetch('/api/chat-sessions?status=active');
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        if (sessionsData.sessions && sessionsData.sessions.length > 0) {
          setActiveSession(sessionsData.sessions[0]);
        } else {
          setActiveSession(null);
        }
      }

      // Fetch user preferences
      const prefsResponse = await fetch('/api/seeker-preferences');
      if (prefsResponse.ok) {
        const prefsData = await prefsResponse.json();
        setPreferences(prefsData.current_preferences || {});
        setSelectedSpecializations(prefsData.current_preferences?.preferred_specializations || []);
      }

      // Fetch location
      const locationResponse = await fetch('/api/location/detect');
      if (locationResponse.ok) {
        const locationData = await locationResponse.json();
        setSelectedLocation(locationData.detected_location);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleSpecializationToggle = (specializationId) => {
    setSelectedSpecializations(prev => 
      prev.includes(specializationId)
        ? prev.filter(id => id !== specializationId)
        : [...prev, specializationId]
    );
  };

  const handleStartMatching = async () => {
    try {
      const response = await fetch('/api/volunteers/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seeker_country_code: selectedLocation?.country_code || 'US',
          preferred_volunteer_countries: selectedLocation?.country_code !== 'GLOBAL' ? [selectedLocation?.country_code] : [],
          language_preferences: preferences.preferred_languages || ['en'],
          volunteer_radius_km: selectedLocation?.country_code === 'GLOBAL' ? 0 : 1000,
          preferred_specializations: selectedSpecializations
        })
      });

      const data = await response.json();
      
      if (data.session_id) {
        window.location.href = `/chat/${data.session_id}`;
      } else {
        alert(data.message || 'No volunteers available right now. Please try again in a few moments.');
      }
    } catch (error) {
      console.error('Matching failed:', error);
      alert('Failed to connect. Please try again.');
    }
  };

  const handleVoiceCall = (sessionId) => {
    // This would integrate with a voice calling service like Twilio or WebRTC
    alert(`Voice calling feature coming soon for session ${sessionId}`);
  };

  const handleSavePreferences = async (newPreferences) => {
    try {
      const response = await fetch('/api/seeker-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPreferences)
      });

      if (response.ok) {
        setPreferences(newPreferences);
        setSelectedSpecializations(newPreferences.preferred_specializations || []);
        await fetchDashboardData();
      } else {
        alert('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access your dashboard.
          </p>
          <a
            href="/account/signin"
            className="w-full inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name || 'User'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Session or Quick Match */}
            {activeSession ? (
              <ActiveSessionCard 
                session={activeSession} 
                onCall={handleVoiceCall}
              />
            ) : (
              <QuickMatchCard
                onStartMatching={handleStartMatching}
                selectedSpecializations={selectedSpecializations}
                selectedLocation={selectedLocation}
              />
            )}

            {/* Specialization Selector */}
            <SpecializationSelector
              onSelect={handleSpecializationToggle}
              selectedSpecializations={selectedSpecializations}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="/crisis-resources"
                  className="w-full flex items-center justify-between p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <span className="font-medium">Crisis Resources</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/training"
                  className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span className="font-medium">View Training</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/donate"
                  className="w-full flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <span className="font-medium">Support Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Sessions</h3>
              <div className="text-sm text-gray-500">
                No recent sessions yet. Start your first conversation!
              </div>
            </div>

            {/* Your Progress */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sessions</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hours Supported</span>
                  <span className="font-medium">0.0h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Favorite Categories</span>
                  <span className="font-medium">
                    {selectedSpecializations.length > 0 ? selectedSpecializations.length : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        preferences={preferences}
        onSave={handleSavePreferences}
      />
    </div>
  );
}