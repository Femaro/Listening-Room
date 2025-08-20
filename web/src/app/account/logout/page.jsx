import useAuth from "@/utils/useAuth";
import { Heart } from "lucide-react";

function MainComponent() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ListeningRoom</h1>
          <p className="text-gray-600 mt-2">
            Thank you for being part of our community
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sign Out</h2>

          <p className="text-gray-600 mb-6">
            Are you sure you want to sign out of your account?
          </p>

          <button
            onClick={handleSignOut}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Sign Out
          </button>

          <div className="mt-4">
            <a href="/" className="text-sm text-gray-600 hover:text-gray-800">
              Cancel and go back
            </a>
          </div>
        </div>

        {/* Crisis Notice */}
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-sm text-red-800 font-medium">
            Crisis Support Available 24/7
          </p>
          <p className="text-xs text-red-600 mt-1">
            If you're in immediate danger, please call emergency services or
            visit your local emergency room.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
