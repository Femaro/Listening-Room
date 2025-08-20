import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Clock,
  DollarSign,
  Trophy,
  MessageCircle,
  Users,
  Star,
  AlertCircle,
  Power,
  Wifi,
  Signal,
  Smartphone,
} from 'lucide-react-native';
import useUser from '@/utils/auth/useUser';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// iPhone 16 Pro Max detection and optimization
const IPHONE_16_PRO_MAX_SPECS = {
  width: 430,
  height: 932,
  physicalWidth: 1290,
  physicalHeight: 2796,
  pixelRatio: 3,
  dynamicIslandHeight: 37,
  safeAreaTop: 59,
  safeAreaBottom: 34,
};

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function iPhone16ProMaxDetector() {
  const [isIPhone16ProMax, setIsIPhone16ProMax] = useState(false);
  
  useEffect(() => {
    const detectDevice = () => {
      if (Platform.OS === 'ios') {
        // iPhone 16 Pro Max detection
        const isIPhone16PM = 
          (screenWidth === IPHONE_16_PRO_MAX_SPECS.width && 
           screenHeight === IPHONE_16_PRO_MAX_SPECS.height) ||
          (screenWidth === IPHONE_16_PRO_MAX_SPECS.height && 
           screenHeight === IPHONE_16_PRO_MAX_SPECS.width);
        
        setIsIPhone16ProMax(isIPhone16PM);
      }
    };
    
    detectDevice();
  }, []);
  
  return isIPhone16ProMax;
}

function USAccessibilityBanner() {
  return (
    <View style={{
      backgroundColor: '#2563eb',
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    }}>
      <Wifi size={16} color="white" style={{ marginRight: 8 }} />
      <Text style={{
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
      }}>
        ✅ Accessible worldwide • US friends welcome • Global volunteer network
      </Text>
    </View>
  );
}

