import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { 
  Clock, 
  DollarSign, 
  Trophy, 
  Users, 
  Star,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  Power,
  Smartphone
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useUser from '@/utils/auth/useUser';

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function RealtimeTimer({ sessionId, onTimeUpdate, onAutoTerminate }) {
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [showTerminationDialog, setShowTerminationDialog] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!sessionId || !isActive) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/chat-sessions/${sessionId}/rewards`);
        if (!response.ok) return;
        
        const data = await response.json();
        const session = data.session;
        
        const newTimeSpent = Math.floor(session.time_spent_minutes * 60);
        setTimeSpent(newTimeSpent);
        setCurrentPoints(session.current_points);
        setCurrentAmount(session.current_amount);
        
        if (session.should_auto_terminate && !showTerminationDialog) {
          setShowTerminationDialog(true);
          onAutoTerminate();
        }
        
        onTimeUpdate({
          time: newTimeSpent,
          points: session.current_points,
          amount: session.current_amount
        });
        
      } catch (error) {
        console.error('Error fetching session rewards:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionId, isActive, onTimeUpdate, onAutoTerminate, showTerminationDialog]);

  const handleContinueSession = async () => {
    try {
      const response = await fetch(`/api/chat-sessions/${sessionId}/rewards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'continue' })
      });
      
      if (response.ok) {
        setShowTerminationDialog(false);
      }
    } catch (error) {
      console.error('Error continuing session:', error);
    }
  };

  const handleEndSession = async () => {
    try {
      await fetch(`/api/chat-sessions/${sessionId}/end`, {
        method: 'POST'
      });
      setIsActive(false);
      setShowTerminationDialog(false);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  return (
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 20,
      marginVertical: 12,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>
          Active Session Timer
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: isActive ? '#10B981' : '#9CA3AF',
            marginRight: 6
          }} />
          <Text style={{ 
            fontSize: 14, 
            fontWeight: '600', 
            color: isActive ? '#10B981' : '#9CA3AF' 
          }}>
            {isActive ? 'Live' : 'Ended'}
          </Text>
        </View>
      </View>

      {/* Timer Display */}
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <Text style={{
          fontSize: 48,
          fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
          fontWeight: 'bold',
          color: '#0D9488',
          marginBottom: 8
        }}>
          {formatTime(timeSpent)}
        </Text>
        <Text style={{ fontSize: 16, color: '#6B7280' }}>
          Time helping this user
        </Text>
      </View>

      {/* Earnings Display */}
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <View style={{
          flex: 1,
          backgroundColor: '#ECFDF5',
          borderRadius: 12,
          padding: 16,
          marginRight: 8
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Trophy size={16} color="#10B981" style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#065F46' }}>
              Points Earned
            </Text>
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#047857' }}>
            {currentPoints}
          </Text>
          <Text style={{ fontSize: 12, color: '#059669' }}>
            40 pts/min base rate
          </Text>
        </View>
        
        <View style={{
          flex: 1,
          backgroundColor: '#F0FDF4',
          borderRadius: 12,
          padding: 16,
          marginLeft: 8
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <DollarSign size={16} color="#22C55E" style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#14532D' }}>
              Amount Earned
            </Text>
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#16A34A' }}>
            ${currentAmount.toFixed(2)}
          </Text>
          <Text style={{ fontSize: 12, color: '#15803D' }}>
            100 pts = $10.00
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={{ marginBottom: 16 }}>
        <View style={{
          backgroundColor: '#E5E7EB',
          height: 8,
          borderRadius: 4,
          overflow: 'hidden'
        }}>
          <View style={{
            backgroundColor: '#0D9488',
            height: '100%',
            width: `${Math.min((timeSpent / 300) * 100, 100)}%`,
          }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          <Text style={{ fontSize: 12, color: '#6B7280' }}>0:00</Text>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280' }}>
            {timeSpent >= 300 ? 'OVERTIME' : 'Auto-ends at 5:00'}
          </Text>
          <Text style={{ fontSize: 12, color: '#6B7280' }}>5:00</Text>
        </View>
      </View>

      {/* Termination Dialog */}
      <Modal
        visible={showTerminationDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTerminationDialog(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 24,
            width: '100%',
            maxWidth: 400
          }}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <AlertTriangle size={48} color="#EA580C" style={{ marginBottom: 16 }} />
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#9A3412', marginBottom: 12 }}>
                5-Minute Session Limit Reached
              </Text>
              <Text style={{ fontSize: 14, color: '#A16207', textAlign: 'center', marginBottom: 16 }}>
                The initial 5-minute free session has ended. Continue with premium rates (1.5x multiplier) 
                or end the session now.
              </Text>
              <View style={{
                backgroundColor: '#FEF3C7',
                borderWidth: 1,
                borderColor: '#FCD34D',
                borderRadius: 8,
                padding: 12,
                marginBottom: 20
              }}>
                <Text style={{ fontSize: 12, color: '#92400E', fontWeight: '600' }}>
                  Premium Rate: $6.00/minute (1.5x standard rate)
                </Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={handleContinueSession}
                style={{
                  flex: 1,
                  backgroundColor: '#EA580C',
                  paddingVertical: 12,
                  borderRadius: 8,
                  marginRight: 8,
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>
                  Continue Session (1.5x Rate)
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleEndSession}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: '#EA580C',
                  paddingVertical: 12,
                  borderRadius: 8,
                  marginLeft: 8,
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: '#EA580C', fontWeight: '600' }}>
                  End Session
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function StatsCard({ icon: Icon, title, value, color = '#6B7280' }) {
  return (
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon size={24} color={color} style={{ marginRight: 12 }} />
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>
            {value}
          </Text>
          <Text style={{ fontSize: 12, color: '#6B7280' }}>
            {title}
          </Text>
        </View>
      </View>
    </View>
  );
}

function AvailabilityToggle({ availability, onToggle }) {
  const [isOnline, setIsOnline] = useState(availability?.is_online || false);
  const [isAvailable, setIsAvailable] = useState(availability?.is_available || false);
  const [loading, setLoading] = useState(false);

  const handleToggleOnline = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/volunteers/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_online: !isOnline,
          is_available: !isOnline ? isAvailable : false
        })
      });
      
      if (response.ok) {
        const newOnline = !isOnline;
        setIsOnline(newOnline);
        if (!newOnline) setIsAvailable(false);
        onToggle();
      }
    } catch (error) {
      console.error('Error updating online status:', error);
    }
    setLoading(false);
  };

  const handleToggleAvailable = async () => {
    if (!isOnline) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/volunteers/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_online: isOnline,
          is_available: !isAvailable
        })
      });
      
      if (response.ok) {
        setIsAvailable(!isAvailable);
        onToggle();
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
    setLoading(false);
  };

  return (
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>
        Availability Status
      </Text>
      
      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Power size={20} color="#6B7280" style={{ marginRight: 12 }} />
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>Online</Text>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>Visible to seekers</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleToggleOnline}
            disabled={loading}
            style={{
              width: 44,
              height: 24,
              borderRadius: 12,
              backgroundColor: isOnline ? '#0D9488' : '#D1D5DB',
              justifyContent: 'center',
              paddingHorizontal: 2,
            }}
          >
            <View style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: '#fff',
              alignSelf: isOnline ? 'flex-end' : 'flex-start',
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                },
                android: {
                  elevation: 2,
                },
              }),
            }} />
          </TouchableOpacity>
        </View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Users size={20} color="#6B7280" style={{ marginRight: 12 }} />
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>Available for Sessions</Text>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>Ready to help users</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleToggleAvailable}
            disabled={loading || !isOnline}
            style={{
              width: 44,
              height: 24,
              borderRadius: 12,
              backgroundColor: isAvailable ? '#10B981' : '#D1D5DB',
              justifyContent: 'center',
              paddingHorizontal: 2,
              opacity: (loading || !isOnline) ? 0.5 : 1,
            }}
          >
            <View style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: '#fff',
              alignSelf: isAvailable ? 'flex-end' : 'flex-start',
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                },
                android: {
                  elevation: 2,
                },
              }),
            }} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={{
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 12
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: isOnline && isAvailable ? '#10B981' : isOnline ? '#F59E0B' : '#9CA3AF',
            marginRight: 8
          }} />
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>
            {isOnline && isAvailable ? 'Active - Ready for sessions' : 
             isOnline ? 'Online - Not accepting sessions' : 'Offline'}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function VolunteerDashboard() {
  const { data: user, loading } = useUser();
  const insets = useSafeAreaInsets();
  const [activeSession, setActiveSession] = useState(null);
  const [stats, setStats] = useState({});
  const [availability, setAvailability] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch active sessions
      const sessionsResponse = await fetch('/api/chat-sessions?status=active');
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        if (sessionsData.sessions && sessionsData.sessions.length > 0) {
          setActiveSession(sessionsData.sessions[0]);
        } else {
          setActiveSession(null);
        }
      }

      // Fetch volunteer stats
      const statsResponse = await fetch('/api/volunteers/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats || {});
      }

      // Fetch availability
      const availabilityResponse = await fetch('/api/volunteers/availability');
      if (availabilityResponse.ok) {
        const availabilityData = await availabilityResponse.json();
        setAvailability(availabilityData.availability);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up heartbeat
    const heartbeat = setInterval(async () => {
      try {
        await fetch('/api/volunteers/availability', { method: 'PATCH' });
      } catch (error) {
        console.error('Heartbeat failed:', error);
      }
    }, 30000);

    return () => clearInterval(heartbeat);
  }, [fetchDashboardData]);

  const handleTimeUpdate = useCallback((timeData) => {
    console.log('Time update:', timeData);
  }, []);

  const handleAutoTerminate = useCallback(() => {
    console.log('Session auto-terminated');
  }, []);

  if (loading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: insets.top
      }}>
        <ActivityIndicator size="large" color="#0D9488" />
        <Text style={{ marginTop: 16, color: '#6B7280', fontSize: 16 }}>
          Loading dashboard...
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: insets.top
      }}>
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 24,
          alignItems: 'center',
          width: '100%',
          maxWidth: 400,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
            },
            android: {
              elevation: 6,
            },
          }),
        }}>
          <AlertTriangle size={48} color="#EA580C" style={{ marginBottom: 16 }} />
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 12 }}>
            Access Required
          </Text>
          <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 24 }}>
            Please sign in to access your volunteer dashboard.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#0D9488',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
              width: '100%',
              alignItems: 'center'
            }}
            onPress={() => {
              // Handle sign in navigation
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{
        backgroundColor: '#fff',
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB'
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>
              Volunteer Dashboard
            </Text>
            <Text style={{ fontSize: 16, color: '#6B7280' }}>
              Welcome back, {user.name || 'Volunteer'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Star size={20} color="#F59E0B" style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
              {stats.rating || '5.0'}
            </Text>
          </View>
        </View>
        
        {/* Device Compatibility Indicator */}
        <View style={{
          backgroundColor: '#EFF6FF',
          borderRadius: 8,
          padding: 12,
          marginTop: 12,
          alignItems: 'center'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Smartphone size={16} color="#2563EB" style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#2563EB' }}>
              ✅ iPhone Optimized
            </Text>
          </View>
          <Text style={{ fontSize: 11, color: '#1D4ED8' }}>
            Fully responsive for all devices and screen sizes
          </Text>
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Availability Toggle */}
        <AvailabilityToggle 
          availability={availability} 
          onToggle={fetchDashboardData}
        />

        {/* Stats */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <StatsCard
              icon={Users}
              title="Sessions"
              value={stats.totalSessions || 0}
              color="#0D9488"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <StatsCard
              icon={Clock}
              title="Total Time"
              value={`${stats.totalHours || 0}h`}
              color="#10B981"
            />
          </View>
        </View>
        
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <StatsCard
              icon={Trophy}
              title="Total Points"
              value={stats.totalPoints || 0}
              color="#F59E0B"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <StatsCard
              icon={DollarSign}
              title="Total Earned"
              value={`$${stats.totalEarnings || 0}`}
              color="#22C55E"
            />
          </View>
        </View>

        {/* Active Session Timer */}
        {activeSession && (
          <RealtimeTimer 
            sessionId={activeSession.id}
            onTimeUpdate={handleTimeUpdate}
            onAutoTerminate={handleAutoTerminate}
          />
        )}

        {/* No Active Session */}
        {!activeSession && (
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 24,
            alignItems: 'center',
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
              },
              android: {
                elevation: 4,
              },
            }),
          }}>
            <Users size={48} color="#9CA3AF" style={{ marginBottom: 16 }} />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
              No Active Sessions
            </Text>
            <Text style={{ 
              fontSize: 14, 
              color: '#6B7280', 
              textAlign: 'center',
              marginBottom: 20
            }}>
              {availability?.is_available ? 
                "You're available for new sessions. Users will be matched with you automatically." :
                "Set yourself as available to start helping users."
              }
            </Text>
            {!availability?.is_available && (
              <TouchableOpacity
                onPress={fetchDashboardData}
                style={{
                  backgroundColor: '#0D9488',
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
                  Refresh Status
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}