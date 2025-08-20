"use client";

import { useState, useEffect, useCallback } from "react";
import useUser from "@/utils/useUser";

export function useVolunteerDashboard() {
    const { data: user, loading: userLoading } = useUser();
    const [activeSession, setActiveSession] = useState(null);
    const [stats, setStats] = useState({});
    const [availability, setAvailability] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch active sessions
            const sessionsResponse = await fetch("/api/chat-sessions?status=active");
            if (sessionsResponse.ok) {
                const sessionsData = await sessionsResponse.json();
                if (sessionsData.sessions && sessionsData.sessions.length > 0) {
                    setActiveSession(sessionsData.sessions[0]);
                } else {
                    setActiveSession(null);
                }
            }

            // Fetch volunteer stats
            const statsResponse = await fetch("/api/volunteers/stats");
            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                setStats(statsData.stats || {});
            }

            // Fetch availability
            const availabilityResponse = await fetch("/api/volunteers/availability");
            if (availabilityResponse.ok) {
                const availabilityData = await availabilityResponse.json();
                setAvailability(availabilityData.availability);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!userLoading && user) {
            fetchDashboardData();
        } else if (!userLoading && !user) {
            setLoading(false);
        }
    }, [user, userLoading, fetchDashboardData]);
    
    useEffect(() => {
        if (!user) return;

        // Set up heartbeat
        const heartbeat = setInterval(async () => {
            try {
                await fetch("/api/volunteers/availability", { method: "PATCH" });
            } catch (error) {
                console.error("Heartbeat failed:", error);
            }
        }, 30000); // 30 seconds

        return () => clearInterval(heartbeat);
    }, [user]);

    const handleTimeUpdate = useCallback((timeData) => {
        // Update any real-time displays
        console.log("Time update:", timeData);
    }, []);

    const handleAutoTerminate = useCallback(() => {
        // Handle auto-termination logic
        console.log("Session auto-terminated");
    }, []);

    return {
        user,
        loading: userLoading || loading,
        activeSession,
        stats,
        availability,
        fetchDashboardData,
        handleTimeUpdate,
        handleAutoTerminate,
    };
}
