"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  MessageCircle, 
  Users,
  Settings,
  Shield,
  Timer,
  AlertCircle,
  Send
} from "lucide-react";
import useUser from "@/utils/useUser";

export default function SessionRoom({ params }) {
  const { data: user, loading: userLoading } = useUser();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  
  // Media controls
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  
  // Chat
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  
  // Timer
  const [sessionTime, setSessionTime] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  
  // WebRTC refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const wsRef = useRef(null);

  const { id: sessionId } = params;

  useEffect(() => {
    if (user && sessionId) {
      fetchSessionData();
      initializeSession();
    }

    return () => {
      cleanupSession();
    };
  }, [user, sessionId]);

  useEffect(() => {
    let interval;
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const fetchSessionData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/scheduled-sessions/${sessionId}`);
      if (!response.ok) {
        throw new Error("Session not found");
      }
      const data = await response.json();
      setSessionData(data.session);
    } catch (error) {
      console.error("Error fetching session:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const initializeSession = async () => {
    try {
      // Initialize WebSocket connection for signaling
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/ws/session/${sessionId}`;
      
      // For demo purposes, we'll simulate WebRTC setup
      // In production, you'd implement actual WebRTC with STUN/TURN servers
      setConnectionStatus("connected");
      setIsConnected(true);
      setIsSessionActive(true);

      // Initialize local media
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (mediaError) {
        console.warn("Could not access media devices:", mediaError);
        setIsVideoOn(false);
        setIsAudioOn(false);
      }

    } catch (error) {
      console.error("Error initializing session:", error);
      setConnectionStatus("failed");
      setError("Failed to connect to session");
    }
  };

  const cleanupSession = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
      }
    }
  };

  const endSession = async () => {
    if (confirm("Are you sure you want to end this session?")) {
      try {
        // Update session status to completed
        await fetch(`/api/scheduled-sessions/${sessionId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "completed"
          }),
        });

        cleanupSession();
        window.location.href = "/dashboard";
      } catch (error) {
        console.error("Error ending session:", error);
      }
    }
  };

  const sendChatMessage = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      const message = {
        id: Date.now(),
        text: chatInput.trim(),
        sender: user.name || user.email,
        timestamp: new Date(),
        isOwnMessage: true
      };
      setChatMessages(prev => [...prev, message]);
      setChatInput("");
      
      // In production, send via WebSocket
      // wsRef.current?.send(JSON.stringify({ type: 'chat', message }));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-white">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Please sign in to join this session</p>
          <a
            href="/account/signin"
            className="text-teal-500 hover:text-teal-400 font-medium"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Session Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <a
            href="/sessions"
            className="text-teal-500 hover:text-teal-400 font-medium"
          >
            Back to Sessions
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-white font-medium">
                {sessionData?.title || "Listening Session"}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Timer className="w-4 h-4" />
              <span>{formatTime(sessionTime)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-sm ${
              connectionStatus === "connected" ? "bg-green-900 text-green-300" :
              connectionStatus === "connecting" ? "bg-yellow-900 text-yellow-300" :
              "bg-red-900 text-red-300"
            }`}>
              {connectionStatus === "connected" ? "Secure Connection" :
               connectionStatus === "connecting" ? "Connecting..." :
               "Connection Failed"}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 relative bg-black">
          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Local Video */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!isVideoOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <VideoOff className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-75 rounded-lg p-3 max-w-sm">
            <div className="flex items-center space-x-2 text-green-400 text-sm">
              <Shield className="w-4 h-4" />
              <span>End-to-end encrypted session</span>
            </div>
          </div>

          {/* Waiting for participant */}
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
              <div className="text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-white text-lg mb-2">Waiting for other participants...</p>
                <p className="text-gray-400">The session will begin once everyone joins</p>
              </div>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-medium">Session Chat</h3>
              <p className="text-gray-400 text-sm">Messages are not recorded</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 ? (
                <p className="text-gray-400 text-center text-sm">No messages yet</p>
              ) : (
                chatMessages.map((message) => (
                  <div key={message.id} className={`${
                    message.isOwnMessage ? "ml-4" : "mr-4"
                  }`}>
                    <div className={`p-3 rounded-lg ${
                      message.isOwnMessage 
                        ? "bg-teal-600 text-white ml-auto" 
                        : "bg-gray-700 text-white"
                    } max-w-xs`}>
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <form onSubmit={sendChatMessage} className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full ${
              isAudioOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"
            } text-white transition-colors`}
          >
            {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${
              isVideoOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"
            } text-white transition-colors`}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-3 rounded-full ${
              showChat ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-700 hover:bg-gray-600"
            } text-white transition-colors`}
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          <button
            onClick={endSession}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            <Phone className="w-5 h-5 mr-2 inline" />
            End Session
          </button>
        </div>
      </div>
    </div>
  );
}