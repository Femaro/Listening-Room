import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Globe,
  Clock,
  Shield,
  Bell,
  ArrowLeft,
  Save,
  Camera,
  Eye,
  EyeOff,
} from "lucide-react";
import useUser from "@/utils/useUser";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    preferred_language: "en",
    user_type: "seeker",
    general_topic: "",
    country_code: "",
    timezone: "",
    preferred_currency: "USD",
  });
  const [privacy, setPrivacy] = useState({
    anonymous_sessions: false,
    hide_profile: false,
    location_sharing: true,
  });
  const [communication, setCommunication] = useState({
    email_notifications: true,
    session_reminders: true,
    newsletter: false,
    crisis_alerts: true,
  });
  const [sessionLimits, setSessionLimits] = useState({
    max_session_duration: 60,
    daily_session_limit: 3,
    auto_end_sessions: true,
  });
  const [activeTab, setActiveTab] = useState("account");
  const [loading_, setLoading_] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
  ];

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "NGN", name: "Nigerian Naira" },
    { code: "KES", name: "Kenyan Shilling" },
  ];

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/account/signin";
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, loading]);

  const fetchProfile = async () => {
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

      setProfile(data.profile);
      setFormData({
        username: data.profile.username || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        preferred_language: data.profile.preferred_language || "en",
        user_type: data.profile.user_type || "seeker",
        general_topic: data.profile.general_topic || "",
        country_code: data.profile.country_code || "",
        timezone: data.profile.timezone || "",
        preferred_currency: data.profile.preferred_currency || "USD",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile settings");
    } finally {
      setLoading_(false);
    }
  };

  const handleSaveAccount = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Update profile
      const profileResponse = await fetch("/api/profiles", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          preferred_language: formData.preferred_language,
          general_topic: formData.general_topic,
          country_code: formData.country_code,
          timezone: formData.timezone,
          preferred_currency: formData.preferred_currency,
        }),
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      // Update password if provided
      if (formData.newPassword && formData.currentPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("New passwords do not match");
        }

        const passwordResponse = await fetch("/api/user/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        });

        if (!passwordResponse.ok) {
          const errorData = await passwordResponse.json();
          throw new Error(errorData.error || "Failed to update password");
        }

        // Clear password fields
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }

      setSuccess("Account settings updated successfully");
      await fetchProfile(); // Refresh profile data
    } catch (err) {
      console.error("Error saving settings:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/user/privacy-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(privacy),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update privacy settings");
      }

      setSuccess("Privacy settings updated successfully");
    } catch (err) {
      console.error("Error saving privacy settings:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCommunication = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/user/communication-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(communication),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to update communication settings"
        );
      }

      setSuccess("Communication settings updated successfully");
    } catch (err) {
      console.error("Error saving communication settings:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSessionLimits = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/user/session-limits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionLimits),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update session limits");
      }

      setSuccess("Session limits updated successfully");
    } catch (err) {
      console.error("Error saving session limits:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "communication", label: "Communication", icon: Bell },
    { id: "sessions", label: "Sessions", icon: Clock },
  ];

  if (loading || loading_) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 animate-pulse">
            <User className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://ucarecdn.com/dc54868d-20c4-46fa-b583-6f27b18e95b5/-/format/auto/"
                alt="ListeningRoom Logo"
                className="h-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-600">Manage your account</p>
              </div>
            </div>
            <a
              href="/dashboard"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-700">{success}</p>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === "account" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Account Details
                  </h2>

                  <div className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Profile Photo
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Upload a profile picture
                        </p>
                        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                          <Camera className="w-4 h-4" />
                          <span>Change Photo</span>
                        </button>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) =>
                            setFormData({ ...formData, username: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          value={formData.preferred_language}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              preferred_language: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                              {lang.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency
                        </label>
                        <select
                          value={formData.preferred_currency}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              preferred_currency: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {currencies.map((currency) => (
                            <option key={currency.code} value={currency.code}>
                              {currency.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Password Section */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Change Password
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={formData.currentPassword}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  currentPassword: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div></div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                newPassword: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveAccount}
                      disabled={saving}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {saving ? "Saving..." : "Save Account Settings"}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Privacy Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Anonymous Sessions
                        </h3>
                        <p className="text-sm text-gray-600">
                          Hide your username during listening sessions
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy.anonymous_sessions}
                        onChange={(e) =>
                          setPrivacy({
                            ...privacy,
                            anonymous_sessions: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Hide Profile
                        </h3>
                        <p className="text-sm text-gray-600">
                          Make your profile private and not searchable
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy.hide_profile}
                        onChange={(e) =>
                          setPrivacy({
                            ...privacy,
                            hide_profile: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Location Sharing
                        </h3>
                        <p className="text-sm text-gray-600">
                          Allow location-based volunteer matching
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy.location_sharing}
                        onChange={(e) =>
                          setPrivacy({
                            ...privacy,
                            location_sharing: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <button
                      onClick={handleSavePrivacy}
                      disabled={saving}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {saving ? "Saving..." : "Save Privacy Settings"}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Communication Tab */}
              {activeTab === "communication" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Communication Preferences
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Email Notifications
                        </h3>
                        <p className="text-sm text-gray-600">
                          Receive important updates via email
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={communication.email_notifications}
                        onChange={(e) =>
                          setCommunication({
                            ...communication,
                            email_notifications: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Session Reminders
                        </h3>
                        <p className="text-sm text-gray-600">
                          Get notified about upcoming sessions
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={communication.session_reminders}
                        onChange={(e) =>
                          setCommunication({
                            ...communication,
                            session_reminders: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Newsletter
                        </h3>
                        <p className="text-sm text-gray-600">
                          Receive our monthly newsletter with tips and updates
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={communication.newsletter}
                        onChange={(e) =>
                          setCommunication({
                            ...communication,
                            newsletter: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Crisis Alerts
                        </h3>
                        <p className="text-sm text-gray-600">
                          Urgent notifications for crisis support (recommended)
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={communication.crisis_alerts}
                        onChange={(e) =>
                          setCommunication({
                            ...communication,
                            crisis_alerts: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <button
                      onClick={handleSaveCommunication}
                      disabled={saving}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {saving ? "Saving..." : "Save Communication Settings"}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Sessions Tab */}
              {activeTab === "sessions" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Session Limits
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Session Duration (minutes)
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="180"
                        value={sessionLimits.max_session_duration}
                        onChange={(e) =>
                          setSessionLimits({
                            ...sessionLimits,
                            max_session_duration: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        Set between 15-180 minutes
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Daily Session Limit
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={sessionLimits.daily_session_limit}
                        onChange={(e) =>
                          setSessionLimits({
                            ...sessionLimits,
                            daily_session_limit: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        Maximum sessions per day
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Auto-end Sessions
                        </h3>
                        <p className="text-sm text-gray-600">
                          Automatically end sessions when time limit is reached
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={sessionLimits.auto_end_sessions}
                        onChange={(e) =>
                          setSessionLimits({
                            ...sessionLimits,
                            auto_end_sessions: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <button
                      onClick={handleSaveSessionLimits}
                      disabled={saving}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {saving ? "Saving..." : "Save Session Settings"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;