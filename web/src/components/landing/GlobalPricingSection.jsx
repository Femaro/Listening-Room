import { Heart, ArrowRight } from "lucide-react";
import CurrencyAwarePricing from "./CurrencyAwarePricing";

export default function GlobalPricingSection({ selectedLocation, currencyInfo }) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Fair Pricing for Global Access
          </h2>
          <p className="text-lg text-gray-600">
            Automatically converted to your local currency with transparent,
            fair rates
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <CurrencyAwarePricing
            selectedLocation={selectedLocation}
            currencyInfo={currencyInfo}
          />

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">
                Support Our Mission
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Your donations help us provide free mental health support to
              those who need it most, especially in underserved regions.
            </p>
            <a
              href="/donate"
              className="inline-flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              <span>Make a Donation</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
