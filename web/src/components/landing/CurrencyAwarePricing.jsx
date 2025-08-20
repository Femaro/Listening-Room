"use client";

import { DollarSign } from "lucide-react";
import { formatCurrency } from "@/utils/currency";

export default function CurrencyAwarePricing({ selectedLocation, currencyInfo }) {
  const basePrice = 4.0; // USD per minute
  const baseDonation = 25.0; // USD suggested donation

  const rate = currencyInfo?.rate || 1;
  const currency = currencyInfo?.currency || "USD";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <DollarSign className="w-5 h-5 text-green-600" />
        <h3 className="font-semibold text-gray-900">
          Pricing in {selectedLocation?.country_name || "Your Region"}
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">First 5 minutes</span>
          <span className="font-bold text-green-600 text-lg">FREE</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">After 5 minutes</span>
          <span className="font-bold text-gray-900 text-lg">
            {formatCurrency(basePrice, currency, rate)}/min
          </span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Suggested donation</span>
            <span className="font-bold text-teal-600 text-lg">
              {formatCurrency(baseDonation, currency, rate)}
            </span>
          </div>
        </div>

        {rate !== 1 && (
          <div className="text-xs text-gray-500 mt-2">
            Converted from USD at rate: 1 USD = {rate.toFixed(4)} {currency}
          </div>
        )}
      </div>
    </div>
  );
}
