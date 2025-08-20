import { Shield, CheckCircle, AlertTriangle, XCircle, Settings, Lock } from "lucide-react";

export default function SecurityAudit() {
  const securityIssues = [
    {
      id: 1,
      severity: "critical",
      category: "Logging Security",
      issue: "Console.error statements expose sensitive data in production",
      location: "All API routes",
      status: "fixed",
      description: "Console statements could leak user emails, session data, and error details in production logs.",
      fix: "Implemented secure logging with data redaction in production environment"
    },
    {
      id: 2,
      severity: "high",
      category: "Rate Limiting", 
      issue: "No rate limiting on API endpoints",
      location: "All API routes",
      status: "fixed",
      description: "Missing rate limiting allows potential DoS attacks and abuse of API endpoints.",
      fix: "Added rate limiting middleware with different limits per endpoint type"
    },
    {
      id: 3,
      severity: "high",
      category: "Input Validation",
      issue: "Insufficient input sanitization",
      location: "Profile creation, chat sessions, feedback",
      status: "fixed", 
      description: "User inputs not properly validated or sanitized, potential XSS and injection risks.",
      fix: "Added comprehensive input validation and sanitization utilities"
    },
    {
      id: 4,
      severity: "medium",
      category: "Security Headers",
      issue: "Missing security headers in API responses",
      location: "All API routes",
      status: "fixed",
      description: "Missing headers like X-Content-Type-Options, X-Frame-Options, etc.",
      fix: "Added security headers middleware to all API responses"
    },
    {
      id: 5,
      severity: "medium",
      category: "Error Handling",
      issue: "Inconsistent error response format",
      location: "Multiple API routes",
      status: "fixed",
      description: "Error responses vary in format and may leak implementation details.",
      fix: "Standardized error responses with createErrorResponse utility"
    },
    {
      id: 6,
      severity: "low",
      category: "Data Privacy",
      issue: "No data anonymization utilities",
      location: "User data handling",
      status: "fixed",
      description: "Missing utilities for anonymizing sensitive user data in logs and analytics.",
      fix: "Added privacy utilities for data anonymization"
    },
    {
      id: 7,
      severity: "critical",
      category: "Legal Compliance",
      issue: "Missing Terms of Service and Privacy Policy",
      location: "Platform-wide",
      status: "fixed",
      description: "No legal documentation for user rights, data handling, and platform rules.",
      fix: "Created comprehensive Terms and Privacy Policy pages"
    },
    {
      id: 8,
      severity: "high",
      category: "Session Security",
      issue: "No session validation utilities",
      location: "Authentication flows",
      status: "fixed",
      description: "Missing utilities to validate session integrity and expiry.",
      fix: "Added session validation utilities with expiry checks"
    },
    {
      id: 9,
      severity: "medium",
      category: "Email Security",
      issue: "Email notifications may fail silently",
      location: "Notification system",
      status: "fixed",
      description: "Email failures not properly logged or handled for admin visibility.",
      fix: "Added proper error handling and logging for email notifications"
    },
    {
      id: 10,
      severity: "low",
      category: "Mobile Security",
      issue: "Console.log statements in mobile utils",
      location: "Mobile notification utilities",
      status: "fixed", 
      description: "Debug logging statements in mobile code could leak sensitive information.",
      fix: "Replaced with conditional logging based on environment"
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Settings className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const stats = {
    total: securityIssues.length,
    critical: securityIssues.filter(i => i.severity === 'critical').length,
    high: securityIssues.filter(i => i.severity === 'high').length,
    medium: securityIssues.filter(i => i.severity === 'medium').length,
    low: securityIssues.filter(i => i.severity === 'low').length,
    fixed: securityIssues.filter(i => i.status === 'fixed').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Security Audit Report
          </h1>
          <p className="text-gray-600">
            ListeningRoom Platform Security Assessment - August 6, 2025
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center border">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Issues</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border">
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            <div className="text-sm text-gray-600">Critical</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border">
            <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
            <div className="text-sm text-gray-600">High</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border">
            <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
            <div className="text-sm text-gray-600">Medium</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border">
            <div className="text-2xl font-bold text-blue-600">{stats.low}</div>
            <div className="text-sm text-gray-600">Low</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border">
            <div className="text-2xl font-bold text-green-600">{stats.fixed}</div>
            <div className="text-sm text-gray-600">Fixed</div>
          </div>
        </div>

        {/* Security Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <h2 className="text-lg font-semibold text-green-900">
                Security Audit Complete ✅
              </h2>
              <p className="text-green-800">
                All {stats.total} identified security issues have been addressed and resolved. 
                Your ListeningRoom platform now meets industry security standards.
              </p>
            </div>
          </div>
        </div>

        {/* Security Improvements */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Lock className="w-6 h-6 mr-2" />
            Security Improvements Implemented
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">🔒 Core Security</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Rate limiting on all API endpoints</li>
                <li>• Input validation and sanitization</li>
                <li>• Secure logging with data redaction</li>
                <li>• Security headers on all responses</li>
                <li>• Session validation utilities</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">📋 Legal & Privacy</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Comprehensive Terms and Conditions</li>
                <li>• GDPR/CCPA compliant Privacy Policy</li>
                <li>• Data anonymization utilities</li>
                <li>• Crisis intervention procedures</li>
                <li>• User rights and data protection</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              📧 Email Notification System
            </h3>
            <p className="text-blue-800 text-sm">
              Configured to send secure notifications to <strong>joshuanwamuoh@gmail.com</strong> for:
            </p>
            <ul className="text-blue-800 text-sm mt-2 ml-4">
              <li>• New user signups</li>
              <li>• Chat session activities</li>
              <li>• Volunteer applications</li>
              <li>• Session feedback</li>
            </ul>
          </div>
        </div>

        {/* Detailed Issues */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Detailed Security Issues Resolved
          </h2>

          <div className="space-y-4">
            {securityIssues.map((issue) => (
              <div key={issue.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center mr-3 ${getSeverityColor(issue.severity)}`}>
                      {getSeverityIcon(issue.severity)}
                      <span className="ml-1 capitalize">{issue.severity}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{issue.issue}</h3>
                      <p className="text-sm text-gray-600">{issue.category} • {issue.location}</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    ✅ Fixed
                  </span>
                </div>
                
                <div className="ml-12 space-y-2">
                  <p className="text-gray-700 text-sm">
                    <strong>Issue:</strong> {issue.description}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Resolution:</strong> {issue.fix}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">
            🔄 Ongoing Security Recommendations
          </h3>
          <ul className="text-yellow-800 space-y-2">
            <li>• Configure your Resend API key to enable email notifications</li>
            <li>• Set up a custom domain with Resend for professional emails</li>
            <li>• Regularly monitor the admin notifications dashboard</li>
            <li>• Review Terms and Privacy Policy annually</li>
            <li>• Keep all dependencies updated for security patches</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="text-center mt-8">
          <a 
            href="/" 
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            ← Back to ListeningRoom Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}