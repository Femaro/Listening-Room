import { useState, useEffect } from "react";
import {
  Heart,
  User,
  MessageCircle,
  Shield,
  AlertTriangle,
} from "lucide-react";
import useUser from "@/utils/useUser";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    user_type: "",
    preferred_language: "en",
    general_topic: "",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/account/signin";
    }
  }, [user, loading]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleNext = () => {
    if (step === 1 && !formData.username.trim()) {
      setError("Please enter a username");
      return;
    }
    if (step === 2 && !formData.user_type) {
      setError("Please select how you'd like to use Listening Room");
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!formData.username.trim() || !formData.user_type) {
      setError("Please complete all required fields");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create profile");
      }

      // Redirect based on user type
      if (formData.user_type === "volunteer") {
        window.location.href = "/volunteer/application";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Error creating profile:", err);
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <img
            src="https://ucarecdn.com/e05f1122-ee17-479a-b4b8-456584592d00/-/format/auto/"
            alt="Listening Room Logo"
            className="w-56 h-32 mx-auto mb-4 animate-pulse object-contain"
          />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <img
            src="https://ucarecdn.com/e05f1122-ee17-479a-b4b8-456584592d00/-/format/auto/"
            alt="Listening Room Logo"
            className="w-64 h-36 mx-auto mb-4 object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to Listening Room
          </h1>
          <p className="text-gray-600 mt-2">
            Let's set up your anonymous profile
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNum <= step
                      ? "bg-teal-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      stepNum < step ? "bg-teal-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Username */}
          {step === 1 && (
            <div className="text-center">
              <User className="w-12 h-12 text-teal-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Choose Your Username
              </h2>
              <p className="text-gray-600 mb-6">
                This will be your anonymous identity. Choose something that
                feels right to you.
              </p>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors text-center text-lg"
                maxLength={50}
              />
              <p className="text-sm text-gray-500 mt-2">
                This can be changed later in your settings
              </p>
            </div>
          )}

          {/* Step 2: User Type */}
          {step === 2 && (
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-teal-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How would you like to use Listening Room?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => handleInputChange("user_type", "seeker")}
                  className={`w-full p-6 rounded-lg border-2 text-left transition-colors ${
                    formData.user_type === "seeker"
                      ? "border-teal-600 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    I want to talk to someone
                  </h3>
                  <p className="text-gray-600">
                    Connect with trained volunteers who are here to listen and
                    provide support.
                  </p>
                </button>
                <button
                  onClick={() => handleInputChange("user_type", "volunteer")}
                  className={`w-full p-6 rounded-lg border-2 text-left transition-colors ${
                    formData.user_type === "volunteer"
                      ? "border-teal-600 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    I want to volunteer as a listener
                  </h3>
                  <p className="text-gray-600">
                    Help others by providing a safe space to be heard. Training
                    required.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="text-center">
              <Shield className="w-12 h-12 text-teal-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Set Your Preferences
              </h2>
              <div className="space-y-6 text-left">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Language
                  </label>
                  <select
                    value={formData.preferred_language}
                    onChange={(e) =>
                      handleInputChange("preferred_language", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                  </select>
                </div>
                {formData.user_type === "seeker" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      General Topic (Optional)
                    </label>
                    <select
                      value={formData.general_topic}
                      onChange={(e) =>
                        handleInputChange("general_topic", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select a topic (optional)</option>
                      <option value="anxiety">Anxiety & Stress</option>
                      <option value="relationships">Relationships</option>
                      <option value="work">Work & Career</option>
                      <option value="family">Family Issues</option>
                      <option value="grief">Grief & Loss</option>
                      <option value="general">General Support</option>
                      <option value="other">Other</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                      This helps us match you with the right volunteer, but you
                      can talk about anything.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Important Reminders
              </h2>
              <div className="space-y-4 text-left">
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <h3 className="font-semibold text-teal-800 mb-2">
                    🔒 Your Privacy
                  </h3>
                  <p className="text-teal-700 text-sm">
                    All conversations are anonymous and encrypted. We never
                    store chat content.
                  </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h3 className="font-semibold text-emerald-800 mb-2">
                    💙 Non-Judgmental Space
                  </h3>
                  <p className="text-emerald-700 text-sm">
                    Our volunteers are trained to listen without judgment and
                    provide emotional support.
                  </p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">
                    🚨 Crisis Support
                  </h3>
                  <p className="text-red-700 text-sm">
                    If you're in immediate danger, please contact emergency
                    services (911) or the Suicide & Crisis Lifeline (988)
                    immediately.
                  </p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-800 mb-2">
                    🤝 Support Us
                  </h3>
                  <p className="text-orange-700 text-sm">
                    Consider{" "}
                    <a href="/donate" className="underline font-medium">
                      donating
                    </a>{" "}
                    to help us keep this platform free and accessible for
                    everyone.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
              >
                Back
              </button>
            )}
            <div className="flex-1" />
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Setting up..." : "Complete Setup"}
              </button>
            )}
          </div>
        </div>

        {/* Credit */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Powered by{" "}
            <span className="text-teal-600 font-medium">
              CLAEVA INTERNATIONAL
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
