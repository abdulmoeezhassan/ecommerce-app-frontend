import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import NavigationHeader from '../../navigation-header';

const NotificationScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
 
      <NavigationHeader title="Notification" />
      
      <View style={styles.content}>
        {/* Empty notification bell illustration */}
        <View style={styles.emptyNotificationContainer}>
          <View style={styles.bellBackground}>
            <Ionicons name="notifications-outline" size={60} color="#8c9eff" style={styles.bellIcon} />
            <View style={styles.countCircle}>
              <Text style={styles.countText}>0</Text>
            </View>
          </View>
          
          {/* You can add a message here if needed */}
          <Text style={styles.emptyText}>You have no notifications</Text>
        </View>
        
        {/* Notification Settings Button */}
        {/* <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="notifications" size={18} color="white" />
          <Text style={styles.settingsButtonText}>Notification Setting</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  emptyNotificationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellBackground: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e8eaf6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bellIcon: {
    marginBottom: 5,
  },
  countCircle: {
    position: 'absolute',
    top: 40,
    right: 40,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8c9eff',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: '#9e9e9e',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '80%',
    maxWidth: 250,
  },
  settingsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
});

export default NotificationScreen;