function iPhone16ProMaxBadge() {
  const isIPhone16ProMax = iPhone16ProMaxDetector();
  
  if (!isIPhone16ProMax) return null;
  
  return (
    <View style={{
      backgroundColor: '#f3e8ff',
      borderColor: '#a855f7',
      borderWidth: 1,
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Smartphone size={20} color="#a855f7" style={{ marginRight: 8 }} />
      <Text style={{
        color: '#6b21a8',
        fontSize: 14,
        fontWeight: '600',
      }}>
        ✨ iPhone 16 Pro Max Optimized Experience
      </Text>
    </View>
  );
}

function DeviceCompatibilityIndicator() {
  return (
    <View style={{
      backgroundColor: '#eff6ff',
      borderColor: '#3b82f6',
      borderWidth: 1,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <View style={{ alignItems: 'center' }}>
          <Smartphone size={24} color="#3b82f6" style={{ marginBottom: 4 }} />
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#3b82f6' }}>
            iPhone 16 Pro Max
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <MessageCircle size={24} color="#3b82f6" style={{ marginBottom: 4 }} />
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#3b82f6' }}>
            iPad
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Users size={24} color="#3b82f6" style={{ marginBottom: 4 }} />
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#3b82f6' }}>
            Desktop
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Signal size={24} color="#3b82f6" style={{ marginBottom: 4 }} />
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#3b82f6' }}>
            Global
          </Text>
        </View>
      </View>
      <Text style={{
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        color: '#3b82f6',
      }}>
        ✅ iPhone 16 Pro Max Optimized • Works worldwide • US accessible
      </Text>
    </View>
  );
}

function RealtimeTimer({ sessionId, onTimeUpdate, onAutoTerminate }) {
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [showTerminationDialog, setShowTerminationDialog] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const isIPhone16ProMax = iPhone16ProMaxDetector();

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
          amount: session.current_amount,
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
        body: JSON.stringify({ action: 'continue' }),
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
        method: 'POST',
      });
      setIsActive(false);
      setShowTerminationDialog(false);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  // iPhone 16 Pro Max specific styling
  const timerFontSize = isIPhone16ProMax ? 72 : 64;
  const cardPadding = isIPhone16ProMax ? 24 : 20;

  if (showTerminationDialog) {
    Alert.alert(
      '5-Minute Session Limit Reached',
      'The initial 5-minute free session has ended. Continue with premium rates (1.5x multiplier) or end the session now.\n\nPremium Rate: $6.00/minute (1.5x standard rate)',
      [
        {
          text: 'End Session',
          style: 'cancel',
          onPress: handleEndSession,
        },
        {
          text: 'Continue (1.5x Rate)',
          onPress: handleContinueSession,
        },
      ]
    );
  }

  return (
    <View style={{
      backgroundColor: 'white',
      borderRadius: 16,
      padding: cardPadding,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
      }}>
        <Text style={{
          fontSize: isIPhone16ProMax ? 24 : 20,
          fontWeight: 'bold',
          color: '#111827',
        }}>
          Active Session Timer
        </Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={{
            width: isIPhone16ProMax ? 12 : 10,
            height: isIPhone16ProMax ? 12 : 10,
            backgroundColor: isActive ? '#10b981' : '#6b7280',
            borderRadius: 6,
            marginRight: 8,
          }} />
          <Text style={{
            fontSize: isIPhone16ProMax ? 16 : 14,
            fontWeight: '500',
            color: isActive ? '#10b981' : '#6b7280',
          }}>
            {isActive ? 'Live' : 'Ended'}
          </Text>
        </View>
      </View>

      {/* Timer Display - Optimized for iPhone 16 Pro Max */}
      <View style={{
        alignItems: 'center',
        marginBottom: 32,
      }}>
        <Text style={{
          fontSize: timerFontSize,
          fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
          fontWeight: 'bold',
          color: '#0d9488',
          marginBottom: 8,
        }}>
          {formatTime(timeSpent)}
        </Text>
        <Text style={{
          fontSize: isIPhone16ProMax ? 18 : 16,
          color: '#6b7280',
        }}>
          Time helping this user
        </Text>
      </View>

      {/* Earnings Display */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
      }}>
        <View style={{
          flex: 1,
          backgroundColor: '#ecfdf5',
          borderRadius: 12,
          padding: isIPhone16ProMax ? 20 : 16,
          marginRight: 8,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}>
            <Trophy size={isIPhone16ProMax ? 22 : 20} color="#059669" style={{ marginRight: 8 }} />
            <Text style={{
              fontSize: isIPhone16ProMax ? 16 : 14,
              fontWeight: '600',
              color: '#065f46',
            }}>
              Points Earned
            </Text>
          </View>
          <Text style={{
            fontSize: isIPhone16ProMax ? 32 : 28,
            fontWeight: 'bold',
            color: '#047857',
          }}>
            {currentPoints}
          </Text>
          <Text style={{
            fontSize: isIPhone16ProMax ? 14 : 12,
            color: '#059669',
          }}>
            40 pts/min base rate
          </Text>
        </View>

        <View style={{
          flex: 1,
          backgroundColor: '#f0fdf4',
          borderRadius: 12,
          padding: isIPhone16ProMax ? 20 : 16,
          marginLeft: 8,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}>
            <DollarSign size={isIPhone16ProMax ? 22 : 20} color="#16a34a" style={{ marginRight: 8 }} />
            <Text style={{
              fontSize: isIPhone16ProMax ? 16 : 14,
              fontWeight: '600',
              color: '#15803d',
            }}>
              Amount Earned
            </Text>
          </View>
          <Text style={{
            fontSize: isIPhone16ProMax ? 32 : 28,
            fontWeight: 'bold',
            color: '#16a34a',
          }}>
            ${currentAmount.toFixed(2)}
          </Text>
          <Text style={{
            fontSize: isIPhone16ProMax ? 14 : 12,
            color: '#16a34a',
          }}>
            100 pts = $10.00
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View>
        <View style={{
          height: isIPhone16ProMax ? 12 : 10,
          backgroundColor: '#e5e7eb',
          borderRadius: 6,
          overflow: 'hidden',
        }}>
          <View style={{
            height: '100%',
            backgroundColor: '#0d9488',
            width: `${Math.min((timeSpent / 300) * 100, 100)}%`,
            borderRadius: 6,
          }} />
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 8,
        }}>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>0:00</Text>
          <Text style={{ fontSize: 12, color: '#6b7280', fontWeight: '500' }}>
            {timeSpent >= 300 ? 'OVERTIME' : 'Auto-ends at 5:00'}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>5:00</Text>
        </View>
      </View>
    </View>
  );
}

function VolunteerStats({ stats }) {
  const isIPhone16ProMax = iPhone16ProMaxDetector();
  const cardPadding = isIPhone16ProMax ? 20 : 16;
  
  const statsData = [
    {
      icon: MessageCircle,
      value: stats.totalSessions || 0,
      label: 'Sessions',
      color: '#0d9488',
    },
    {
      icon: Clock,
      value: `${stats.totalHours || 0}h`,
      label: 'Total Time',
      color: '#059669',
    },
    {
      icon: Trophy,
      value: stats.totalPoints || 0,
      label: 'Points',
      color: '#d97706',
    },
    {
      icon: DollarSign,
      value: `$${stats.totalEarnings || 0}`,
      label: 'Earned',
      color: '#16a34a',
    },
  ];

  return (
    <View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    }}>
      {statsData.map((stat, index) => (
        <View
          key={index}
          style={{
            width: '48%',
            backgroundColor: 'white',
            borderRadius: 12,
            padding: cardPadding,
            marginBottom: 16,
            marginRight: index % 2 === 0 ? '4%' : 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <View>
              <Text style={{
                fontSize: isIPhone16ProMax ? 28 : 24,
                fontWeight: 'bold',
                color: stat.color,
                marginBottom: 4,
              }}>
                {stat.value}
              </Text>
              <Text style={{
                fontSize: isIPhone16ProMax ? 14 : 12,
                color: '#6b7280',
              }}>
                {stat.label}
              </Text>
            </View>
            <stat.icon size={isIPhone16ProMax ? 32 : 28} color={stat.color} />
          </View>
        </View>
      ))}
    </View>
  );
}

function AvailabilityToggle({ availability, onToggle }) {
  const [isOnline, setIsOnline] = useState(availability?.is_online || false);
  const [isAvailable, setIsAvailable] = useState(availability?.is_available || false);
  const [loading, setLoading] = useState(false);
  const isIPhone16ProMax = iPhone16ProMaxDetector();

  const handleToggleOnline = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/volunteers/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_online: !isOnline,
          is_available: !isOnline ? isAvailable : false,
        }),
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
          is_available: !isAvailable,
        }),
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
      backgroundColor: 'white',
      borderRadius: 16,
      padding: isIPhone16ProMax ? 24 : 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    }}>
      <Text style={{
        fontSize: isIPhone16ProMax ? 22 : 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 20,
      }}>
        Availability Status
      </Text>

      <View style={{ marginBottom: 20 }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Power size={20} color="#6b7280" style={{ marginRight: 12 }} />
            <View>
              <Text style={{
                fontSize: isIPhone16ProMax ? 18 : 16,
                fontWeight: '500',
                color: '#111827',
              }}>
                Online
              </Text>
              <Text style={{
                fontSize: isIPhone16ProMax ? 14 : 12,
                color: '#6b7280',
              }}>
                Visible to seekers
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleToggleOnline}
            disabled={loading}
            style={{
              width: 60,
              height: 32,
              borderRadius: 16,
              backgroundColor: isOnline ? '#0d9488' : '#e5e7eb',
              justifyContent: 'center',
              opacity: loading ? 0.5 : 1,
            }}
          >
            <View style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: 'white',
              marginLeft: isOnline ? 32 : 4,
            }} />
          </TouchableOpacity>
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Users size={20} color="#6b7280" style={{ marginRight: 12 }} />
            <View>
              <Text style={{
                fontSize: isIPhone16ProMax ? 18 : 16,
                fontWeight: '500',
                color: '#111827',
              }}>
                Available for Sessions
              </Text>
              <Text style={{
                fontSize: isIPhone16ProMax ? 14 : 12,
                color: '#6b7280',
              }}>
                Ready to help users
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleToggleAvailable}
            disabled={loading || !isOnline}
            style={{
              width: 60,
              height: 32,
              borderRadius: 16,
              backgroundColor: isAvailable ? '#059669' : '#e5e7eb',
              justifyContent: 'center',
              opacity: (loading || !isOnline) ? 0.5 : 1,
            }}
          >
            <View style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: 'white',
              marginLeft: isAvailable ? 32 : 4,
            }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 16,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: isOnline && isAvailable ? '#10b981' : isOnline ? '#f59e0b' : '#6b7280',
            marginRight: 8,
          }} />
          <Text style={{
            fontSize: isIPhone16ProMax ? 16 : 14,
            fontWeight: '500',
            color: '#374151',
          }}>
            {isOnline && isAvailable
              ? 'Active - Ready for sessions'
              : isOnline
                ? 'Online - Not accepting sessions'
                : 'Offline'}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function VolunteerDashboard() {
  const { data: user, loading } = useUser();
  const [activeSession, setActiveSession] = useState(null);
  const [stats, setStats] = useState({});
  const [availability, setAvailability] = useState(null);
  const insets = useSafeAreaInsets();
  const isIPhone16ProMax = iPhone16ProMaxDetector();

  const fetchDashboardData = useCallback(async () => {
    try {
      const sessionsResponse = await fetch('/api/chat-sessions?status=active');
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        if (sessionsData.sessions && sessionsData.sessions.length > 0) {
          setActiveSession(sessionsData.sessions[0]);
        } else {
          setActiveSession(null);
        }
      }

      const statsResponse = await fetch('/api/volunteers/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats || {});
      }

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
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        <StatusBar barStyle="dark-content" />
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <Text style={{
            fontSize: 18,
            color: '#6b7280',
            marginTop: 16,
          }}>
            Loading dashboard...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        <StatusBar barStyle="dark-content" />
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 32,
            width: '100%',
            maxWidth: 400,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }}>
            <AlertCircle size={48} color="#f59e0b" style={{ marginBottom: 16 }} />
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: 16,
              textAlign: 'center',
            }}>
              Access Required
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#6b7280',
              marginBottom: 24,
              textAlign: 'center',
              lineHeight: 24,
            }}>
              Please sign in to access your volunteer dashboard.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // iPhone 16 Pro Max specific padding adjustments
  const headerPaddingTop = isIPhone16ProMax ? insets.top + 20 : insets.top + 16;
  const contentPadding = isIPhone16ProMax ? 20 : 16;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <StatusBar barStyle="dark-content" />
      
      {/* US Accessibility Banner */}
      <USAccessibilityBanner />
      
      {/* iPhone 16 Pro Max Optimized Header */}
      <View style={{
        backgroundColor: 'white',
        paddingTop: headerPaddingTop,
        paddingHorizontal: contentPadding,
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <View>
            <Text style={{
              fontSize: isIPhone16ProMax ? 28 : 24,
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: 4,
            }}>
              Volunteer Dashboard
            </Text>
            <Text style={{
              fontSize: isIPhone16ProMax ? 18 : 16,
              color: '#6b7280',
            }}>
              Welcome back, {user.name || 'Volunteer'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Star size={isIPhone16ProMax ? 28 : 24} color="#f59e0b" style={{ marginRight: 8 }} />
            <Text style={{
              fontSize: isIPhone16ProMax ? 20 : 18,
              fontWeight: 'bold',
              color: '#111827',
            }}>
              {stats.rating || '5.0'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: contentPadding,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* iPhone 16 Pro Max Badge */}
        <iPhone16ProMaxBadge />
        
        {/* Device Compatibility Indicator */}
        <DeviceCompatibilityIndicator />

        {/* Availability Toggle */}
        <AvailabilityToggle 
          availability={availability} 
          onToggle={fetchDashboardData}
        />

        {/* Stats */}
        <VolunteerStats stats={stats} />

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
            backgroundColor: 'white',
            borderRadius: 16,
            padding: isIPhone16ProMax ? 32 : 24,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}>
            <MessageCircle size={isIPhone16ProMax ? 64 : 48} color="#9ca3af" style={{ marginBottom: 16 }} />
            <Text style={{
              fontSize: isIPhone16ProMax ? 22 : 20,
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: 8,
              textAlign: 'center',
            }}>
              No Active Sessions
            </Text>
            <Text style={{
              fontSize: isIPhone16ProMax ? 18 : 16,
              color: '#6b7280',
              marginBottom: 24,
              textAlign: 'center',
              lineHeight: 24,
            }}>
              {availability?.is_available
                ? "You're available for new sessions. Users will be matched with you automatically."
                : "Set yourself as available to start helping users."}
            </Text>
            {!availability?.is_available && (
              <TouchableOpacity
                onPress={fetchDashboardData}
                style={{
                  backgroundColor: '#0d9488',
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 12,
                  minHeight: 48,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  color: 'white',
                  fontSize: isIPhone16ProMax ? 18 : 16,
                  fontWeight: '600',
                }}>
                  Refresh Status
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}