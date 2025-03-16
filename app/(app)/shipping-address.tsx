import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  SafeAreaView, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  StatusBar,
  ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../../components/cartcontext';
import NavigationHeader from './navigation-header';
import Toast from 'react-native-toast-message';

const API_BASE_URL = 'https://ecommerce-app-backend-indol.vercel.app/api'; 

const ShippingForm = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { cart, clearCart } = useCart();
  
  // Get parameters from the route
  const cartTotal = params.cartTotal ? parseFloat(params.cartTotal) : 0;
  const supplierId = params.supplierId || '';
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    postalCode: '',
    mobileNumber: '',
    city: '',
    country: 'Pakistan' // Default country
  });

  // Fetch user information when component mounts
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // Get user ID from local storage
        const storedUserId = await AsyncStorage.getItem('user_id');
        
        if (!storedUserId) {
          Toast.show({
            type: 'error',
            text1: 'User not logged in',
            text2: 'Please login to continue',
            position: 'bottom'
          });
          router.replace('/sign-up');
          return;
        }
        
        setUserId(storedUserId);
        
        // Fetch user details to pre-fill the form
        try {
          const response = await axios.get(`${API_BASE_URL}/users/get-single-user/${storedUserId}`);
          
          if (response.data && response.data.data) {
            const userData = response.data.data;
            
            // Pre-fill form with user data i
            setFormData({
              fullName: userData.fullName || '',
              address: userData.address || '',
              postalCode: userData.postalCode || '',
              mobileNumber: userData.mobileNumber || userData.phoneNumber || '',
              city: userData.city || '',
              country: userData.country || 'Pakistan'
            });
          }
        } catch (userError) {
          console.error('Error fetching user data:', userError);
          // Continue with empty form if no user data found
        }
      } catch (error) {
        console.error('Error initializing:', error);
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  // Validate form before submission
  const validateForm = () => {
    // Check required fields
    const requiredFields = ['fullName', 'address', 'postalCode', 'mobileNumber', 'city'];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      const fieldLabels = {
        fullName: 'Full Name',
        address: 'Address',
        postalCode: 'Postal Code',
        mobileNumber: 'Mobile Number',
        city: 'City'
      };
      
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: `Please fill in: ${emptyFields.map(field => fieldLabels[field]).join(', ')}`,
        position: 'bottom',
        visibilityTime: 4000
      });
      return false;
    }
    
    // Validate mobile number format
    const mobileRegex = /^\d{10,12}$/;
    if (!mobileRegex.test(formData.mobileNumber.replace(/[- ]/g, ''))) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Mobile Number',
        text2: 'Please enter a valid 10-12 digit mobile number',
        position: 'bottom'
      });
      return false;
    }
    
    // Validate postal code
    const postalCodeRegex = /^\d{5,6}$/;
    if (!postalCodeRegex.test(formData.postalCode.replace(/[- ]/g, ''))) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Postal Code',
        text2: 'Please enter a valid 5-6 digit postal code',
        position: 'bottom'
      });
      return false;
    }
    
    return true;
  };

  // Submit order and shipping details
  const handleCompleteOrder = async () => {
    // Validate form
    if (!validateForm()) return;
    
    // Check if cart is empty
    if (cart.length === 0) {
      Toast.show({
        type: 'info',
        text1: 'Empty Cart',
        text2: 'Your cart is empty. Add some products before completing your order.',
        position: 'bottom'
      });
      return;
    }
    
    // Check if we have userId
    if (!userId) {
      Toast.show({
        type: 'error',
        text1: 'Authentication Error',
        text2: 'Unable to identify user. Please log in again.',
        position: 'bottom'
      });
      return;
    }
    
    setSubmitting(true);
    try {
      // Format products array for the cart with all selected details
      const products = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        color: item.color || null,
        size: item.size || null,
        quality: item.quality || null,
        price: item.price
      }));
      
      // Create cart with the updated schema format
      const cartData = {
        products: products,
        userId: userId,
        supplierId: supplierId,
        totalAmount: cartTotal
      };
      
      // Create cart in database
      const cartResponse = await axios.post(`${API_BASE_URL}/cart/save`, cartData);
      
      if (!cartResponse.data || !cartResponse.data.cart || !cartResponse.data.cart._id) {
        throw new Error('Failed to create cart');
      }
      
      const cartId = cartResponse.data.cart._id;
      
      // Update user with shipping information
      const userUpdateData = {
        fullName: formData.fullName,
        address: formData.address,
        postalCode: formData.postalCode,
        mobileNumber: formData.mobileNumber,
        city: formData.city,
        country: formData.country
      };
      
      try {
        await axios.put(`${API_BASE_URL}/users/update-user/${userId}`, userUpdateData);
      } catch (userUpdateError) {
        console.error('Error updating user data:', userUpdateError);
        // Continue even if user update fails
      }
      
      // Create the order using the cartId
      const orderData = {
        userId: userId,
        supplierId: supplierId,
        cartId: cartId,
        totalAmount: cartTotal
      };
      
      // Send order to API
      const response = await axios.post(`${API_BASE_URL}/orders/save`, orderData);
      
      if (response.data && response.data.order) {
        // Order was successful
        // Clear the cart
        await clearCart();
        
       
        Toast.show({
          type: 'success',
          text1: 'Order Placed Successfully',
          text2: 'Your order has been placed and will be processed soon.',
          position: 'bottom',
          visibilityTime: 1000,
          onHide: () => {
            // Navigate to order confirmation with order ID
            router.replace({
              pathname: '/order-confirm',
              params: { 
                orderId: response.data.order._id
              }
            });
          }
        });
      } else {
        // Handle API error
        Toast.show({
          type: 'error',
          text1: 'Order Failed',
          text2: response.data.message || 'Failed to place order. Please try again.',
          position: 'bottom'
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Toast.show({
        type: 'error',
        text1: 'Order Failed',
        text2: 'There was an error placing your order. Please try again later.',
        position: 'bottom'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader title="Shipping" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text>Loading shipping information...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <NavigationHeader title="Shipping Information" />
      <ScrollView style={styles.container}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        
        <View style={styles.header}>
          <Text style={styles.stepText}>Shipping</Text>
          <Text style={styles.stepTextInactive}>Order Placed</Text>
        </View>

        <Text style={styles.title}>Shipping Details</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.fullName}
            onChangeText={(text) => handleInputChange('fullName', text)}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Address *</Text>
          <TextInput
            style={styles.input}
            value={formData.address}
            onChangeText={(text) => handleInputChange('address', text)}
            multiline
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Postal Code *</Text>
          <TextInput
            style={styles.input}
            value={formData.postalCode}
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange('postalCode', text)}
            placeholder="Enter 5-6 digit postal code"
            maxLength={6}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Mobile Number *</Text>
          <TextInput
            style={styles.input}
            value={formData.mobileNumber}
            keyboardType="phone-pad"
            onChangeText={(text) => handleInputChange('mobileNumber', text)}
            maxLength={12}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>City *</Text>
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
        
        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.orderSummaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Total Items:</Text>
            <Text style={styles.summaryValue}>{cart.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Total Amount:</Text>
            <Text style={styles.summaryValue}>PKR {cartTotal}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={handleCompleteOrder}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Complete Order</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  orderSummary: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  orderSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ShippingForm;