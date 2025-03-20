import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome5";

const PendingAccount = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userEmail = await AsyncStorage.getItem("email");
        if (userEmail) {
          setEmail(userEmail);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("email");
      await AsyncStorage.removeItem("user_id");
      await AsyncStorage.removeItem("role");
      
      // Navigate to sign in page
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Icon name="user-clock" size={80} color="black" style={styles.icon} />
        
        <Text style={styles.title}>Account Pending Approval</Text>
        
        <View style={styles.card}>
          <Text style={styles.message}>
            Thank you for registering as a supplier. Your account is currently under review by our admin team.
          </Text>
          
        </View>
        
        <TouchableOpacity 
          style={styles.signInButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signInButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  message: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    marginBottom: 15,
    textAlign: "center",
  },
  emailText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    marginBottom: 15,
    textAlign: "center",
  },
  emailHighlight: {
    fontWeight: "bold",
    color: "#4CAF50",
  },
  infoText: {
    fontSize: 14,
    color: "#777",
    lineHeight: 22,
    textAlign: "center",
  },
  signInButton: {
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PendingAccount;