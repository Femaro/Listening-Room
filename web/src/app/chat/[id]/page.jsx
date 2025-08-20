import { useState, useEffect, useRef } from "react";
import { Heart, Send, X, Shield, AlertTriangle, Clock } from "lucide-react";
import useUser from "@/utils/useUser";

function MainComponent({ params }) {
  const { data: user, loading } = useUser();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingSession, setLoadingSession] = useState(true);
  const [error, setError] = useState(null);
  const [ending, setEnding] = useState(false);
  const messagesEndRef = useRef(null);
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profiles');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setProfile(data.profile);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchSession = async () => {
    try {
      const response = await fetch(`/api/chat-sessions?status=active`);
      if (!response.ok) {
        throw new Error('Failed to fetch session');
      }
      const data = await response.json();
      const currentSession = data.sessions?.find(s => s.id === parseInt(id));
      
      if (!currentSession) {
        setError("Session not found or you don't have access to it");
        return;
      }

      setSession(currentSession);
      
      // Initialize with some sample messages for demo
      // In a real implementation, this would fetch actual messages
      setMessages([
        {
          id: 1,
          sender: currentSession.volunteer_id ? 'volunteer' : 'system',
          content: currentSession.volunteer_id 
            ? "Hi there! I'm here to listen. Feel free to share whatever is on your mind."
            : "You're in the queue. A volunteer will join you shortly. Please wait...",
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.error('Error fetching session:', err);
      setError('Failed to load chat session');
    } finally {
      setLoadingSession(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !session) return;

    const message = {
      id: Date.now(),
      sender: profile?.user_type === 'seeker' ? 'seeker' : 'volunteer',
      content: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // In a real implementation, this would send the message to the server
    // For demo purposes, we'll simulate a response after a delay
    if (session.volunteer_id && profile?.user_type === 'seeker') {
      setTimeout(() => {
        const responses = [
          "I hear you. That sounds really difficult.",
          "Thank you for sharing that with me. How are you feeling right now?",
          "That must be challenging. Can you tell me more about that?",
          "I'm here to listen. Take your time.",
          "It sounds like you're going through a lot. You're not alone."
        ];
        
        const response = {
          id: Date.now() + 1,
          sender: 'volunteer',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, response]);
      }, 1000 + Math.random() * 2000);
    }
  };

  const endSession = async () => {
    if (!session) return;
    
    setEnding(true);
    try {
      const response = await fetch(`/api/chat-sessions/${session.id}/end`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to end session');
      }

      // Redirect based on user type
      if (profile?.user_type === 'seeker') {
        window.location.href = `/feedback/${session.id}`;
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error('Error ending session:', err);
      setError('Failed to end session');
      setEnding(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading || loadingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 animate-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-4">Unable to Load Chat</h2>
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">
                {session?.status === 'waiting' ? 'Waiting for volunteer...' : 'Anonymous Chat'}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>End-to-end encrypted</span>
                {session?.volunteer_id && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Connected</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={endSession}
            disabled={ending}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>{ending ? 'Ending...' : 'End Chat'}</span>
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'system' 
                ? 'justify-center' 
                : message.sender === (profile?.user_type === 'seeker' ? 'seeker' : 'volunteer')
                ? 'justify-end' 
                : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'system'
                  ? 'bg-yellow-100 text-yellow-800 text-sm'
                  : message.sender === (profile?.user_type === 'seeker' ? 'seeker' : 'volunteer')
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'system' 
                  ? 'text-yellow-600'
                  : message.sender === (profile?.user_type === 'seeker' ? 'seeker' : 'volunteer')
                  ? 'text-blue-200'
                  : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      {session?.status === 'active' ? (
        <form onSubmit={sendMessage} className="bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-yellow-50 border-t border-yellow-200 p-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-yellow-800">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Waiting for a volunteer to join...</span>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            This usually takes just a few minutes. Thank you for your patience.
          </p>
        </div>
      )}

      {/* Crisis Notice */}
      <div className="bg-red-50 border-t border-red-200 p-3 text-center">
        <p className="text-xs text-red-700">
          <strong>Crisis Support:</strong> If you're in immediate danger, please call 911 or the Suicide & Crisis Lifeline at 988.
        </p>
      </div>
    </div>
  );
}

export default MainComponent;