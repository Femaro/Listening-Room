import { Tabs } from "expo-router";
import { Heart, Users, Home, Settings, DollarSign } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  // You can now access safe area values like insets.top and insets.bottom
  // to dynamically adjust your layout for any iPhone model.

  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
            // Dynamically adjust padding to account for the safe area
            paddingTop: 8,
            paddingBottom: insets.bottom + 8,
            height: 90 + insets.bottom, // Dynamically adjust height for safe area
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 10,
          },
          tabBarActiveTintColor: "#0D9488",
          tabBarInactiveTintColor: "#6B7280",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color }) => <Home color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="volunteer"
          options={{
            title: "Volunteer",
            tabBarIcon: ({ color }) => <Heart color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="volunteer-dashboard"
          options={{
            title: "Earnings",
            tabBarIcon: ({ color }) => <DollarSign color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="sessions"
          options={{
            title: "Sessions",
            tabBarIcon: ({ color }) => <Users color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => <Settings color={color} size={24} />,
          }}
        />
      </Tabs>
    </>
  );
}