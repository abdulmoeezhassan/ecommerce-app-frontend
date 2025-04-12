import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import NavigationHeader from './navigation-header';

const OrderConfirmation = () => {
  const router = useRouter();

  const params = useLocalSearchParams();

  const orderId=params.orderId;
  // Current date for the order
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Expected delivery date (5 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const expectedDelivery = deliveryDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Navigation functions
  const handleContinueShopping = () => {
    router.push('/products-listing');
  };
  
  const handleViewOrders = () => {
    router.push('/view-all-orders');
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationHeader title="Order Confirmation" />
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.confirmationBox}>
          <View style={styles.iconContainer}>
            <Feather name="check-circle" size={60} color="#4CAF50" />
          </View>
          
          <Text style={styles.title}>Order Placed Successfully!</Text>
          <Text style={styles.message}>Thank you for your purchase. Your order has been received and is being processed.</Text>
          
          <View style={styles.orderInfoContainer}>
            <View style={styles.orderInfoRow}>
              <Text style={styles.orderInfoLabel}>Order Number:</Text>
              <Text style={styles.orderInfoValue}>{orderId}</Text>
            </View>
            
            <View style={styles.orderInfoRow}>
              <Text style={styles.orderInfoLabel}>Order Date:</Text>
              <Text style={styles.orderInfoValue}>{orderDate}</Text>
            </View>
            
            <View style={styles.orderInfoRow}>
              <Text style={styles.orderInfoLabel}>Expected Delivery:</Text>
              <Text style={styles.orderInfoValue}>{expectedDelivery}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryInfoTitle}>Delivery Information</Text>
            <Text style={styles.deliveryInfoText}>
              Your order will be delivered to the address you provided. You will receive an email with tracking information once your order ships.
            </Text>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={handleContinueShopping}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.viewOrdersButton}
            onPress={handleViewOrders}
          >
            <Text style={styles.viewOrdersText}>View My Orders</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  confirmationBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  orderInfoContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderInfoLabel: {
    fontSize: 14,
    color: '#666',
  },
  orderInfoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  deliveryInfo: {
    marginBottom: 16,
  },
  deliveryInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  deliveryInfoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactInfo: {
    marginBottom: 8,
  },
  contactInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  contactInfoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    marginRight: 8,
  },
  contactButtonText: {
    color: '#1e88e5',
    fontWeight: '500',
  },
  actionsContainer: {
    marginBottom: 30,
  },
  continueShoppingButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  continueShoppingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  viewOrdersButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  viewOrdersText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OrderConfirmation;