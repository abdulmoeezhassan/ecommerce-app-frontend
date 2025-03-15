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
      tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      headerShown: false,
      tabBarButton: HapticTab,
      tabBarBackground: TabBarBackground,
      tabBarStyle: Platform.select({
        ios: {
          position: "absolute", // Transparent background for blur effect on iOS
        },
        default: {},
      }),
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
  name="custom-design"
  options={{
    title: "Custom Design",
    tabBarIcon: ({ color }) => (
      <FontAwesome name="paint-brush" size={24} color={color} />
    ),
  }}
/>
  </Tabs>
  
  );
}
