"use client";

import { useState, useEffect } from "react";

export default function useAdminAuth(user, userLoading) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (user && !userLoading) {
      checkAdminAccess();
    } else if (!user && !userLoading) {
      setIsChecking(false);
    }
  }, [user, userLoading]);

  const checkAdminAccess = async () => {
    setIsChecking(true);
    try {
      const response = await fetch("/api/admin/auth-check");
      setIsAdmin(response.ok);
    } catch (error) {
      console.error("Admin access check failed:", error);
      setIsAdmin(false);
    } finally {
      setIsChecking(false);
    }
  };

  return { isAdmin, isChecking };
}
