import { useState } from "react";
import {
  Code,
  Heart,
  MessageCircle,
  Users,
  BarChart3,
  Settings,
  Key,
  ExternalLink,
  Copy,
  CheckCircle,
} from "lucide-react";

function MainComponent() {
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);

  const copyToClipboard = async (text, endpointName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEndpoint(endpointName);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const endpoints = {
    sessions: [
      {
        method: "POST",
        path: "/api/chat-sessions",
        title: "Create Chat Session",
        description: "Create a new chat session (one-on-one or group)",
        auth: "Required (Seeker only)",
        params: {
          body: {
            language: "string (optional) - Session language, defaults to 'en'",
            session_type:
              "string (optional) - 'one_on_one' or 'group', defaults to 'one_on_one'",
            topic: "string (optional) - Topic for group sessions",
            max_participants:
              "number (optional) - Max participants for group sessions, defaults to 2",
          },
        },
        response: {
          session: {
            id: "number - Session ID",
            status:
              "string - Session status ('waiting', 'active', 'ended', 'cancelled')",
            session_type: "string - Session type",
            topic: "string - Session topic (for group sessions)",
            max_participants: "number - Maximum participants",
            started_at: "string - ISO timestamp",
            language: "string - Session language",
            current_participants: "number - Current participant count",
          },
        },
      },
      {
        method: "GET",
        path: "/api/chat-sessions",
        title: "List Chat Sessions",
        description: "Get chat sessions based on user type and permissions",
        auth: "Required",
        params: {
          query: {
            status:
              "string (optional) - Filter by status ('waiting', 'active', 'ended', 'cancelled')",
            session_type:
              "string (optional) - Filter by type ('one_on_one', 'group')",
          },
        },
        response: {
          sessions:
            "array - Array of session objects with participant counts and metadata",
        },
      },
      {
        method: "POST",
        path: "/api/chat-sessions/{id}/join",
        title: "Join Chat Session",
        description: "Join an existing chat session as a volunteer",
        auth: "Required (Volunteer only)",
        params: {
          path: {
            id: "number - Session ID",
          },
        },
        response: {
          session:
            "object - Updated session object with current participant count",
        },
      },
      {
        method: "POST",
        path: "/api/chat-sessions/{id}/end",
        title: "End Chat Session",
        description: "End an active chat session",
        auth: "Required (Participant only)",
        params: {
          path: {
            id: "number - Session ID",
          },
        },
        response: {
          session: "object - Updated session object with ended_at timestamp",
        },
      },
    ],
    profiles: [
      {
        method: "POST",
        path: "/api/profiles",
        title: "Create User Profile",
        description: "Create user profile during onboarding",
        auth: "Required",
        params: {
          body: {
            username: "string - Unique username (required)",
            user_type: "string - 'seeker', 'volunteer', or 'admin' (required)",
            preferred_language:
              "string - Language preference, defaults to 'en'",
            general_topic: "string - General topic of interest",
          },
        },
        response: {
          profile: "object - Created profile object",
        },
      },
      {
        method: "GET",
        path: "/api/profiles",
        title: "Get User Profile",
        description: "Get current user's profile",
        auth: "Required",
        params: {},
        response: {
          profile: "object - User profile with all fields",
        },
      },
    ],
    applications: [
      {
        method: "POST",
        path: "/api/volunteer-applications",
        title: "Submit Volunteer Application",
        description: "Submit application to become a volunteer",
        auth: "Required",
        params: {
          body: {
            background: "string - Professional/personal background",
            experience: "string - Relevant experience",
            motivation: "string - Motivation for volunteering",
          },
        },
        response: {
          application: "object - Created application object",
        },
      },
      {
        method: "GET",
        path: "/api/volunteer-applications",
        title: "List Volunteer Applications",
        description:
          "Get volunteer applications (admin only) or user's own application",
        auth: "Required",
        params: {
          query: {
            status:
              "string (optional) - Filter by status ('pending', 'approved', 'rejected', 'under_review')",
          },
        },
        response: {
          applications: "array - Array of application objects",
        },
      },
    ],
    feedback: [
      {
        method: "POST",
        path: "/api/feedback",
        title: "Submit Session Feedback",
        description: "Submit feedback for a completed session",
        auth: "Required (Seeker only)",
        params: {
          body: {
            session_id: "number - Session ID (required)",
            rating: "number - Rating 1-5",
            was_helpful: "boolean - Whether session was helpful",
            feedback_text: "string - Additional comments",
          },
        },
        response: {
          feedback: "object - Created feedback object",
        },
      },
    ],
    analytics: [
      {
        method: "GET",
        path: "/api/analytics",
        title: "Get Platform Analytics",
        description: "Get platform analytics and metrics (admin only)",
        auth: "Required (Admin only)",
        params: {
          query: {
            period:
              "string (optional) - Time period in days ('7', '30', '90', '365'), defaults to '30'",
            type: "string (optional) - Analytics type ('overview', 'sessions', 'feedback'), defaults to 'overview'",
          },
        },
        response: {
          overview:
            "object - Overview metrics including session counts, user stats, donations",
          daily_stats: "array - Daily activity data",
          duration_stats: "object - Session duration statistics",
          language_stats: "array - Language preference distribution",
          user_type_stats: "array - User type distribution",
        },
      },
      {
        method: "POST",
        path: "/api/analytics",
        title: "Update Daily Analytics",
        description: "Update analytics for a specific date (system use)",
        auth: "Not required (internal)",
        params: {
          body: {
            date: "string (optional) - Date in YYYY-MM-DD format, defaults to today",
          },
        },
        response: {
          success: "boolean - Operation success",
          date: "string - Processed date",
        },
      },
    ],
  };

  const examples = {
    createSession: `curl -X POST ${typeof window !== "undefined" ? window.location.origin : "https://your-app.com"}/api/chat-sessions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{
    "session_type": "group",
    "topic": "Anxiety and Stress Management",
    "max_participants": 4,
    "language": "en"
  }'`,

    listSessions: `curl -X GET "${typeof window !== "undefined" ? window.location.origin : "https://your-app.com"}/api/chat-sessions?status=waiting&session_type=group" \\
  -H "Authorization: Bearer YOUR_TOKEN"`,

    getAnalytics: `curl -X GET "${typeof window !== "undefined" ? window.location.origin : "https://your-app.com"}/api/analytics?period=30&type=overview" \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
  };

  const CodeBlock = ({ children, language = "bash" }) => (
    <div className="relative">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{children}</code>
      </pre>
    </div>
  );

  const EndpointCard = ({ endpoint }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span
            className={`px-2 py-1 text-xs font-bold rounded ${
              endpoint.method === "GET"
                ? "bg-blue-100 text-blue-800"
                : endpoint.method === "POST"
                  ? "bg-green-100 text-green-800"
                  : endpoint.method === "PUT"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
            }`}
          >
            {endpoint.method}
          </span>
          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
            {endpoint.path}
          </code>
        </div>
        <button
          onClick={() =>
            copyToClipboard(
              endpoint.path,
              `${endpoint.method}-${endpoint.path}`,
            )
          }
          className="p-1 text-gray-400 hover:text-gray-600"
          title="Copy endpoint"
        >
          {copiedEndpoint === `${endpoint.method}-${endpoint.path}` ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {endpoint.title}
      </h3>
      <p className="text-gray-600 mb-4">{endpoint.description}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Authentication
          </h4>
          <p className="text-sm text-gray-600">{endpoint.auth}</p>
        </div>
      </div>

      {Object.keys(endpoint.params).length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Parameters</h4>
          {Object.entries(endpoint.params).map(([paramType, params]) => (
            <div key={paramType} className="mb-3">
              <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                {paramType === "body"
                  ? "Request Body"
                  : paramType === "path"
                    ? "Path Parameters"
                    : "Query Parameters"}
              </h5>
              <div className="bg-gray-50 rounded p-3">
                {typeof params === "object" ? (
                  Object.entries(params).map(([key, desc]) => (
                    <div key={key} className="mb-1 last:mb-0">
                      <code className="text-xs bg-white px-1 py-0.5 rounded">
                        {key}
                      </code>
                      <span className="text-xs text-gray-600 ml-2">{desc}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-600">{params}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Response</h4>
        <div className="bg-gray-50 rounded p-3">
          {typeof endpoint.response === "object" ? (
            Object.entries(endpoint.response).map(([key, desc]) => (
              <div key={key} className="mb-1 last:mb-0">
                <code className="text-xs bg-white px-1 py-0.5 rounded">
                  {key}
                </code>
                <span className="text-xs text-gray-600 ml-2">
                  {typeof desc === "object"
                    ? Object.entries(desc).map(([subKey, subDesc]) => (
                        <div key={subKey} className="ml-4 mt-1">
                          <code className="text-xs bg-gray-200 px-1 py-0.5 rounded">
                            {subKey}
                          </code>
                          <span className="text-xs text-gray-500 ml-2">
                            {subDesc}
                          </span>
                        </div>
                      ))
                    : desc}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-600">{endpoint.response}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <img
                src="https://ucarecdn.com/dc54868d-20c4-46fa-b583-6f27b18e95b5/-/format/auto/"
                alt="ListeningRoom Logo"
                className="h-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  ListeningRoom API Documentation
                </h1>
                <p className="text-gray-600">
                  RESTful API for mental health support platform
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start space-x-4 mb-6">
            <Code className="w-8 h-8 text-blue-600 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Getting Started
              </h2>
              <p className="text-gray-600 mb-4">
                The ListeningRoom API provides programmatic access to our mental
                health support platform. Create chat sessions, manage user
                profiles, and access analytics data.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <div className="flex items-center">
                  <Key className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-sm font-medium text-blue-800">
                    Base URL
                  </h3>
                </div>
                <code className="text-sm text-blue-700 mt-1 block">
                  {typeof window !== "undefined"
                    ? window.location.origin
                    : "https://your-app.com"}
                </code>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="flex items-start space-x-3">
              <MessageCircle className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  Session Management
                </h3>
                <p className="text-sm text-gray-600">
                  Create and manage one-on-one or group chat sessions
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">User Profiles</h3>
                <p className="text-sm text-gray-600">
                  Manage seeker and volunteer profiles
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BarChart3 className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">
                  Access platform metrics and insights
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Authentication
          </h2>
          <p className="text-gray-600 mb-4">
            API requests require authentication using session cookies or Bearer
            tokens. Most endpoints require specific user roles (seeker,
            volunteer, or admin).
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <h3 className="text-sm font-medium text-yellow-800">Note</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Authentication tokens are managed automatically when using the web
              interface. For API-only access, contact support for token
              generation.
            </p>
          </div>
        </div>

        {/* Session Endpoints */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Chat Sessions</h2>
          </div>
          {endpoints.sessions.map((endpoint, index) => (
            <EndpointCard key={index} endpoint={endpoint} />
          ))}
        </div>

        {/* Profile Endpoints */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Users className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">User Profiles</h2>
          </div>
          {endpoints.profiles.map((endpoint, index) => (
            <EndpointCard key={index} endpoint={endpoint} />
          ))}
        </div>

        {/* Application Endpoints */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Settings className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Volunteer Applications
            </h2>
          </div>
          {endpoints.applications.map((endpoint, index) => (
            <EndpointCard key={index} endpoint={endpoint} />
          ))}
        </div>

        {/* Feedback Endpoints */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Heart className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Session Feedback
            </h2>
          </div>
          {endpoints.feedback.map((endpoint, index) => (
            <EndpointCard key={index} endpoint={endpoint} />
          ))}
        </div>

        {/* Analytics Endpoints */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
          </div>
          {endpoints.analytics.map((endpoint, index) => (
            <EndpointCard key={index} endpoint={endpoint} />
          ))}
        </div>

        {/* Examples */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Example Requests
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Create a Group Session
              </h3>
              <CodeBlock language="bash">{examples.createSession}</CodeBlock>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                List Waiting Sessions
              </h3>
              <CodeBlock language="bash">{examples.listSessions}</CodeBlock>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Get Analytics Overview
              </h3>
              <CodeBlock language="bash">{examples.getAnalytics}</CodeBlock>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Need help? Contact our support team or visit our{" "}
            <a href="/dashboard" className="text-blue-600 hover:text-blue-700">
              dashboard
            </a>{" "}
            for more information.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
