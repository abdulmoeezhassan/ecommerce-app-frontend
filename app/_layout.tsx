import { useRouter } from 'expo-router';  // Import useRouter from expo-router
import "../global.css";
import { Slot } from "expo-router";
import { SessionProvider } from "../components/ctx";
import Toast from 'react-native-toast-message';
import { CartProvider } from "@/components/cartcontext";

export default function Root() {
  
  return (
    <CartProvider>
      <SessionProvider>
        <Slot />
        <Toast />
      </SessionProvider>
    </CartProvider>
  );
}
