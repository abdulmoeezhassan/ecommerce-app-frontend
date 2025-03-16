import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { AntDesign, Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, usePathname } from "expo-router";
import axios from "axios";
import { useSession } from "@/components/ctx";

const API_BASE_URL = "http://localhost:3000";

interface UserData {
  imagePath?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

const CustomDrawerContent = (props) => {
  const [userData, setUserData] = useState<UserData>({});
  const pathname = usePathname();
  const [error, setError] = useState(false);

  const getAllOpportunities = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      if (!userId) {
        throw new Error("User id not found!");
      }

      const response = await axios.get(`${API_BASE_URL}/api/users/get-single-user/${userId}`);
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
   localStorage.clear();  
   router.navigate('/sign-in')
  }
  useEffect(() => {
    getAllOpportunities();
  }, []);
  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <DrawerContentScrollView {...props}>
     <View style={styles.userInfoWrapper}>
        <View style={styles.userDetailsWrapper}>
          {userData ? (
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
              <Text style={styles.userName}>John Doe</Text>
              <Text style={styles.userEmail}>john@email.com</Text>
            </View>
          )}
        </View>
      </View>
      <DrawerItem
        icon={({ color, size }) => (
          <AntDesign
            name="user"
            size={size}
            color={pathname == "/profile" ? "#fff" : "#000"}
          />
        )}
        label={"Profile"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/profile" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/profile" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/profile");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons
            name="settings-outline"
            size={size}
            color={pathname == "/settings" ? "#fff" : "#000"}
          />
        )}
        label={"Settings"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/settings" ? "#fff" : "#000" },
        ]}
        style={{
          backgroundColor: pathname == "/settings" ? "#333" : "#fff",
        }}
        onPress={() => {
          router.push("/settings");
        }}
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
          backgroundColor: pathname === "/change-password" ? "#333" : "#fff",
        }}
        onPress={() => router.push("/change-password")}
      />
           <DrawerItem
        icon={({ size }) => (
          <AntDesign className="rotate-180" name="logout" size={size} />
        )}
        label={"Sign Out"}
        labelStyle={[styles.navItemLabel, { color: "black" }]}
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
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{ title: "User", headerShown: true }}
      />
      <Drawer.Screen
        name="(admin-tabs)"
        options={{ title: "Admin", headerShown: true }}
      />
      <Drawer.Screen
        name="(supplier-tabs)"
        options={{ title: "Supplier", headerShown: true }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          headerShown: true,
          headerLeft: () => <BackButton />,
          title: "Settings",
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          headerShown: true,
          headerLeft: () => <BackButton />,
          title: "Profile",
        }}
      />
          <Drawer.Screen
        name="active-orders"
        options={{
          headerShown: true,
          headerLeft: () => <BackButton />,
          title: "Active Orders",
        }}
      />
    
          <Drawer.Screen
        name="past-orders"
        options={{
          headerShown: true,
          headerLeft: () => <BackButton />,
          title: "Past Orders",
        }}
      />
          <Drawer.Screen
        name="custom-design"
        options={{
          headerShown: true,
          headerLeft: () => <BackButton />,
          title: "Custom Design",
        }}
      />
          <Drawer.Screen
        name="supplier-products"
        options={{
          headerShown: true,
          headerLeft: () => <BackButton />,
          title: "Products",
        }}
      />
     <Drawer.Screen
        name="users"
        options={{
          headerShown: true,
          headerLeft: () => <BackButton />,
          title: "Users",
        }}
      />
      <Drawer.Screen
        name="change-password"
        options={{
          headerShown: true,
          headerLeft: () => <BackButton />,
          title: "Update Password",
        }}
      />
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
    justifyContent: "space-between",
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

