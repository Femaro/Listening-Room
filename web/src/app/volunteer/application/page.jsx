"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Heart,
  FileText,
  Check,
  ArrowLeft,
  Globe,
  Calendar,
  Award,
} from "lucide-react";

export default function VolunteerApplicationPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    timezone: "",
    preferredLanguages: ["English"],
    availability: [],
    background: "",
    experience: "",
    motivation: "",
    specializations: [],
    agreeToTerms: false,
    agreeToBackground: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const languages = [
    "English", "Spanish", "French", "German", "Italian", "Portuguese", 
    "Dutch", "Russian", "Chinese", "Japanese", "Korean", "Arabic", 
    "Hindi", "Other"
  ];

  const specializations = [
    "General Listening", "Anxiety Support", "Depression Support", 
    "Grief Counseling", "Relationship Issues", "Work Stress", 
    "Academic Pressure", "Family Issues", "LGBTQ+ Support",
    "Mental Health Awareness", "Crisis Support", "Addiction Support"
  ];

  const timezones = [
    "UTC-12:00 (Baker Island)", "UTC-11:00 (American Samoa)", "UTC-10:00 (Hawaii)",
    "UTC-09:00 (Alaska)", "UTC-08:00 (Pacific Time)", "UTC-07:00 (Mountain Time)",
    "UTC-06:00 (Central Time)", "UTC-05:00 (Eastern Time)", "UTC-04:00 (Atlantic)",
    "UTC-03:00 (Argentina)", "UTC-02:00 (Mid-Atlantic)", "UTC-01:00 (Azores)",
    "UTC+00:00 (Greenwich Mean Time)", "UTC+01:00 (Central European Time)",
    "UTC+02:00 (Eastern European Time)", "UTC+03:00 (Moscow Time)",
    "UTC+04:00 (Gulf Time)", "UTC+05:00 (Pakistan Time)", "UTC+05:30 (India Time)",
    "UTC+06:00 (Bangladesh Time)", "UTC+07:00 (Thailand Time)", "UTC+08:00 (China Time)",
    "UTC+09:00 (Japan Time)", "UTC+10:00 (Australia Eastern Time)", "UTC+11:00 (Solomon Islands)",
    "UTC+12:00 (New Zealand Time)"
  ];

  const weekDays = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleArrayChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms || !formData.agreeToBackground) {
      setError("Please agree to all terms and conditions");
      return;
    }

    if (formData.availability.length === 0) {
      setError("Please select at least one availability slot");
      return;
    }

    if (formData.specializations.length === 0) {
      setError("Please select at least one specialization");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First register the user account
      const authResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          userType: "volunteer"
        }),
      });

      if (!authResponse.ok) {
        const authError = await authResponse.json();
        throw new Error(authError.error || "Registration failed");
      }

      // Then submit the volunteer application
      const appResponse = await fetch("/api/volunteer-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status: "pending"
        }),
      });

      if (!appResponse.ok) {
        const appError = await appResponse.json();
        throw new Error(appError.error || "Application submission failed");
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Application error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  const goHome = () => {
    window.location.href = "/";
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Application Submitted Successfully!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in becoming a volunteer listener. We've received your application 
              and will review it within 2-3 business days. You'll receive an email with next steps, 
              including access to our training materials.
            </p>
            <div className="space-y-4">
              <button
                onClick={goHome}
                className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
              >
                Return to Home
              </button>
              <p className="text-sm text-gray-500">
                Questions? Contact us at support@listeningroom.com
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={goBack}
            className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Volunteer Listener Application
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our community of compassionate listeners and make a meaningful difference in people's lives.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-teal-600" />
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone *
                  </label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select your timezone</option>
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Languages */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-teal-600" />
                Preferred Languages *
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {languages.map((lang) => (
                  <label key={lang} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.preferredLanguages.includes(lang)}
                      onChange={() => handleArrayChange("preferredLanguages", lang)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">{lang}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Availability */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-teal-600" />
                Weekly Availability *
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Select the days when you're generally available to volunteer (you can be more specific later).
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {weekDays.map((day) => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.availability.includes(day)}
                      onChange={() => handleArrayChange("availability", day)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">{day}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Specializations */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-teal-600" />
                Areas of Support *
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Select the areas where you feel comfortable providing support (training will be provided).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {specializations.map((spec) => (
                  <label key={spec} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.specializations.includes(spec)}
                      onChange={() => handleArrayChange("specializations", spec)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">{spec}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Experience & Background */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-teal-600" />
                About You
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background & Qualifications
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Tell us about your educational background, work experience, or any relevant qualifications.
                  </p>
                  <textarea
                    name="background"
                    value={formData.background}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relevant Experience
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Describe any experience you have with counseling, peer support, volunteering, or helping others.
                  </p>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to volunteer? *
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Share your motivation for wanting to become a volunteer listener..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            {/* Terms & Conditions */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-teal-600" />
                Agreement & Consent
              </h2>
              <div className="space-y-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the <a href="/terms" className="text-teal-600 hover:underline">Terms of Service</a> and 
                    <a href="/privacy" className="text-teal-600 hover:underline ml-1">Privacy Policy</a>, 
                    and understand that I will need to complete mandatory training before I can begin volunteering.
                  </span>
                </label>
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToBackground"
                    checked={formData.agreeToBackground}
                    onChange={handleInputChange}
                    className="mt-1 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">
                    I consent to a background screening process and understand that volunteer positions 
                    require approval. I commit to maintaining confidentiality and following all safety protocols.
                  </span>
                </label>
              </div>
            </section>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}