// Voice Calling Integration for CLAEVA INTERNATIONAL LLC
// Supporting multiple providers: Twilio, Sinch, Plivo, Vonage, etc.

export const VOICE_PROVIDERS = {
  twilio: {
    name: 'Twilio',
    supported: true,
    regions: ['global'],
    features: ['voice', 'video', 'recording', 'transcription']
  },
  sinch: {
    name: 'Sinch',
    supported: true,
    regions: ['global'],
    features: ['voice', 'video', 'messaging', 'verification']
  },
  plivo: {
    name: 'Plivo',
    supported: true,
    regions: ['global'],
    features: ['voice', 'recording', 'transcription']
  },
  vonage: {
    name: 'Vonage (Nexmo)',
    supported: true,
    regions: ['global'],
    features: ['voice', 'video', 'recording']
  },
  agora: {
    name: 'Agora',
    supported: true,
    regions: ['global'],
    features: ['voice', 'video', 'recording', 'streaming']
  }
};

// WebRTC configuration for direct peer-to-peer calls
const WEBRTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    // Add TURN servers for production
  ]
};

class VoiceCallManager {
  constructor(provider = 'twilio') {
    this.provider = provider;
    this.currentCall = null;
    this.localStream = null;
    this.peerConnection = null;
    this.sessionId = null;
    this.isInitialized = false;
  }

  // Initialize the voice calling service
  async initialize(config = {}) {
    try {
      switch (this.provider) {
        case 'twilio':
          return await this.initializeTwilio(config);
        case 'sinch':
          return await this.initializeSinch(config);
        case 'plivo':
          return await this.initializePlivo(config);
        case 'vonage':
          return await this.initializeVonage(config);
        case 'agora':
          return await this.initializeAgora(config);
        case 'webrtc':
          return await this.initializeWebRTC(config);
        default:
          throw new Error(`Unsupported provider: ${this.provider}`);
      }
    } catch (error) {
      console.error('Voice call initialization failed:', error);
      throw error;
    }
  }

  // Twilio Voice Integration
  async initializeTwilio(config) {
    try {
      // Load Twilio SDK
      if (!window.Twilio || !window.Twilio.Device) {
        await this.loadScript('https://sdk.twilio.com/js/client/v1.14/twilio.min.js');
      }

      // Initialize Twilio Device
      const response = await fetch('/api/voice/twilio/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: config.identity || 'user_' + Date.now() })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      const device = new window.Twilio.Device(data.token);
      
      device.on('ready', () => {
        console.log('Twilio device ready');
        this.isInitialized = true;
      });

      device.on('error', (error) => {
        console.error('Twilio device error:', error);
      });

      device.on('incoming', (call) => {
        this.handleIncomingCall(call);
      });

      this.device = device;
      return { success: true, provider: 'twilio' };
    } catch (error) {
      console.error('Twilio initialization failed:', error);
      throw error;
    }
  }

  // Sinch Voice Integration
  async initializeSinch(config) {
    try {
      // Load Sinch SDK
      if (!window.SinchClient) {
        await this.loadScript('https://download.sinch.com/javascript/3.19.0/sinch.min.js');
      }

      // Initialize Sinch Client
      const sinchClient = new window.SinchClient({
        applicationKey: config.applicationKey || process.env.NEXT_PUBLIC_SINCH_APP_KEY,
        capabilities: { calling: true },
        startActiveConnection: true,
        // Use username and password or user tickets for authentication
        onLogMessage: function(message) {
          console.log('Sinch log:', message);
        }
      });

      const callClient = sinchClient.getCallClient();
      
      callClient.initStream().then(() => {
        console.log('Sinch call client initialized');
        this.isInitialized = true;
      });

      this.sinchClient = sinchClient;
      this.callClient = callClient;
      
      return { success: true, provider: 'sinch' };
    } catch (error) {
      console.error('Sinch initialization failed:', error);
      throw error;
    }
  }

  // Plivo Voice Integration
  async initializePlivo(config) {
    try {
      // Load Plivo SDK
      if (!window.Plivo) {
        await this.loadScript('https://cdn.plivo.com/sdk/web/v2/plivo.min.js');
      }

      // Initialize Plivo Client
      const client = new window.Plivo.Client();
      
      const loginResponse = await fetch('/api/voice/plivo/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: config.username || 'user_' + Date.now() })
      });

      const loginData = await loginResponse.json();
      if (!loginResponse.ok) throw new Error(loginData.error);

      await client.login(loginData.username, loginData.password);
      
      client.on('onLogin', () => {
        console.log('Plivo client logged in');
        this.isInitialized = true;
      });

      client.on('onIncomingCall', (call) => {
        this.handleIncomingCall(call);
      });

      this.plivoClient = client;
      return { success: true, provider: 'plivo' };
    } catch (error) {
      console.error('Plivo initialization failed:', error);
      throw error;
    }
  }

