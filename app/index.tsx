import { View, Text, Button } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { useNavigationState } from "@react-navigation/native";

export default function HomePage() {
  const routesLength = useNavigationState((state) => state.routes);
  console.log("routesLength", routesLength);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 30 }}>Welcome to our app</Text>
      <Link href={"/sign-in"}>
        <Text style={{ fontSize: 18 }}>Go to About Page</Text>
      </Link>
      <Link href={"/sign-out"} asChild>
        <Button title="Go to Blog Page" />
      </Link>
      <Link href={"/product-detail"} asChild>
        <Button title="Go to product detail Page" />
      </Link>
      <Link href={"/order-confirm"} asChild>
        <Button title="Go to Order Confirm Page" />
      </Link>

      <Link href={"/products-listing"} asChild>
        <Button title="Go to Product Listing Page" />
      </Link>
      <Link href={"/(app)/(drawer)/(tabs)"} asChild>
        <Button title="Go to Tabs" />
      </Link>
    </View>
  );
}
