import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { Heart } from "lucide-react";

function MainComponent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signUpWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      await signUpWithCredentials({
        email,
        password,
        callbackUrl: "/onboarding",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        OAuthSignin:
          "Couldn't start sign-up. Please try again or use a different method.",
        OAuthCallback: "Sign-up failed after redirecting. Please try again.",
        OAuthCreateAccount:
          "Couldn't create an account with this sign-up option. Try another one.",
        EmailCreateAccount:
          "This email can't be used. It may already be registered.",
        Callback: "Something went wrong during sign-up. Please try again.",
        OAuthAccountNotLinked:
          "This account is linked to a different sign-in method. Try using that instead.",
        CredentialsSignin:
          "Invalid email or password. If you already have an account, try signing in instead.",
        AccessDenied: "You don't have permission to sign up.",
        Configuration:
          "Sign-up isn't working right now. Please try again later.",
        Verification: "Your sign-up link has expired. Request a new one.",
      };

      setError(
        errorMessages[err.message] || "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <img
            src="https://ucarecdn.com/e05f1122-ee17-479a-b4b8-456584592d00/-/format/auto/"
            alt="Listening Room Logo"
            className="w-40 h-20 mx-auto mb-4 object-contain"
          />
          <p className="text-gray-600 mt-2">Join our supportive community</p>
        </div>

        <form
          noValidate
          onSubmit={onSubmit}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Create Account
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                required
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                required
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (min. 6 characters)"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href={`/account/signin${
                  typeof window !== "undefined" ? window.location.search : ""
                }`}
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Sign in
              </a>
            </p>
          </div>
        </form>

        {/* Privacy & Safety Notice */}
        <div className="mt-6 space-y-4">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-teal-800 mb-2">
              🔒 Your Privacy is Protected
            </h3>
            <p className="text-xs text-teal-700">
              All conversations are anonymous and confidential. We never store
              chat content.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-sm text-red-800 font-medium">
              Crisis Support Available 24/7
            </p>
            <p className="text-xs text-red-600 mt-1">
              If you're in immediate danger, please call emergency services or
              visit your local emergency room.
            </p>
          </div>

          {/* Support Link */}
          <div className="text-center">
            <a
              href="/donate"
              className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              <Heart className="w-4 h-4" />
              <span>Support our mission</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
