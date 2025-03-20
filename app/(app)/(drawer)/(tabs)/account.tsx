import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'https://ecommerce-app-backend-indol.vercel.app/api/';
interface UserData {
  imagePath?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}
const AccountScreen = () => {
  const router = useRouter();
    const [userData, setUserData] = useState<UserData>({});
    const [error, setError] = useState(false);
  
  const getAllOpportunities = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
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

  useEffect(() => {
    getAllOpportunities();
  }, []);
  // const user = {
  //   name: 'Zee',
  //   email: 'admin@gmail.com',
  //   profilePic: require('@/assets/images/default-avatar.png'),
  // };

    function signOut() {
     AsyncStorage.clear();  
     router.push('/sign-in')
    }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Account</Text>
          <View style={{ width: 24 }} />
        </View>
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
            {/* <FontAwesome
              name="pencil"
              size={18}
              color="black"
              onPress={() => router.push("/profile")}
            /> */}
          </View>
        ) : (
          <View>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john@email.com</Text>
          </View>
        )}
</View>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/view-all-orders')}>
            <Text style={styles.menuTitle}>My Order</Text>
            <View style={styles.rightContent}>
              <Text style={styles.viewAllText}>View all orders</Text>
              <MaterialIcons name="keyboard-arrow-right" size={24} color="#888" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile')}>
            <Text style={styles.menuTitle}>Update Profile</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/')}>
            <Text style={styles.menuTitle}>My Addresses</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings')}>
            <Text style={styles.menuTitle}>Settings</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/forgot-password')}>
            <Text style={styles.menuTitle}>Change Email or Password</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/sign-up')}>
            <Text style={styles.menuTitle}>Signup or Login</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Log Out</Text>
          <Feather name="log-out" size={18} color="white" style={styles.logoutIcon} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  profileSection: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  profilePic: { width: 60, height: 60, borderRadius: 30, marginRight: 16 },
  userInfo: { justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  email: { fontSize: 14, color: '#666' },
  menuContainer: { marginTop: 16 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 8 },
  menuTitle: { fontSize: 16 },
  rightContent: { flexDirection: 'row', alignItems: 'center' },
  viewAllText: { fontSize: 14, color: '#888', marginRight: 8 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black', marginHorizontal: 20, marginVertical: 20, paddingVertical: 16, borderRadius: 30 },
  logoutText: { color: 'white', fontSize: 16, fontWeight: '600', marginRight: 8 },
  logoutIcon: { marginLeft: 4 },
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
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  userDetailsWrapper: {
    marginTop: 10,
    marginLeft: 5,
    flex: 1,
    alignItems: "center",
  },
});

export default AccountScreen;
