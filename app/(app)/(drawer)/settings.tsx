import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const SettingsMenu = () => {
  return (
    <View style={styles.container}>
      {/* Logout Option */}
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.iconContainer}>
          <Ionicons name="log-out-outline" size={22} color="black" />
        </View>
        <Text style={styles.menuItemText}>Logout</Text>
      </TouchableOpacity>

      {/* Delete Account Option */}
      {/* <TouchableOpacity style={styles.menuItem}>
        <View style={styles.iconContainer}>
          <Ionicons name="trash-outline" size={22} color="black" />
        </View>
        <Text style={styles.menuItemText}>Delete Account</Text>
      </TouchableOpacity> */}

      {/* Change Password Option */}
      <TouchableOpacity style={styles.menuItem}
        onPress={() => router.push('/change-password')}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed-outline" size={22} color="black" />
        </View>
        <Text style={styles.menuItemText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 16,
  },
});

export default SettingsMenu;