"use client";

import { useState, useEffect } from "react";
import { Globe, ChevronDown, CheckCircle } from "lucide-react";

export default function GlobalLocationSelector({
  onLocationSelect,
  selectedLocation,
  currencyInfo,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/location/detect");
        const data = await response.json();
        setLocations(data.supported_locations || {});

        // Auto-select detected location if not already selected
        if (!selectedLocation && data.detected_location) {
          onLocationSelect(data.detected_location);
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
      setLoading(false);
    };

    fetchLocations();
  }, [selectedLocation, onLocationSelect]);

  const filteredLocations = Object.entries(locations).reduce(
    (acc, [region, countries]) => {
      const filtered = countries.filter(
        (country) =>
          country.country_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          country.country_code.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      if (filtered.length > 0) {
        acc[region] = filtered;
      }
      return acc;
    },
    {},
  );

  if (loading) {
    return (
      <div className="relative">
        <div className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 animate-pulse">
          <div className="h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-teal-600" />
          <span className="text-sm font-medium">
            {selectedLocation ? (
              <span className="flex items-center space-x-2">
                <span>{selectedLocation.flag_emoji || "🌍"}</span>
                <span>{selectedLocation.country_name || "Global"}</span>
              </span>
            ) : (
              "Select your location"
            )}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="max-h-80 overflow-y-auto">
            {Object.entries(filteredLocations).map(([region, countries]) => (
              <div
                key={region}
                className="border-b border-gray-100 last:border-b-0"
              >
                <div className="p-2 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  {region}
                </div>
                {countries.map((country) => (
                  <button
                    key={country.country_code}
                    onClick={() => {
                      onLocationSelect(country);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className="w-full p-3 text-left hover:bg-teal-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{country.flag_emoji}</span>
                      <div>
                        <div className="font-medium text-gray-900">
                          {country.country_name}
                        </div>
                      </div>
                    </div>
                    {selectedLocation?.country_code ===
                      country.country_code && (
                      <CheckCircle className="w-4 h-4 text-teal-600" />
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
            <button
              onClick={() => {
                onLocationSelect({
                  country_code: "GLOBAL",
                  country_name: "Global (Any Country)",
                  flag_emoji: "🌍",
                  currency_code: "USD",
                  currency_symbol: "$",
                });
                setIsOpen(false);
              }}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              🌍 Connect with volunteers worldwide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
