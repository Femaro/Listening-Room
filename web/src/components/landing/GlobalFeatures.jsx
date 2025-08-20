import { Globe, MessageCircle, Users, Clock } from "lucide-react";

export default function GlobalFeatures() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Global Access to Mental Health
          </h2>
          <p className="text-lg text-gray-600">
            Connecting people across continents with culturally-aware support
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">40+ Countries</h3>
            <p className="text-gray-600 text-sm">
              Volunteers from Africa, Europe, Americas, Asia, and Oceania
            </p>
          </div>

          <div className="text-center">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">25+ Languages</h3>
            <p className="text-gray-600 text-sm">
              Native speakers providing support in your preferred language
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Specialized Support
            </h3>
            <p className="text-gray-600 text-sm">
              Trained volunteers in various specializations and life experiences
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">24/7 Coverage</h3>
            <p className="text-gray-600 text-sm">
              Round-the-clock support across all global time zones
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
