import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, SafeAreaView ,StyleSheet, TouchableOpacity, ActivityIndicator ,StatusBar} from 'react-native';
import NavigationHeader from './navigation-header';
const ShippingForm = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    pinCode: '',
    mobileNumber: '',
    city: '',
    country: ''
  });

  // Fetch initial shipping data when component mounts
  useEffect(() => {
    fetchShippingData();
  }, []);

  const fetchShippingData = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch('https://localhost/shipping');
      const data = await response.json();
      
      // Update form with data from API
      setFormData({
        fullName: data.fullName || '',
        address: data.address || '',
        pinCode: data.pinCode || '',
        mobileNumber: data.mobileNumber || '',
        city: data.city || '',
        country: data.country || ''
      });
    } catch (error) {
      console.error('Error fetching shipping data:', error);
      // Handle error state here
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleContinue = async () => {
    setSubmitting(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch('https://api.yourbackend.com/shipping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Navigate to payment screen or next step
        console.log('Successfully updated shipping info');
        // navigation.navigate('Payment'); // Uncomment and adjust when using React Navigation
      } else {
        // Handle API errors
        console.error('Failed to update shipping info:', result);
      }
    } catch (error) {
      console.error('Error updating shipping data:', error);
      // Handle error state here
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading shipping information...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
          <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={styles.header}>
      <NavigationHeader title="Shipping" />
        
        {/* Shipping Steps */}
        <Text style={styles.stepText}>Shipping</Text>
        <Text style={styles.stepTextInactive}>Payment</Text>
        <Text style={styles.stepTextInactive}>Order Placed</Text>
      </View>

      <Text style={styles.title}>Shipping</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={formData.fullName}
          onChangeText={(text) => handleInputChange('fullName', text)}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={formData.address}
          onChangeText={(text) => handleInputChange('address', text)}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Pin Code</Text>
        <TextInput
          style={styles.input}
          value={formData.pinCode}
          keyboardType="numeric"
          onChangeText={(text) => handleInputChange('pinCode', text)}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          value={formData.mobileNumber}
          keyboardType="phone-pad"
          onChangeText={(text) => handleInputChange('mobileNumber', text)}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          value={formData.city}
          onChangeText={(text) => handleInputChange('city', text)}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Country</Text>
        <TextInput
          style={styles.input}
          value={formData.country}
          onChangeText={(text) => handleInputChange('country', text)}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.continueButton} 
        onPress={handleContinue}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue to pay</Text>
        )}
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  stepText: {
    fontWeight: 'bold',
  },
  stepTextInactive: {
    color: '#ccc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontSize: 16,
    paddingBottom: 5,
  },
  continueButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ShippingForm;