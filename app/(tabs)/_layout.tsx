// Main tab navigation for the application using expo router. Tabs syling is also connected to the apps light
// and dark theme settings
import { Tabs } from "expo-router";
import React from "react";
// Phone makes small vibration when user presses a new tab, makes my app feel more responsive
import { HapticTab } from "@/components/haptic-tab"; // tab icons
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
// defines tab layout for entire applicaion 
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // set active tab colour depenging on if the app is in light or dark mode
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false, // hide header for cleaner layout
        tabBarButton: HapticTab,
      }}
    > 
    {/* Home Screen */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} /> // house icon for home
          ),
        }}
      />
{/* Opens Habit Screen where user manages daily habits */}
      <Tabs.Screen
        name="habits"
        options={{
          title: "Habits",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="checkmark.circle.fill" color={color} />
          ),
        }}
      />
{/* Screen where user logs acitiivity  */}
      <Tabs.Screen
        name="log"
        options={{
          title: "Log",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="plus.circle.fill" color={color} />
          ),
        }}
      />
{/* Insights Screen */}
      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="chart.bar.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}