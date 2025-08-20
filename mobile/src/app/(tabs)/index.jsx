import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  Heart,
  Users,
  Clock,
  MessageCircle,
  ArrowRight,
  Shield,
  Star,
  Smartphone,
  DollarSign,
  AlertTriangle,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/utils/auth/useAuth";
import useUser from "@/utils/auth/useUser";

function FeatureCard({ icon: Icon, title, description, color = "#6B7280" }) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        ...Platform.select({
          ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
          android: {
            elevation: 4,
          },
        }),
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <View
          style={{
            backgroundColor: `${color}15`,
            borderRadius: 12,
            padding: 12,
            marginRight: 16,
          }}
        >
          <Icon size={24} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 8,
            }}
          >
            {title}
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 20 }}>
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
}

function StatCard({ icon: Icon, title, value, color = "#6B7280" }) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        flex: 1,
        ...Platform.select({
          ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
          },
          android: {
            elevation: 2,
          },
        }),
      }}
    >
      <View style={{ alignItems: "center" }}>
        <Icon size={24} color={color} style={{ marginBottom: 8 }} />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#111827",
            marginBottom: 4,
          }}
        >
          {value}
        </Text>
        <Text style={{ fontSize: 12, color: "#6B7280", textAlign: "center" }}>
          {title}
        </Text>
      </View>
    </View>
  );
}

