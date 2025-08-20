{
  /*

"use client";

import { useState } from "react";
import { Calendar, Clock, Users, FileText, Save, ArrowLeft } from "lucide-react";
import useUser from "@/utils/useUser";

export default function CreateSessionPage() {
  const { data: user, loading: userLoading } = useUser();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    session_date: "",
    start_time: "",
    duration_minutes: 60,
    max_participants: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration_minutes' || name === 'max_participants' ? parseInt(value) : value
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (!formData.title || !formData.session_date || !formData.start_time) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Validate future date
    const sessionDateTime = new Date(`${formData.session_date}T${formData.start_time}`);
    if (sessionDateTime <= new Date()) {
      setError("Session must be scheduled for a future date and time");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/scheduled-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create session");
      }

      const data = await response.json();
      setSuccess(`Session created successfully! Session code: ${data.session.session_code}`);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        session_date: "",
        start_time: "",
        duration_minutes: 60,
        max_participants: 1,
      });

      // Redirect to volunteer dashboard after a delay
      setTimeout(() => {
        window.location.href = "/volunteer/dashboard";
      }, 3000);

    } catch (err) {
      console.error("Error creating session:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          <p className="text-gray-600 mb-4">Please sign in to access this page</p>
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

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */
}
{
  /* <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://ucarecdn.com/dc54868d-20c4-46fa-b583-6f27b18e95b5/-/format/auto/"
                alt="ListeningRoom"
                className="h-10 object-contain"
              />
              <h1 className="text-xl font-semibold text-gray-900">Create Session</h1>
            </div>
            <a
              href="/volunteer/dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Schedule a New Listening Session
            </h2>
            <p className="text-gray-600">
              Create a scheduled session where users can book time to talk with you.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

*/
}

{
  /* Session Title */
}

{
  /*
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Title *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Mental Health Support, Career Guidance"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

*/
}

{
  /* Description */
}

{
  /*
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe what this session will cover..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
              />
            </div>

*/
}

{
  /* Date and Time */
}

{
  /*
           
           <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="session_date"
                    value={formData.session_date}
                    onChange={handleChange}
                    min={getTomorrowDate()}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>
            </div>


            

            {/* Duration and Participants */
}

{
  /*
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <select
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Participants
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    name="max_participants"
                    value={formData.max_participants}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  >
                    <option value={1}>1-on-1 Session</option>
                    <option value={2}>2 participants</option>
                    <option value={3}>3 participants</option>
                    <option value={5}>Small group (5)</option>
                    <option value={10}>Large group (10)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */
}

{
  /*
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Create Session</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


*/
}

// ==========================
// app/volunteer/sessions/create/page.jsx
// ==========================
("use client");

import { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Save,
  ArrowLeft,
} from "lucide-react";
import useUser from "@/utils/useUser";

export default function CreateSessionPage() {
  const { data: user, loading: userLoading } = useUser();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    session_date: "",
    start_time: "",
    duration_minutes: 60,
    max_participants: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const toInt = (v, fallback = 0) => {
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? fallback : n;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "duration_minutes" || name === "max_participants"
          ? toInt(value, prev[name])
          : value,
    }));
    setError(null);
  };

  const buildLocalDate = (dateStr, timeStr) => {
    const [y, m, d] = (dateStr || "").split("-").map((s) => parseInt(s, 10));
    const [hh, mm] = (timeStr || "").split(":").map((s) => parseInt(s, 10));
    if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return null;
    return new Date(y, m - 1, d, hh, mm, 0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (!formData.title || !formData.session_date || !formData.start_time) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Validate future date (local & timezone-safe)
    const sessionDateTime = buildLocalDate(
      formData.session_date,
      formData.start_time
    );
    if (!sessionDateTime || sessionDateTime <= new Date()) {
      setError("Session must be scheduled for a future date and time");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/scheduled-sessions", {
        method: "POST",
        credentials: "include", // needed if using cookie auth
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          duration_minutes: toInt(formData.duration_minutes, 60),
          max_participants: toInt(formData.max_participants, 1),
        }),
      });

      if (!response.ok) {
        let errorMessage = `Failed to create session (HTTP ${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData?.error) errorMessage = errorData.error;
        } catch (_) {}
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSuccess(
        `Session created successfully! Session code: ${
          data?.session?.session_code ?? "—"
        }`
      );

      // Reset form
      setFormData({
        title: "",
        description: "",
        session_date: "",
        start_time: "",
        duration_minutes: 60,
        max_participants: 1,
      });

      // Redirect to dashboard Sessions tab and trigger fresh fetch
      window.location.href = "/volunteer/dashboard?created=1";
    } catch (err) {
      console.error("Error creating session:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          <p className="text-gray-600 mb-4">
            Please sign in to access this page
          </p>
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

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

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
              <h1 className="text-xl font-semibold text-gray-900">
                Create Session
              </h1>
            </div>
            <a
              href="/volunteer/dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Schedule a New Listening Session
            </h2>
            <p className="text-gray-600">
              Create a scheduled session where users can book time to talk with
              you.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Session Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Title *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Mental Health Support, Career Guidance"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe what this session will cover..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            {/* Date and Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="session_date"
                    value={formData.session_date}
                    onChange={handleChange}
                    min={getTomorrowDate()}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Duration and Participants */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <select
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Participants
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    name="max_participants"
                    value={formData.max_participants}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  >
                    <option value={1}>1-on-1 Session</option>
                    <option value={2}>2 participants</option>
                    <option value={3}>3 participants</option>
                    <option value={5}>Small group (5)</option>
                    <option value={10}>Large group (10)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Create Session</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==========================
// Suggested API contracts (Next.js app router)
// ==========================
// File: app/api/scheduled-sessions/route.js
// export async function GET(req) { return Response.json({ sessions: [...] }); }
// export async function POST(req) { return Response.json({ session: {...} }, { status: 201 }); }
// File: app/api/scheduled-sessions/[id]/route.js
// export async function DELETE(req, { params }) { return Response.json({ success: true }); }