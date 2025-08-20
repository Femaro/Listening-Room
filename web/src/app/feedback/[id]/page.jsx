import { useState, useEffect } from "react";
import { Heart, Star, ThumbsUp, ThumbsDown, MessageSquare, CheckCircle } from "lucide-react";
import useUser from "@/utils/useUser";

function MainComponent({ params }) {
  const { data: user, loading } = useUser();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [feedback, setFeedback] = useState({
    rating: 0,
    was_helpful: null,
    feedback_text: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const { id } = params;

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/account/signin";
      return;
    }

    if (user) {
      fetchSession();
      fetchProfile();
    }
  }, [user, loading, id]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profiles');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setProfile(data.profile);
      
      // Only seekers can provide feedback
      if (data.profile?.user_type !== 'seeker') {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    }
  };

  const fetchSession = async () => {
    try {
      const response = await fetch('/api/chat-sessions');
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      const data = await response.json();
      const currentSession = data.sessions?.find(s => s.id === parseInt(id) && s.status === 'ended');
      
      if (!currentSession) {
        setError("Session not found or feedback not available");
        return;
      }

      setSession(currentSession);
    } catch (err) {
      console.error('Error fetching session:', err);
      setError('Failed to load session');
    }
  };

  const handleRatingClick = (rating) => {
    setFeedback(prev => ({ ...prev, rating }));
  };

  const handleHelpfulClick = (wasHelpful) => {
    setFeedback(prev => ({ ...prev, was_helpful: wasHelpful }));
  };

  const handleTextChange = (e) => {
    setFeedback(prev => ({ ...prev, feedback_text: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: session.id,
          ...feedback
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err.message);
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 animate-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Thank You!
            </h2>
            <p className="text-gray-600 mb-6">
              Your feedback helps us improve our service and support our volunteers.
            </p>
            <div className="space-y-3">
              <a
                href="/dashboard"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors block"
              >
                Back to Dashboard
              </a>
              <button
                onClick={() => window.location.href = "/dashboard"}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Start Another Conversation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <Heart className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-4">Unable to Load Feedback</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">How was your experience?</h1>
          <p className="text-gray-600 mt-2">Your feedback helps us improve our service</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          {/* Session Info */}
          {session && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Session Details</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Volunteer: {session.volunteer_username || 'Anonymous'}</p>
                <p>Started: {formatDate(session.started_at)}</p>
                <p>Ended: {formatDate(session.ended_at)}</p>
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-900 mb-4">
              How would you rate this conversation?
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className={`p-2 rounded-lg transition-colors ${
                    star <= feedback.rating
                      ? 'text-yellow-500'
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-gray-600">
                {feedback.rating === 0 && "Click to rate"}
                {feedback.rating === 1 && "Poor"}
                {feedback.rating === 2 && "Fair"}
                {feedback.rating === 3 && "Good"}
                {feedback.rating === 4 && "Very Good"}
                {feedback.rating === 5 && "Excellent"}
              </span>
            </div>
          </div>

          {/* Was Helpful */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-900 mb-4">
              Was this conversation helpful?
            </label>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => handleHelpfulClick(true)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg border-2 transition-colors ${
                  feedback.was_helpful === true
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300 text-gray-700'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
                <span>Yes, helpful</span>
              </button>
              <button
                type="button"
                onClick={() => handleHelpfulClick(false)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg border-2 transition-colors ${
                  feedback.was_helpful === false
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-red-300 text-gray-700'
                }`}
              >
                <ThumbsDown className="w-5 h-5" />
                <span>Not helpful</span>
              </button>
            </div>
          </div>

          {/* Additional Comments */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-900 mb-4">
              Additional comments (optional)
            </label>
            <div className="relative">
              <MessageSquare className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
              <textarea
                value={feedback.feedback_text}
                onChange={handleTextChange}
                placeholder="Share any additional thoughts about your experience..."
                rows={4}
                maxLength={500}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {feedback.feedback_text.length}/500 characters
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
            <a
              href="/dashboard"
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors text-center"
            >
              Skip for Now
            </a>
          </div>

          {/* Privacy Note */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Privacy Note:</strong> Your feedback is anonymous and helps us improve our service. 
              It will not be shared with the volunteer you spoke with.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MainComponent;