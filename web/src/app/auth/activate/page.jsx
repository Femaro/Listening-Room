"use client";

import { useState, useEffect } from "react";
import { 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  RefreshCw,
  Loader
} from "lucide-react";

export default function ActivatePage() {
  const [activationCode, setActivationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [loadingToken, setLoadingToken] = useState(true);

  useEffect(() => {
    // Check if there's a token in the URL (from email link)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      validateTokenFromUrl(token);
    } else {
      setLoadingToken(false);
    }
  }, []);

  const validateTokenFromUrl = async (token) => {
    try {
      const response = await fetch(`/api/auth/activate?token=${token}`);
      const data = await response.json();

      if (response.ok) {
        if (data.alreadyActivated) {
          setError("This account is already activated. You can sign in now.");
          setLoadingToken(false);
          return;
        }
        
        if (data.valid) {
          setTokenData(data);
          // Auto-activate if token is valid
          await activateWithToken(token);
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error("Token validation error:", err);
      setError("Failed to validate activation link");
    } finally {
      setLoadingToken(false);
    }
  };

  const activateWithToken = async (token) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = data.redirectUrl || '/dashboard';
        }, 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error("Activation error:", err);
      setError("Failed to activate account");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    
    if (!activationCode.trim()) {
      setError("Please enter the activation code");
      return;
    }

    if (activationCode.length !== 6) {
      setError("Activation code must be 6 digits");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: activationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = data.redirectUrl || '/dashboard';
        }, 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error("Activation error:", err);
      setError("Failed to activate account");
    } finally {
      setLoading(false);
    }
  };

  if (loadingToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader className="w-8 h-8 text-teal-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Checking activation link...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Account Activated! 🎉
          </h2>
          
          <p className="text-gray-600 mb-6">
            Your account has been successfully activated. You'll be redirected to your dashboard in a few seconds.
          </p>

          <div className="space-y-3">
            <a
              href="/dashboard"
              className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors inline-flex items-center justify-center"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-teal-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Activate Your Account
          </h2>
          
          <p className="text-gray-600">
            {tokenData 
              ? `Welcome ${tokenData.name}! Activating your account...`
              : "Enter the 6-digit activation code from your email"
            }
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {!tokenData && (
          <form onSubmit={handleCodeSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activation Code
              </label>
              <input
                type="text"
                value={activationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setActivationCode(value);
                  setError(null);
                }}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-center text-2xl font-mono tracking-wider"
                maxLength={6}
                required
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                Check your email for the activation code
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || activationCode.length !== 6}
              className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Activating...
                </div>
              ) : (
                "Activate Account"
              )}
            </button>
          </form>
        )}

        {loading && tokenData && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Activating your account...</p>
          </div>
        )}

        {/* Help Links */}
        <div className="mt-8 space-y-3 text-center">
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-3">
              Didn't receive an email?
            </p>
            
            <a
              href="/account/register"
              className="text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              Go back to registration to resend
            </a>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already activated?{" "}
              <a href="/account/signin" className="text-teal-600 hover:text-teal-700 font-medium">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}