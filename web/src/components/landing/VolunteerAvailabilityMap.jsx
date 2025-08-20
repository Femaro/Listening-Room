"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";

export default function VolunteerAvailabilityMap({ selectedLocation }) {
  const [volunteerStats, setVolunteerStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteerStats = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedLocation?.country_code) {
          params.append("country_code", selectedLocation.country_code);
        }

        const response = await fetch(`/api/volunteers/match?${params}`);
        const data = await response.json();
        setVolunteerStats(data);
      } catch (error) {
        console.error("Failed to fetch volunteer stats:", error);
      }
      setLoading(false);
    };

    fetchVolunteerStats();
  }, [selectedLocation]);

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalAvailable = volunteerStats.total_available_now || 0;
  const totalGlobal = volunteerStats.total_global_volunteers || 0;

  return (
    <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg p-6 border border-teal-100">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="w-5 h-5 text-teal-600" />
        <h3 className="font-semibold text-gray-900">
          Live Volunteer Availability
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-teal-600">
            {totalAvailable}
          </div>
          <div className="text-sm text-gray-600">Available Now</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">
            {totalGlobal}
          </div>
          <div className="text-sm text-gray-600">Total Volunteers</div>
        </div>
      </div>

      {volunteerStats.recommended_countries &&
        volunteerStats.recommended_countries.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Top Available Regions
            </h4>
            <div className="space-y-2">
              {volunteerStats.recommended_countries
                .slice(0, 5)
                .map((country) => (
                  <div
                    key={country.country_code}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span>{country.flag_emoji}</span>
                      <span className="text-sm text-gray-700">
                        {country.country_name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600">
                        {country.available_volunteers}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
    </div>
  );
}