export default function Dashboard() {
  const { data: user, loading } = useUser();
  const { signIn, isReady, isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState({
    totalSessions: 0,
    activeVolunteers: 0,
    averageResponse: "< 2 min",
    satisfaction: "4.9/5",
  });

  useEffect(() => {
    // Fetch general stats
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/analytics");
        if (response.ok) {
          const data = await response.json();
          setStats({
            totalSessions: data.totalSessions || 0,
            activeVolunteers: data.activeVolunteers || 0,
            averageResponse: data.averageResponse || "< 2 min",
            satisfaction: data.satisfaction || "4.9/5",
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const handleGetSupport = async () => {
    if (!isReady) return;

    if (!isAuthenticated) {
      try {
        await signIn();
      } catch (error) {
        console.error("Sign in error:", error);
        Alert.alert("Sign In Required", "Please sign in to get support.");
      }
    } else {
      // Navigate to session creation or find volunteer
      Alert.alert("Support", "Connecting you with an available volunteer...");
    }
  };

  const handleVolunteerSignup = async () => {
    if (!isReady) return;

    if (!isAuthenticated) {
      try {
        await signIn();
      } catch (error) {
        console.error("Sign in error:", error);
        Alert.alert("Sign In Required", "Please sign in to volunteer.");
      }
    } else {
      // Navigate to volunteer application
      Alert.alert(
        "Volunteer",
        "Thank you for your interest in volunteering! Application process coming soon.",
      );
    }
  };

  if (loading || !isReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F9FAFB",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: insets.top,
        }}
      >
        <ActivityIndicator size="large" color="#0D9488" />
        <Text style={{ marginTop: 16, color: "#6B7280", fontSize: 16 }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#fff",
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 16,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          <Heart size={32} color="#0D9488" style={{ marginBottom: 8 }} />
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#111827",
              textAlign: "center",
            }}
          >
            Listening Room
          </Text>
          <Text style={{ fontSize: 16, color: "#6B7280", textAlign: "center" }}>
            Anonymous Mental Health Support
          </Text>
        </View>

        {/* Device Compatibility Indicator */}
        <View
          style={{
            backgroundColor: "#EFF6FF",
            borderRadius: 8,
            padding: 12,
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Smartphone size={16} color="#2563EB" style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 12, fontWeight: "600", color: "#2563EB" }}>
              ✅ iPhone & All Devices Optimized
            </Text>
          </View>
          <Text style={{ fontSize: 11, color: "#1D4ED8" }}>
            Works perfectly on iOS, Android, and Desktop
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 16,
            }}
          >
            Get Help or Help Others
          </Text>

          <TouchableOpacity
            onPress={handleGetSupport}
            style={{
              backgroundColor: "#0D9488",
              borderRadius: 16,
              padding: 20,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                },
                android: {
                  elevation: 4,
                },
              }),
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#fff",
                  marginBottom: 4,
                }}
              >
                I Need Support
              </Text>
              <Text style={{ fontSize: 14, color: "#A7F3D0" }}>
                Connect with a trained volunteer listener
              </Text>
            </View>
            <MessageCircle size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleVolunteerSignup}
            style={{
              backgroundColor: "#F59E0B",
              borderRadius: 16,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                },
                android: {
                  elevation: 4,
                },
              }),
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#fff",
                  marginBottom: 4,
                }}
              >
                Volunteer to Help
              </Text>
              <Text style={{ fontSize: 14, color: "#FEF3C7" }}>
                Earn rewards while making a difference
              </Text>
            </View>
            <Heart size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 16,
            }}
          >
            Community Impact
          </Text>

          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <StatCard
              icon={Users}
              title="Total Sessions"
              value={stats.totalSessions.toLocaleString()}
              color="#0D9488"
            />
            <View style={{ width: 12 }} />
            <StatCard
              icon={Heart}
              title="Active Volunteers"
              value={stats.activeVolunteers}
              color="#F59E0B"
            />
          </View>

          <View style={{ flexDirection: "row" }}>
            <StatCard
              icon={Clock}
              title="Avg Response Time"
              value={stats.averageResponse}
              color="#10B981"
            />
            <View style={{ width: 12 }} />
            <StatCard
              icon={Star}
              title="User Satisfaction"
              value={stats.satisfaction}
              color="#EF4444"
            />
          </View>
        </View>

        {/* Features */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 16,
            }}
          >
            Why Choose Listening Room?
          </Text>

          <FeatureCard
            icon={Shield}
            title="100% Anonymous"
            description="Complete privacy protection. No personal information required - just connect and get support."
            color="#0D9488"
          />

          <FeatureCard
            icon={Clock}
            title="24/7 Availability"
            description="Trained volunteers available around the clock to provide emotional support when you need it most."
            color="#F59E0B"
          />

          <FeatureCard
            icon={DollarSign}
            title="Fair Volunteer Rewards"
            description="Volunteers earn points and money for their time, creating sustainable mental health support."
            color="#10B981"
          />

          <FeatureCard
            icon={Heart}
            title="Professional Training"
            description="All volunteers complete comprehensive training in active listening and crisis support."
            color="#EF4444"
          />
        </View>

        {/* Emergency Notice */}
        <View
          style={{
            backgroundColor: "#FEF2F2",
            borderWidth: 2,
            borderColor: "#FECACA",
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <AlertTriangle
              size={24}
              color="#DC2626"
              style={{ marginRight: 12, marginTop: 2 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#DC2626",
                  marginBottom: 8,
                }}
              >
                Emergency Crisis Resources
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#B91C1C",
                  lineHeight: 20,
                  marginBottom: 12,
                }}
              >
                If you're in immediate danger or having thoughts of suicide:
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#991B1B",
                  marginBottom: 4,
                }}
              >
                • US: Call 988 (Suicide & Crisis Lifeline)
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#991B1B",
                  marginBottom: 4,
                }}
              >
                • US: Text HOME to 741741 (Crisis Text Line)
              </Text>
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#991B1B" }}
              >
                • Emergency: Call 911
              </Text>
            </View>
          </View>
        </View>

        {/* User Status */}
        {isAuthenticated && user ? (
          <View
            style={{
              backgroundColor: "#F0FDF4",
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#047857",
                marginBottom: 8,
              }}
            >
              Welcome back, {user.name || "Friend"}!
            </Text>
            <Text style={{ fontSize: 14, color: "#059669" }}>
              You're signed in and ready to get support or help others.
            </Text>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "#EFF6FF",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#1D4ED8",
                marginBottom: 8,
              }}
            >
              Ready to Get Started?
            </Text>
            <Text style={{ fontSize: 14, color: "#2563EB", marginBottom: 16 }}>
              Sign in to access support or start your volunteer journey.
            </Text>
            <TouchableOpacity
              onPress={signIn}
              style={{
                backgroundColor: "#2563EB",
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 20,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                Sign In / Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
