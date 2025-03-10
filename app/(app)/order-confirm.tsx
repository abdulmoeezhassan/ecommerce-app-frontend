import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const OrderConfirmationScreen = ({ navigation }) => {
  const handleDone = () => {
    // Navigate to the next screen or close the flow
    navigation.navigate('Home');
  };

  const handleBackToHome = () => {
    // Navigate back to home screen
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Checkmark Circle */}
        <View style={styles.checkCircle}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        
        {/* Confirmation Text */}
        <Text style={styles.confirmationText}>Your Order is Confirmed</Text>
        <Text style={styles.thankYouText}>Thank for your Order</Text>
        
        {/* Done Button */}
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
        
        {/* Back to Home Link */}
        <TouchableOpacity onPress={handleBackToHome}>
          <Text style={styles.backToHomeText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '80%',
  },
  checkCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#0000FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkmark: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  confirmationText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  thankYouText: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginBottom: 20,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToHomeText: {
    color: '#0000FF',
    fontSize: 14,
  },
});

export default OrderConfirmationScreen;