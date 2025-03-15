import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

// Define Product Type with supplierId
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  supplierId?: string;  // Added supplierId
  // Other optional fields that might be in the product
  color?: string;
  size?: string;
  quality?: string;
  image?: string;
}

// Define Context Type
interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => Promise<boolean>; // Returns success status
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  getCartSupplierId: () => string | null; // Get current cart supplier ID
}

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider Component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);

  // Load cart from AsyncStorage when the app starts
  useEffect(() => {
    const loadCart = async () => {
      const storedCart = await AsyncStorage.getItem("cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    };
    loadCart();
  }, []);

  // Save cart to AsyncStorage
  const saveCartToStorage = async (updatedCart: Product[]) => {
    setCart(updatedCart);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Get the current cart supplier ID
  const getCartSupplierId = (): string | null => {
    if (cart.length === 0) return null;
    
    // Find first product with a supplierId
    const productWithSupplierId = cart.find(item => item.supplierId);
    return productWithSupplierId?.supplierId || null;
  };

  // Add product to cart with supplier validation
  const addToCart = async (product: Product): Promise<boolean> => {
    // Check if product has a supplierId
    if (!product.supplierId) {
      // If no supplierId, we'll allow it (legacy support)
      return addProductToCart(product);
    }

    // Get current cart supplier ID
    const currentSupplierId = getCartSupplierId();

    // If cart is empty or supplier matches, add product
    if (!currentSupplierId || currentSupplierId === product.supplierId) {
      return addProductToCart(product);
    } else {
      // Different supplier - show error
      Alert.alert(
        "Cannot Add Product",
        "You can only add products from the same supplier in a single order. Please complete your current order or clear your cart before adding products from a different supplier.",
        [{ text: "OK" }]
      );
      return false;
    }
  };

  // Helper function to add product to cart after validation
  const addProductToCart = async (product: Product): Promise<boolean> => {
    const existingProduct = cart.find((item) => item.id === product.id);
    let updatedCart: Product[];

    if (existingProduct) {
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + product.quantity } : item
      );
    } else {
      // Ensure product has at least quantity 1
      const newProduct = { ...product, quantity: product.quantity || 1 };
      updatedCart = [...cart, newProduct];
    }

    await saveCartToStorage(updatedCart);
    return true;
  };

  // Remove product from cart
  const removeFromCart = async (productId: string) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    saveCartToStorage(updatedCart);
  };

  // Increase product quantity
  const increaseQuantity = async (productId: string) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    saveCartToStorage(updatedCart);
  };

  // Decrease product quantity (remove if quantity is 1)
  const decreaseQuantity = async (productId: string) => {
    const updatedCart = cart
      .map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0); // Remove items with 0 quantity

    saveCartToStorage(updatedCart);
  };

  // Clear cart
  const clearCart = async () => {
    setCart([]);
    await AsyncStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      increaseQuantity, 
      decreaseQuantity, 
      clearCart,
      getCartSupplierId
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};