  // Agora Voice Integration
  async initializeAgora(config) {
    try {
      // Load Agora SDK
      if (!window.AgoraRTC) {
        await this.loadScript('https://cdn.agora.io/sdk/release/AgoraRTC_N-4.19.1.js');
      }

      // Initialize Agora Client
      const client = window.AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      
      // Get Agora token
      const tokenResponse = await fetch('/api/voice/agora/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          channel: config.channel || 'session_' + Date.now(),
          uid: config.uid || 0
        })
      });

      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok) throw new Error(tokenData.error);

      this.agoraClient = client;
      this.agoraConfig = {
        appId: tokenData.appId,
        token: tokenData.token,
        channel: tokenData.channel,
        uid: tokenData.uid
      };

      console.log('Agora client initialized');
      this.isInitialized = true;
      
      return { success: true, provider: 'agora' };
    } catch (error) {
      console.error('Agora initialization failed:', error);
      throw error;
    }
  }

  // WebRTC Direct Integration (fallback)
  async initializeWebRTC(config) {
    try {
      this.peerConnection = new RTCPeerConnection(WEBRTC_CONFIG);
      
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.sendSignalingMessage({
            type: 'ice-candidate',
            candidate: event.candidate
          });
        }
      };

      this.peerConnection.ontrack = (event) => {
        const remoteAudio = document.getElementById('remoteAudio');
        if (remoteAudio) {
          remoteAudio.srcObject = event.streams[0];
        }
      };

      console.log('WebRTC initialized');
      this.isInitialized = true;
      
      return { success: true, provider: 'webrtc' };
    } catch (error) {
      console.error('WebRTC initialization failed:', error);
      throw error;
    }
  }

  // Make an outbound call
  async makeCall(sessionId, recipientId, options = {}) {
    if (!this.isInitialized) {
      throw new Error('Voice service not initialized');
    }

    this.sessionId = sessionId;

    try {
      switch (this.provider) {
        case 'twilio':
          return await this.makeTwilioCall(recipientId, options);
        case 'sinch':
          return await this.makeSinchCall(recipientId, options);
        case 'plivo':
          return await this.makePlivoCall(recipientId, options);
        case 'agora':
          return await this.makeAgoraCall(recipientId, options);
        case 'webrtc':
          return await this.makeWebRTCCall(recipientId, options);
        default:
          throw new Error(`Call not supported for provider: ${this.provider}`);
      }
    } catch (error) {
      console.error('Failed to make call:', error);
      throw error;
    }
  }

  async makeTwilioCall(recipientId, options) {
    const params = {
      To: recipientId,
      sessionId: this.sessionId,
      ...options
    };

    const call = this.device.connect(params);
    this.currentCall = call;

    call.on('accept', () => {
      console.log('Twilio call accepted');
      this.onCallConnected();
    });

    call.on('disconnect', () => {
      console.log('Twilio call disconnected');
      this.onCallDisconnected();
    });

    call.on('error', (error) => {
      console.error('Twilio call error:', error);
      this.onCallError(error);
    });

    return { success: true, callId: call.parameters.CallSid };
  }

  async makeAgoraCall(recipientId, options) {
    try {
      // Join the channel
      await this.agoraClient.join(
        this.agoraConfig.appId,
        this.agoraConfig.channel,
        this.agoraConfig.token,
        this.agoraConfig.uid
      );

      // Create and publish audio track
      const audioTrack = await window.AgoraRTC.createMicrophoneAudioTrack();
      await this.agoraClient.publish([audioTrack]);

      this.currentCall = {
        audioTrack,
        channel: this.agoraConfig.channel
      };

      // Listen for remote users
      this.agoraClient.on('user-published', async (user, mediaType) => {
        await this.agoraClient.subscribe(user, mediaType);
        if (mediaType === 'audio') {
          user.audioTrack.play();
        }
      });

      console.log('Agora call started');
      this.onCallConnected();

      return { success: true, callId: this.agoraConfig.channel };
    } catch (error) {
      console.error('Agora call failed:', error);
      throw error;
    }
  }

  // End the current call
  async endCall() {
    if (!this.currentCall) {
      return { success: false, message: 'No active call' };
    }

    try {
      switch (this.provider) {
        case 'twilio':
          this.currentCall.disconnect();
          break;
        case 'sinch':
          this.currentCall.hangup();
          break;
        case 'plivo':
          this.currentCall.hangup();
          break;
        case 'agora':
          if (this.currentCall.audioTrack) {
            this.currentCall.audioTrack.close();
          }
          await this.agoraClient.leave();
          break;
        case 'webrtc':
          this.peerConnection.close();
          break;
      }

      this.currentCall = null;
      this.onCallDisconnected();

      return { success: true };
    } catch (error) {
      console.error('Failed to end call:', error);
      throw error;
    }
  }

  // Mute/unmute microphone
  async toggleMute() {
    if (!this.currentCall) return false;

    try {
      switch (this.provider) {
        case 'twilio':
          const isMuted = this.currentCall.isMuted();
          this.currentCall.mute(!isMuted);
          return !isMuted;
        case 'agora':
          if (this.currentCall.audioTrack) {
            const enabled = this.currentCall.audioTrack.enabled;
            await this.currentCall.audioTrack.setEnabled(!enabled);
            return !enabled;
          }
          break;
      }
    } catch (error) {
      console.error('Failed to toggle mute:', error);
    }
    
    return false;
  }

  // Event handlers
  onCallConnected() {
    // Notify the session that voice call started
    fetch(`/api/chat-sessions/${this.sessionId}/voice-call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'connected', provider: this.provider })
    });
  }

  onCallDisconnected() {
    // Notify the session that voice call ended
    fetch(`/api/chat-sessions/${this.sessionId}/voice-call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'disconnected', provider: this.provider })
    });
  }

  onCallError(error) {
    console.error('Call error:', error);
    // Report call error
    fetch(`/api/chat-sessions/${this.sessionId}/voice-call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        status: 'error', 
        error: error.message,
        provider: this.provider 
      })
    });
  }

  handleIncomingCall(call) {
    // Handle incoming call UI
    const acceptCall = confirm('Incoming voice call. Accept?');
    if (acceptCall) {
      call.accept();
      this.currentCall = call;
    } else {
      call.reject();
    }
  }

  // Utility: Load external script
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // WebRTC signaling (would connect to websocket)
  sendSignalingMessage(message) {
    // This would typically send to a WebSocket server
    console.log('Signaling message:', message);
  }
}

// Auto-detect best available voice provider
export async function detectBestVoiceProvider() {
  const providers = ['twilio', 'sinch', 'plivo', 'agora', 'vonage'];
  
  for (const provider of providers) {
    try {
      const manager = new VoiceCallManager(provider);
      await manager.initialize();
      return provider;
    } catch (error) {
      console.log(`Provider ${provider} not available:`, error.message);
      continue;
    }
  }
  
  // Fallback to WebRTC
  return 'webrtc';
}

// Create voice call manager instance
export function createVoiceCallManager(provider) {
  return new VoiceCallManager(provider);
}

// Check device compatibility
export function checkVoiceCallSupport() {
  const support = {
    webrtc: !!(window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection),
    microphone: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    speaker: !!(window.Audio),
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    safari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  };

  return {
    supported: support.webrtc && support.microphone && support.speaker,
    details: support
  };
}

export default VoiceCallManager;