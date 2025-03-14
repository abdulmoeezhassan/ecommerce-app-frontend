import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AccountScreen = () => {
  const router = useRouter();

  const user = {
    name: 'Zee',
    email: 'lisajain@gmail.com',
    profilePic: require('@/assets/images/default-avatar.png'),
  };

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

        <View style={styles.profileSection}>
          <Image source={user.profilePic} style={styles.profilePic} />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/')}>
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

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/')}>
            <Text style={styles.menuTitle}>Change Email or Password</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => router.push('/sign-out')}>
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
});

export default AccountScreen;
