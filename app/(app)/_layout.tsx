import "../../gesture-handler";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useCallback, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSession } from "@/components/ctx";
import { View, Text } from "react-native";

// Prevent splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { session, isLoading } = useSession();
  const [isAppReady, setAppReady] = useState(false);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && !isLoading) {
      setAppReady(true);
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  useEffect(() => {
    onLayoutRootView();
  }, [fontsLoaded, isLoading]);

  if (!fontsLoaded || isLoading || !isAppReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name={"(drawer)"} options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}














// import "../../gesture-handler";
// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
// import { useFonts } from "expo-font";
// import { Redirect, Stack } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import { StatusBar } from "expo-status-bar";
// import { useEffect } from "react";
// import "react-native-reanimated";
// import { useColorScheme } from "@/hooks/useColorScheme";
// import { useSession } from "@/components/ctx";
// import { Text } from "react-native";

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function AppLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
//   });
//   let { session, isLoading } = useSession();

//   // You can keep the splash screen open, or render a loading screen like we do here.
//   if (isLoading) {
//     return <Text>Loading...</Text>;
//   }
//   // Only require authentication within the (app) group's layout as users
//   // need to be able to access the (auth) group and sign in again.
//   if (!session) {
//     // On web, static rendering will stop here as the user is not authenticated
//     // in the headless Node process that the pages are rendered in.
//     return <Redirect href="/sign-in" />;
//   }

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
//       <StatusBar style="auto" />
//       <Stack>
//         <Stack.Screen name={"(drawer)"} options={{ headerShown: false }} />
//       </Stack>
//     </ThemeProvider>
//   );
// }




// import "../../gesture-handler";
// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
// import { useFonts } from "expo-font";
// import { Stack } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import { StatusBar } from "expo-status-bar";
// import { useEffect } from "react";
// import "react-native-reanimated";
// import { useColorScheme } from "@/hooks/useColorScheme";

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function AppLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
//   });

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
//       <StatusBar style="auto" />
//       <Stack>
//         <Stack.Screen name={"(drawer)"} options={{ headerShown: false }} />
//       </Stack>
//     </ThemeProvider>
//   );
// }
