"use client";

import { useState, useEffect } from "react";
import { Wifi } from "lucide-react";

export default function USAccessibilityBanner() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Detect user location for US friends
    const detectLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        setLocation(data);
      } catch (error) {
        console.log("Location detection optional - proceeding anyway");
      }
      setLoading(false);
    };

    detectLocation();
  }, []);

  if (loading) return null;

  return (
    <div className="bg-blue-600 text-white px-4 py-2 sm:py-3 text-center">
      <div className="flex items-center justify-center space-x-2">
        <Wifi className="w-4 h-4" />
        <span className="text-sm sm:text-base">
          ✅ Accessible worldwide • US friends welcome • Global volunteer
          network
        </span>
      </div>
    </div>
  );
}
