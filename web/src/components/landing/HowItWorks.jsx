"use client";

export function HowItWorks() {
  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-4xl mx-auto">
        <h2
          id="how-it-works-heading"
          className="text-3xl font-bold text-center text-gray-900 mb-12"
        >
          How Global Mental Health Support Works
        </h2>
        <ol className="space-y-8" role="list">
          <li className="flex items-start space-x-4">
            <div
              className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0"
              aria-hidden="true"
            >
              1
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select Your Location & Language
              </h3>
              <p className="text-gray-600">
                Choose your country and preferred language. We'll match you with
                culturally-aware volunteers who understand your background and
                timezone.
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-4">
            <div
              className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0"
              aria-hidden="true"
            >
              2
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Connect with Global Mental Health Listeners
              </h3>
              <p className="text-gray-600">
                Click "Start Free Chat" and we'll instantly match you with an
                available trained volunteer from our global network.
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-4">
            <div
              className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0"
              aria-hidden="true"
            >
              3
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Get Culturally-Aware Support
              </h3>
              <p className="text-gray-600">
                Share what's on your mind in a secure, encrypted chat with
                pricing automatically converted to your local currency. End
                whenever you're ready.
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
