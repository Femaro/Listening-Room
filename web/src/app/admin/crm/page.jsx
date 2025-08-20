"use client";

import { useState, useEffect } from "react";
import {
  Users,
  MessageCircle,
  AlertTriangle,
  TrendingUp,
  Eye,
  Shield,
  Mail,
  Calendar,
  Globe,
  BarChart3,
  Settings,
  Download,
  Filter,
  Search,
  ArrowLeft,
  RefreshCw,
  Flag,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import useUser from "@/utils/useUser";

// Check if user is admin
const useAdminAuth = () => {
  const { data: user, loading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!loading && user) {
        try {
          const response = await fetch('/api/admin/auth-check');
          const data = await response.json();
          setIsAdmin(data.isAdmin || false);
        } catch (error) {
          console.error('Admin auth check failed:', error);
          setIsAdmin(false);
        }
      } else if (!loading && !user) {
        setIsAdmin(false);
      }
      setAdminLoading(false);
    };

    checkAdminStatus();
  }, [user, loading]);

  return { user, isAdmin, loading: loading || adminLoading };
};

function StatsCard({ title, value, change, icon: Icon, color = "teal" }) {
  const colorClasses = {
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    red: "bg-red-50 text-red-700 border-red-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200"
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change} from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function ReportsTable({ reports, onStatusChange }) {
  const getStatusBadge = (status) => {
    const badges = {
      'pending': { class: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'reviewing': { class: 'bg-blue-100 text-blue-800', icon: Eye },
      'resolved': { class: 'bg-green-100 text-green-800', icon: CheckCircle },
      'dismissed': { class: 'bg-gray-100 text-gray-800', icon: XCircle },
      'escalated': { class: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };
    
    const badge = badges[status] || badges['pending'];
    const IconComponent = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.class}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'critical': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[severity] || colors['low']}`}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Reports & Feedback</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Report
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {report.title || `Report #${report.id}`}
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {report.description || report.content}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{report.type}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getSeverityBadge(report.severity)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(report.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(report.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={report.status}
                    onChange={(e) => onStatusChange(report.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                    <option value="escalated">Escalated</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsChart({ data, title }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64 flex items-end justify-between space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div
              className="bg-teal-500 rounded-t"
              style={{ 
                height: `${(item.value / Math.max(...data.map(d => d.value))) * 200}px`,
                width: '20px'
              }}
            ></div>
            <span className="text-xs text-gray-500 transform -rotate-45 origin-center">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminCRM() {
  const { user, isAdmin, loading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      // Fetch all admin data
      const [statsRes, reportsRes, notificationsRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/reports'),
        fetch('/api/admin/notifications'),
        fetch('/api/admin/analytics')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        setReports(reportsData.reports || []);
      }

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        setNotifications(notificationsData.notifications || []);
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
    setRefreshing(false);
  };

  const handleReportStatusChange = async (reportId, newStatus) => {
    try {
      const response = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status: newStatus })
      });

      if (response.ok) {
        setReports(prev => prev.map(report => 
          report.id === reportId ? { ...report, status: newStatus } : report
        ));
      } else {
        alert('Failed to update report status');
      }
    } catch (error) {
      console.error('Failed to update report status:', error);
      alert('Failed to update report status');
    }
  };

  const exportData = async (type) => {
    try {
      const response = await fetch(`/api/admin/export?type=${type}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `claeva-${type}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            This area is restricted to CLAEVA INTERNATIONAL LLC administrators only.
          </p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <img
                src="https://ucarecdn.com/e602d80d-2f3e-4bce-b13a-78b9e1ed90fa/-/format/auto/"
                alt="CLAEVA INTERNATIONAL LLC Logo"
                className="h-10 object-contain"
                style={{
                  filter: "brightness(0) saturate(100%) invert(58%) sepia(45%) saturate(1678%) hue-rotate(152deg) brightness(91%) contrast(95%)",
                }}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CLAEVA INTERNATIONAL LLC</h1>
                <p className="text-sm text-gray-600">Admin CRM Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchDashboardData}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <a
                href="/"
                className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </a>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'reports', name: 'Reports & Feedback', icon: Flag },
              { id: 'users', name: 'User Management', icon: Users },
              { id: 'analytics', name: 'Analytics', icon: TrendingUp },
              { id: 'notifications', name: 'Notifications', icon: Mail }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Users"
                value={stats.total_users?.toLocaleString() || '0'}
                change={stats.user_growth || '+0%'}
                icon={Users}
                color="blue"
              />
              <StatsCard
                title="Active Sessions"
                value={stats.active_sessions?.toLocaleString() || '0'}
                change={stats.session_growth || '+0%'}
                icon={MessageCircle}
                color="green"
              />
              <StatsCard
                title="Pending Reports"
                value={stats.pending_reports?.toLocaleString() || '0'}
                change={stats.report_change || '+0%'}
                icon={AlertTriangle}
                color="orange"
              />
              <StatsCard
                title="Platform Health"
                value={stats.platform_health || '98%'}
                change={stats.health_change || '+0.1%'}
                icon={Shield}
                color="teal"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AnalyticsChart
                title="Daily Active Users"
                data={analytics.daily_users || []}
              />
              <AnalyticsChart
                title="Session Types"
                data={analytics.session_types || []}
              />
            </div>

            {/* Recent Activity */}
            <ReportsTable 
              reports={reports.slice(0, 5)} 
              onStatusChange={handleReportStatusChange}
            />
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Reports & Feedback Management</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => exportData('reports')}
                  className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Reports</span>
                </button>
              </div>
            </div>
            <ReportsTable 
              reports={reports} 
              onStatusChange={handleReportStatusChange}
            />
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">User management features coming soon...</p>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Platform Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AnalyticsChart
                title="User Registration Trends"
                data={analytics.registration_trends || []}
              />
              <AnalyticsChart
                title="Geographic Distribution"
                data={analytics.geographic_data || []}
              />
              <AnalyticsChart
                title="Language Usage"
                data={analytics.language_usage || []}
              />
              <AnalyticsChart
                title="Support Categories"
                data={analytics.support_categories || []}
              />
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">System Notifications</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div key={notification.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {notification.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        notification.status === 'sent' ? 'bg-green-100 text-green-800' : 
                        notification.status === 'failed' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {notification.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}