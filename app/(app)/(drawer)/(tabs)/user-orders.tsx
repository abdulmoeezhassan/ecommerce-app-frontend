import { StyleSheet, Image, Platform, TouchableOpacity, FlatList, View, Text } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AntDesign, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = "https://ecommerce-app-backend-indol.vercel.app/api";
const API_BASE_URL= 'http://localhost:3000/api'; // Replace with your actual API base URL

const formatImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/80';
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  const normalizedPath = imagePath.replace(/\\/g, '/');
  const baseUrl = 'http://localhost:3000';
  
  return `${baseUrl}/${normalizedPath}`;
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const id = await AsyncStorage.getItem('user_id');
      if (!id) throw new Error('User ID not found in storage.');

      const response = await axios.get(`${API_BASE_URL}/orders/get-order-by-userid/${id}`);
      setOrders(response.data?.orders || []);
    } catch (error) {
      setError(error?.response?.data?.message || error.message || 'An error occurred.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const renderProductItem = (product) => (
    <View style={styles.productItem}>
      <View style={styles.productImageContainer}>
        <Image 
          source={{ uri: formatImageUrl(product.productImage) }} 
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productPrice}>
          PKR {(product.price || 0).toFixed(2)}
        </Text>
        <View style={styles.productAttributes}>
          {product.color && (
            <View style={styles.attributeRow}>
              <Text style={styles.attributeLabel}>Color:</Text>
              <View 
                style={[styles.colorBox, { backgroundColor: product.color.toLowerCase() }]} 
              />
              <Text style={styles.attributeValue}>{product.color}</Text>
            </View>
          )}
          {product.size && (
            <View style={styles.attributeRow}>
              <Text style={styles.attributeLabel}>Size:</Text>
              <Text style={styles.attributeValue}>{product.size}</Text>
            </View>
          )}
          {product.quality && (
            <View style={styles.attributeRow}>
              <Text style={styles.attributeLabel}>Quality:</Text>
              <Text style={styles.attributeValue}>{product.quality}</Text>
            </View>
          )}
          <View style={styles.attributeRow}>
            <Text style={styles.attributeLabel}>Quantity:</Text>
            <Text style={styles.attributeValue}>{product.quantity || 1}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderOrderCard = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.cardHeader}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderIdText}>Order #{item._id?.substring(0, 8) || ''}</Text>
          <Text style={styles.orderDate}>
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : ''}
          </Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            item.orderStatus === "Processing" && styles.processingBadge,
            item.orderStatus === "Completed" && styles.completedBadge,
            item.orderStatus === "Cancelled" && styles.cancelledBadge,
          ]}>
            <Text style={styles.statusText}>{item.orderStatus || 'N/A'}</Text>
          </View>
          
          <View style={[
            styles.paymentBadge,
            item.paymentStatus === "Paid" ? styles.paidBadge : styles.pendingBadge
          ]}>
            <Text style={styles.paymentText}>{item.paymentStatus || 'N/A'}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.orderSummary}>
        <Text style={styles.totalAmount}>
          Total: PKR {(item.totalAmount || 0).toFixed(2)}
        </Text>
        
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => toggleOrderExpand(item._id)}
        >
          <Text style={styles.detailsButtonText}>
            {expandedOrder === item._id ? 'Hide Details' : 'View Details'}
          </Text>
          <Feather 
            name={expandedOrder === item._id ? "chevron-up" : "chevron-down"} 
            size={18} 
            color="#007bff" 
          />
        </TouchableOpacity>
      </View>
      
      {expandedOrder === item._id && item.cart?.products && (
        <View style={styles.orderDetails}>
          <Text style={styles.detailsTitle}>Order Details</Text>
          {item.cart.products.map((product) => (
            <View key={product._id}>
              {renderProductItem(product)}
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>
  
      {loading ? (
        <View style={styles.centeredContent}>
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : error ? (
        <View style={styles.centeredContent}>
          <AntDesign name="exclamationcircle" size={24} color="red" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centeredContent}>
          <AntDesign name="inbox" size={48} color="#888" />
          <Text style={styles.emptyText}>No orders found</Text>
          <Text style={styles.emptySubText}>
            You haven't placed any orders yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.orderList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: 'black',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: 'black',
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  orderList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderIdContainer: {
    flex: 1,
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 4,
  },
  processingBadge: {
    backgroundColor: '#ffc10720',
  },
  completedBadge: {
    backgroundColor: '#4caf5020',
  },
  cancelledBadge: {
    backgroundColor: '#f4433620',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  paymentBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  paidBadge: {
    backgroundColor: '#4caf50',
  },
  pendingBadge: {
    backgroundColor: '#ff9800',
  },
  paymentText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  orderDetails: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 12,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  productAttributes: {
    flexDirection: 'column',
  },
  attributeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  attributeLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
    width: 60,
  },
  attributeValue: {
    fontSize: 12,
    color: 'black',
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});







// import React from 'react';
// import { 
//   StyleSheet, 
//   View, 
//   Text, 
//   TouchableOpacity, 
//   SafeAreaView, 
//   Image 
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// import NavigationHeader from '../../navigation-header';

// const NotificationScreen = () => {
//   return (
//     <SafeAreaView style={styles.container}>
 
//       <NavigationHeader title="Notification" />
      
//       <View style={styles.content}>
//         {/* Empty notification bell illustration */}
//         <View style={styles.emptyNotificationContainer}>
//           <View style={styles.bellBackground}>
//             <Ionicons name="notifications-outline" size={60} color="#8c9eff" style={styles.bellIcon} />
//             <View style={styles.countCircle}>
//               <Text style={styles.countText}>0</Text>
//             </View>
//           </View>
          
//           {/* You can add a message here if needed */}
//           <Text style={styles.emptyText}>You have no notifications</Text>
//         </View>
        
//         {/* Notification Settings Button */}
//         {/* <TouchableOpacity style={styles.settingsButton}>
//           <Ionicons name="notifications" size={18} color="white" />
//           <Text style={styles.settingsButtonText}>Notification Setting</Text>
//         </TouchableOpacity> */}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingBottom: 20,
//   },
//   emptyNotificationContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   bellBackground: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     backgroundColor: '#e8eaf6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   bellIcon: {
//     marginBottom: 5,
//   },
//   countCircle: {
//     position: 'absolute',
//     top: 40,
//     right: 40,
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   countText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#8c9eff',
//   },
//   emptyText: {
//     marginTop: 20,
//     fontSize: 16,
//     color: '#9e9e9e',
//   },
//   settingsButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'black',
//     borderRadius: 25,
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     width: '80%',
//     maxWidth: 250,
//   },
//   settingsButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '500',
//     marginLeft: 10,
//   },
// });

// export default NotificationScreen;