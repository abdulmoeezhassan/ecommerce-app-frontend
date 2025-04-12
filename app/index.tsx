import { useEffect } from "react";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

// Prevent the splash screen from auto-hiding too early
SplashScreen.preventAutoHideAsync();

export default function Index() {
  useEffect(() => {
    const prepare = async () => {
      // Wait until you’re ready to navigate
      await SplashScreen.hideAsync();
    };

    prepare();
  }, []);

  return <Redirect href="/welcome-one" />;
}
