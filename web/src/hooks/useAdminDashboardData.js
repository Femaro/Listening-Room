"use client";

import { useState, useEffect } from "react";

export default function useAdminDashboardData(isAdmin) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    users: [],
    volunteers: [],
    sessions: [],
    applications: [],
    trainings: [],
    feedback: [],
    analytics: {},
    payments: [],
  });

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        usersRes,
        volunteersRes,
        sessionsRes,
        applicationsRes,
        trainingsRes,
        feedbackRes,
        analyticsRes,
        paymentsRes,
      ] = await Promise.all([
        fetch("/api/profiles"),
        fetch("/api/volunteers/stats"),
        fetch("/api/scheduled-sessions"),
        fetch("/api/volunteer-applications"),
        fetch("/api/training/modules"),
        fetch("/api/feedback"),
        fetch("/api/analytics"),
        fetch("/api/payments/process"),
      ]);

      const users = usersRes.ok ? await usersRes.json() : { users: [] };
      const volunteers = volunteersRes.ok ? await volunteersRes.json() : { volunteers: [] };
      const sessions = sessionsRes.ok ? await sessionsRes.json() : { sessions: [] };
      const applications = applicationsRes.ok ? await applicationsRes.json() : { applications: [] };
      const trainings = trainingsRes.ok ? await trainingsRes.json() : { modules: [] };
      const feedback = feedbackRes.ok ? await feedbackRes.json() : { feedback: [] };
      const analytics = analyticsRes.ok ? await analyticsRes.json() : {};
      const payments = paymentsRes.ok ? await paymentsRes.json() : { payments: [] };

      setData({
        users: users.users || [],
        volunteers: volunteers.volunteers || [],
        sessions: sessions.sessions || [],
        applications: applications.applications || [],
        trainings: trainings.modules || [],
        feedback: feedback.feedback || [],
        analytics: analytics || {},
        payments: payments.payments || [],
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading };
}
