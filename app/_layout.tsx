import { useRouter } from 'expo-router';  // Import useRouter from expo-router
import "../global.css";
import { Slot } from "expo-router";
import { SessionProvider } from "../components/ctx";
import Toast from 'react-native-toast-message';
import { CartProvider } from "@/components/cartcontext";

export default function Root() {
  const router = useRouter();  // Initialize the router

  // Navigation functions
  const goToCart = () => {
    router.push("/cart"); // Navigate to the Cart screen (assuming the route is '/cart')
  };

  const goToProfile = () => {
    router.push("/profile"); // Navigate to the Profile screen (assuming the route is '/profile')
  };

  return (
    <CartProvider>
      <SessionProvider>
        <Slot />
        <Toast />
      </SessionProvider>
    </CartProvider>
  );
}
