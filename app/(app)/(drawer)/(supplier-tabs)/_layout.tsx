import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FontAwesome } from "@expo/vector-icons";

export default function SupplierTabsLayout() {
  const colorScheme = useColorScheme();

  return (
<Tabs
  screenOptions={{
    tabBarActiveTintColor: "black", // Selected icon color set to black
    tabBarInactiveTintColor: "gray", // Inactive icons remain gray
    tabBarStyle: {
      backgroundColor: "white", // Tab bar background color set to white
      borderTopWidth: 0, // Optional: Remove top border for cleaner look
    },
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarBackground: TabBarBackground,
  }}
>
  <Tabs.Screen
    name="active-orders"
    options={{
      title: "Active Orders",
      tabBarIcon: ({ color }) => (
        <FontAwesome name="shopping-bag" size={24} color={color} />
      ),
    }}
  />

  <Tabs.Screen
    name="past-orders"
    options={{
      title: "Past Orders",
      tabBarIcon: ({ color }) => (
        <FontAwesome name="history" size={24} color={color} />
      ),
    }}
  />

  <Tabs.Screen
    name="supplier-products"
    options={{
      title: "Products",
      tabBarIcon: ({ color }) => (
        <FontAwesome name="cube" size={24} color={color} />
      ),
    }}
  />
<Tabs.Screen
    name="supplier-profile"
    options={{
      title: "Profile",
      tabBarIcon: ({ color }) => (
        <FontAwesome name="user" size={24} color={color} />
      ),
    }}
  />
</Tabs>

  
  );
}
