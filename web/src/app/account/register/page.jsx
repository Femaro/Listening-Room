"use client";

import { useState } from "react";
import { 
  Mail, 
  Lock, 
  User, 
  UserCheck, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  RefreshCw
} from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "seeker"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Please enter your full name");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType: formData.userType
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setRegistrationComplete(true);

    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setResendingEmail(true);
    setError(null);

    try {
      const response = await fetch(`/api/auth/register?action=resend&email=${encodeURIComponent(formData.email)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend email");
      }

      alert("Activation email resent successfully! Please check your inbox.");

    } catch (err) {
      console.error("Resend email error:", err);
      setError(err.message);
    } finally {
      setResendingEmail(false);
    }
  };

  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Check Your Email!
          </h2>
          
          <p className="text-gray-600 mb-6">
            We've sent an activation email to <strong>{formData.email}</strong>. 
            Please click the link in the email or enter the activation code to complete your registration.
          </p>

          <div className="space-y-3">
            <a
              href="/auth/activate"
              className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors inline-flex items-center justify-center"
            >
              Enter Activation Code
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>

            <button
              onClick={handleResendEmail}
              disabled={resendingEmail}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
            >
              {resendingEmail ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Resending...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend Email
                </>
              )}
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Already activated?{" "}
            <a href="/account/signin" className="text-teal-600 hover:text-teal-700 font-medium">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <img
            src="https://ucarecdn.com/dc54868d-20c4-46fa-b583-6f27b18e95b5/-/format/auto/"
            alt="ListeningRoom"
            className="h-12 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900">Join ListeningRoom</h2>
          <p className="text-gray-600 mt-2">Create your account and start connecting</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I want to:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: 'seeker' }))}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  formData.userType === 'seeker'
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className="w-5 h-5 text-teal-600 mb-2" />
                <div className="text-sm font-medium">Get Support</div>
                <div className="text-xs text-gray-500">Talk to volunteers</div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: 'volunteer' }))}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  formData.userType === 'volunteer'
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <UserCheck className="w-5 h-5 text-teal-600 mb-2" />
                <div className="text-sm font-medium">Help Others</div>
                <div className="text-xs text-gray-500">Become a volunteer</div>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex space-x-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded ${
                        i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600">
                  Password strength: {strengthLabels[passwordStrength - 1] || "Very Weak"}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <div className="mt-1 flex items-center">
                {formData.password === formData.confirmPassword ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-xs">Passwords match</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-xs">Passwords do not match</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Volunteer Notice */}
          {formData.userType === 'volunteer' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                📚 Volunteer Training Required
              </h4>
              <p className="text-xs text-blue-700">
                After registration, you'll complete our training modules before you can start helping others. 
                This ensures you're prepared to provide the best support possible.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/account/signin" className="text-teal-600 hover:text-teal-700 font-medium">
              Sign in here
            </a>
          </p>
        </div>

        {/* Terms Notice */}
        <p className="text-xs text-gray-500 text-center mt-4">
          By creating an account, you agree to our{" "}
          <a href="/terms" className="text-teal-600 hover:text-teal-700">Terms of Service</a>
          {" "}and{" "}
          <a href="/privacy" className="text-teal-600 hover:text-teal-700">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}