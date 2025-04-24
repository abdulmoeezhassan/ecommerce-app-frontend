import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { AntDesign, Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, usePathname } from "expo-router";
import axios from "axios";
import { useSession } from "@/components/ctx";

const API_BASE_URL = 'https://ecommerce-app-backend-indol.vercel.app/api/';

interface UserData {
  imagePath?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

const CustomDrawerContent = (props) => {
  const [userData, setUserData] = useState<UserData>({});
  const [userId, setUserId] = useState<string | null>(null);
  const pathname = usePathname();
  const [error, setError] = useState(false);

  const getAllOpportunities = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("user_id");
      setUserId(storedUserId);
      if (!userId) {
        throw new Error("User id not found!");
      }

      const response = await axios.get(`${API_BASE_URL}users/get-single-user/${userId}`);
      setUserData(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    }
  };
  const capitalizeFirstLetter = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  function signOut() {
    AsyncStorage.clear();
    router.push('/sign-in')
  }

  useEffect(() => {
    getAllOpportunities();
  }, []);
  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ backgroundColor: "white", flex: 1 }} // Ensure white background
    >
      <View style={[styles.userInfoWrapper, { backgroundColor: "white" }]}>
        <View style={styles.userDetailsWrapper}>
          {userData && userId && userData.email && userData.firstName && userData.lastName ? (
            <View style={styles.userRow}>
              <View className="flex flex-row items-center">
                <Image
                  source={
                    error || !userData?.imagePath
                      ? require("@/assets/images/user-placeholder-img.png")
                      : { uri: userData?.imagePath }
                  }
                  style={styles.icon}
                  onError={() => setError(true)}
                />
                <View style={styles.userTextWrapper}>
                  <Text style={styles.userName}>
                    {capitalizeFirstLetter(
                      userData?.firstName + " " + userData?.lastName
                    )}
                  </Text>
                  <Text style={styles.userEmail}>{userData?.email}</Text>
                </View>
              </View>
              <FontAwesome
                name="pencil"
                size={18}
                color="black"
                onPress={() => router.push("/profile")}
              />
            </View>
          ) : (
            <View>
              {/* <Text style={styles.userName}>Guest</Text> */}
            </View>
          )}
        </View>
      </View>

      <DrawerItem
        icon={({ size }) => (
          <AntDesign
            name="user"
            size={size}
            color={pathname === "/profile" ? "#fff" : "#000"}
          />
        )}
        label={"Profile"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname === "/profile" ? "#fff" : "#000" },
        ]}
        style={{
          backgroundColor: pathname === "/profile" ? "#333" : "white",
        }}
        onPress={() => router.push("/profile")}
      />

      <DrawerItem
        icon={({ size }) => (
          <Ionicons
            name="settings-outline"
            size={size}
            color={pathname === "/settings" ? "#fff" : "#000"}
          />
        )}
        label={"Settings"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname === "/settings" ? "#fff" : "#000" },
        ]}
        style={{
          backgroundColor: pathname === "/settings" ? "#333" : "white",
        }}
        onPress={() => router.push("/settings")}
      />

      <DrawerItem
        icon={({ size }) => (
          <MaterialIcons
            name="password"
            size={size}
            color={pathname === "/change-password" ? "#fff" : "#000"}
          />
        )}
        label={"Change Password"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname === "/change-password" ? "#fff" : "#000" },
        ]}
        style={{
          backgroundColor: pathname === "/change-password" ? "#333" : "white",
        }}
        onPress={() => router.push("/change-password")}
      />

      <DrawerItem
        icon={({ size }) => (
          <AntDesign className="rotate-180" name="logout" size={size} />
        )}
        label={"Sign Out"}
        labelStyle={[styles.navItemLabel, { color: "black" }]}
        style={{ backgroundColor: "white" }}
        onPress={signOut}
      />
    </DrawerContentScrollView>

  );
};

function BackButton() {
  return (
    <AntDesign
      className="m-5"
      name="arrowleft"
      size={24}
      onPress={() => router.back()}
    />
  );
}

export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "white" }, // Set header background to white
        headerTitleStyle: { color: "black" }, // Set title text color to black
        headerTintColor: "black", // Set back button color to black
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ title: "User" }} />
      <Drawer.Screen name="(admin-tabs)" options={{ title: "Admin" }} />
      <Drawer.Screen name="(supplier-tabs)" options={{ title: "Supplier" }} />
      <Drawer.Screen
        name="settings"
        options={{
          title: "Settings",
          headerLeft: () => <BackButton />,
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: "Profile",
          headerLeft: () => <BackButton />,
        }}
      />
      <Drawer.Screen
        name="active-orders"
        options={{
          title: "Active Orders",
          headerLeft: () => <BackButton />,
        }}
      />
      <Drawer.Screen
        name="past-orders"
        options={{
          title: "Past Orders",
          headerLeft: () => <BackButton />,
        }}
      />
      <Drawer.Screen
        name="supplier-profile"
        options={{
          title: "Profile",
          headerLeft: () => <BackButton />,
        }}
      />
      <Drawer.Screen
        name="view-all-orders"
        options={{
          title: "View All Orders",
          headerLeft: () => <BackButton />,
        }}
      />
      <Drawer.Screen
        name="supplier-products"
        options={{
          title: "Products",
          headerLeft: () => <BackButton />,
        }}
      />
      <Drawer.Screen
        name="users"
        options={{
          title: "Users",
          headerLeft: () => <BackButton />,
        }}
      />
      <Drawer.Screen
        name="change-password"
        options={{
          title: "Update Password",
          headerLeft: () => <BackButton />,
        }}
      />
      {/* <Drawer.Screen
        name="welcome1"
      />
        <Drawer.Screen
        name="welcome2"
        /> */}
    </Drawer>
  );

}


const styles = StyleSheet.create({
  navItemLabel: {
    fontSize: 18,
  },
  userInfoWrapper: {
    flexDirection: "row",
    paddingVertical: 20,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  userImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userDetailsWrapper: {
    marginTop: 10,
    marginLeft: 5,
    flex: 1,
    alignItems: "center",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userTextWrapper: {
    marginLeft: 10,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  userEmail: {
    fontSize: 14,
    color: "gray",
  },
});

