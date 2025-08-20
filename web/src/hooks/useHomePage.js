"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";

export default function useHomePage() {
  const { data: user, loading: userLoading } = useUser();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currencyInfo, setCurrencyInfo] = useState(null);
  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    if (user && !userLoading) {
      window.location.href = "/dashboard";
    }
  }, [user, userLoading]);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await fetch("/api/location/detect");
        const data = await response.json();

        if (data.detected_location) {
          const location = data.detected_location;
          setSelectedLocation(location);

          const currency = location.currency_code || "USD";
          const rate = data.currency_rates?.[currency]?.rate || 1;
          const symbol = location.currency_symbol || "$";
          setCurrencyInfo({ currency, rate, currency_symbol: symbol });
        }
      } catch (error) {
        console.error("Location detection failed:", error);
      }
    };

    detectLocation();
  }, []);

  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);

    if (location.currency_code) {
      try {
        const response = await fetch("/api/location/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country_code: location.country_code,
            currency: location.currency_code,
          }),
        });

        const data = await response.json();
        if (data.currency_info) {
          setCurrencyInfo({
            currency: data.currency_info.currency,
            rate: data.currency_info.rate,
            currency_symbol: location.currency_symbol || "$",
          });
        }
      } catch (error) {
        console.error("Currency update failed:", error);
      }
    }
  };

  const handleStartChat = async () => {
    if (!user) {
      window.location.href = "/account/signup";
      return;
    }

    setIsMatching(true);

    try {
      const response = await fetch("/api/volunteers/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seeker_country_code: selectedLocation?.country_code || "US",
          preferred_volunteer_countries:
            selectedLocation?.country_code !== "GLOBAL"
              ? [selectedLocation?.country_code]
              : [],
          language_preferences: ["en"],
          volunteer_radius_km:
            selectedLocation?.country_code === "GLOBAL" ? 0 : 1000,
        }),
      });

      const data = await response.json();

      if (data.session_id) {
        window.location.href = `/chat/${data.session_id}`;
      } else {
        alert(
          data.message ||
            "No volunteers available right now. Please try again in a few moments.",
        );
      }
    } catch (error) {
      console.error("Matching failed:", error);
      alert("Failed to connect. Please try again.");
    }

    setIsMatching(false);
  };
  
  return {
    user,
    userLoading,
    selectedLocation,
    currencyInfo,
    isMatching,
    handleLocationSelect,
    handleStartChat
  };
}
