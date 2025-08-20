import { useState, useEffect } from "react";
import {
  Heart,
  CheckCircle,
  ArrowLeft,
  Share2,
  Twitter,
  Facebook,
} from "lucide-react";

function MainComponent() {
  const [txRef, setTxRef] = useState("");
  const [loading, setLoading] = useState(true);
  const [donationData, setDonationData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get transaction reference from URL
    const params = new URLSearchParams(window.location.search);
    const txRefParam = params.get("tx_ref");

    if (txRefParam) {
      setTxRef(txRefParam);
      // Optionally fetch donation details here
    } else {
      setError("No transaction reference found");
    }

    setLoading(false);
  }, []);

  const shareMessage =
    "I just donated to Listening Room to support free, anonymous mental health conversations. Join me in making a difference! 💙";

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.origin);
    const text = encodeURIComponent(shareMessage);

    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <img
            src="https://ucarecdn.com/e602d80d-2f3e-4bce-b13a-78b9e1ed90fa/-/format/auto/"
            alt="Listening Room Logo"
            className="w-20 h-12 mx-auto mb-4 animate-pulse object-contain"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(58%) sepia(45%) saturate(1678%) hue-rotate(152deg) brightness(91%) contrast(95%)",
            }}
          />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://ucarecdn.com/e602d80d-2f3e-4bce-b13a-78b9e1ed90fa/-/format/auto/"
                alt="Listening Room Logo"
                className="h-10 object-contain"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(58%) sepia(45%) saturate(1678%) hue-rotate(152deg) brightness(91%) contrast(95%)",
                }}
              />
            </div>
            <a
              href="/"
              className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </a>
          </div>
        </div>
      </header>

      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {error ? (
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <Heart className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Something went wrong
              </h1>
              <p className="text-gray-600 mb-8">
                We couldn't verify your donation. Please contact support if you
                need assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/donate"
                  className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  Try Again
                </a>
                <a
                  href="/"
                  className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back to Home
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-12">
              {/* Success Animation */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-teal-600" />
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Thank You! 🎉
              </h1>

              <p className="text-xl text-gray-600 mb-2">
                Your donation was successful!
              </p>

              {txRef && (
                <p className="text-sm text-gray-500 mb-8">
                  Transaction Reference: {txRef.split("_")[2] || txRef}
                </p>
              )}

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-teal-800 mb-3">
                  Your Impact
                </h3>
                <p className="text-teal-700">
                  Your generous donation helps us provide free, anonymous mental
                  health support to those who need it most. You're making a real
                  difference in people's lives. 💙
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <a
                  href="/dashboard"
                  className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  Visit Dashboard
                </a>
                <a
                  href="/donate"
                  className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold border-2 border-teal-600 hover:bg-teal-50 transition-colors"
                >
                  Donate Again
                </a>
              </div>

              {/* Share Section */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share the Love
                </h3>
                <p className="text-gray-600 mb-6">
                  Help us reach more people by sharing our mission
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleShare("twitter")}
                    className="flex items-center space-x-2 bg-blue-400 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare("facebook")}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                    <span>Facebook</span>
                  </button>
                </div>
              </div>

              {/* Receipt Information */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  📧 A donation receipt has been sent to your email address.
                  <br />💳 Your payment was processed securely by Flutterwave.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Actions */}
      <div className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            What's Next?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-teal-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Start a Conversation
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Connect with a trained volunteer listener
              </p>
              <a
                href="/account/signup"
                className="text-teal-600 hover:text-teal-700 font-medium text-sm"
              >
                Get Started →
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Become a Volunteer
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Help others by becoming a listener
              </p>
              <a
                href="/volunteer"
                className="text-teal-600 hover:text-teal-700 font-medium text-sm"
              >
                Apply Now →
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Spread the Word
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Share Listening Room with friends
              </p>
              <button
                onClick={() => handleShare("twitter")}
                className="text-teal-600 hover:text-teal-700 font-medium text-sm"
              >
                Share Now →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
