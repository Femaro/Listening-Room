'use client';

import { useState, useEffect } from 'react';
import useUser from '@/utils/useUser';
import { Mail, Bell, CheckCircle, XCircle, Clock, Settings } from 'lucide-react';

export default function NotificationsPage() {
  const { data: user, loading: userLoading } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && !userLoading) {
      fetchNotifications();
    }
  }, [user, userLoading]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/notifications');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading notifications</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'new_signup':
        return '👤';
      case 'new_session':
        return '💬';
      case 'volunteer_application':
        return '👥';
      case 'session_feedback':
        return '⭐';
      default:
        return '📧';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'new_signup':
        return 'New User Signup';
      case 'new_session':
        return 'New Chat Session';
      case 'volunteer_application':
        return 'Volunteer Application';
      case 'session_feedback':
        return 'Session Feedback';
      default:
        return type.replace('_', ' ').toUpperCase();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-2">Monitor email notifications and delivery status</p>
            </div>
            <button
              onClick={fetchNotifications}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Bell className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Setup Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <Settings className="h-6 w-6 text-blue-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">Email Setup Required</h3>
              <p className="text-blue-700 mb-4">
                To receive email notifications at <strong>joshuanwamuoh@gmail.com</strong>, please:
              </p>
              <ol className="list-decimal list-inside text-blue-700 space-y-2 mb-4">
                <li>Add your Resend API key in project settings</li>
                <li>Verify your domain with Resend for custom email addresses</li>
                <li>Update the notification settings if needed</li>
              </ol>
              <a 
                href="https://www.create.xyz/docs/integrations/resend" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <Mail className="h-4 w-4 mr-1" />
                View Setup Guide →
              </a>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {['sent', 'failed', 'pending'].map((status) => {
            const count = notifications.filter(n => n.status === status).length;
            return (
              <div key={status} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  {getStatusIcon(status)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 capitalize">{status}</p>
                    <p className="text-2xl font-semibold text-gray-900">{count}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{notifications.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Notifications</h3>
            
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Notifications will appear here when users sign up, create sessions, or submit feedback.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {getTypeLabel(notification.type)}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(notification.sent_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(notification.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          notification.status === 'sent' 
                            ? 'bg-green-100 text-green-800' 
                            : notification.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {notification.status}
                        </span>
                      </div>
                    </div>

                    {/* Notification Data */}
                    {notification.data && (
                      <div className="mt-3 pl-11">
                        <div className="text-xs text-gray-600 bg-gray-100 rounded p-2">
                          <pre className="whitespace-pre-wrap">{JSON.stringify(notification.data, null, 2)}</pre>
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {notification.error_message && (
                      <div className="mt-3 pl-11">
                        <div className="text-xs text-red-600 bg-red-50 rounded p-2">
                          <strong>Error:</strong> {notification.error_message}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}