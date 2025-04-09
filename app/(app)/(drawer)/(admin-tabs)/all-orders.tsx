import { StyleSheet, Image, Platform, TouchableOpacity, FlatList, View, Text } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const API_BASE_URL = "https://ecommerce-app-backend-indol.vercel.app/api";
// const API_BASE_URL = "http://localhost:3000/api";
// const IMAGE_BASE_URL = "http://localhost:3000/";
const IMAGE_BASE_URL = "https://ecommerce-app-backend-indol.vercel.app/";

export default function HomeScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const fetchOrders = async () => {
    setLoading(true); // Ensure loading state is set before fetching

    try {
      const id = await AsyncStorage.getItem('user_id');

      if (!id) {
        throw new Error('User ID not found in storage.');
      }

      const response = await axios.get(`${API_BASE_URL}/orders/get-all-orders`);

      if (response.data && Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);
      } else {
        setOrders([]); // Ensure state is updated with an empty array
      }
    } catch (error) {
      setOrders([]); // Handle errors by showing an empty array
      setError(error?.response?.data?.message || error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/update-status/${orderId}`, {
        orderStatus: newStatus,
      });

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
        Toast.show({
          type: "success",
          text1: "Order Status updated successfully",
          text2: response?.data?.message || "Error in updating order status",
        });
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const navigate = () => {
    // router.push('/add-order');
  };
  const formatImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://via.placeholder.com/150';
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Replace backslashes with forward slashes
    const normalizedPath = imagePath.replace(/\\/g, '/');
    
    const baseUrlWithoutTrailingSlash = IMAGE_BASE_URL.endsWith('/') 
      ? IMAGE_BASE_URL.slice(0, -1) 
      : IMAGE_BASE_URL;
    
    const pathWithoutLeadingSlash = normalizedPath.startsWith('/') 
      ? normalizedPath.slice(1) 
      : normalizedPath;
    
    return `${baseUrlWithoutTrailingSlash}/${pathWithoutLeadingSlash}`;
  };

  const renderOrderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
    >
      {item.products && item.products.map((product, index) => (
        <Image
          source={
            imageErrors[item._id] || !product.image
              ? require("@/assets/images/product-placeholder.jpeg")
              : { uri: formatImageUrl(product.image) }
          }
          style={styles.productImage}
          resizeMode="contain"
          onError={() => {
            setImageErrors(prev => ({ ...prev, [product._id]: true }));
          }}
        />
        // <Image
        //   key={index}
        //   source={{ uri: `${IMAGE_BASE_URL}${product.image}` }}
        //   style={styles.productImage}
        //   resizeMode="cover"
        // />
      ))}
      <View style={styles.cardContent}>
        <View style={styles.orderHeader}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.orderStatus}</Text>
          </View>
          <Text style={styles.orderDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.orderInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order ID:</Text>
            <Text style={styles.infoValue}>#{item._id.substring(0, 8)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Amount:</Text>
            <Text style={styles.infoValue}>PKR {item.totalAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment:</Text>
            <View style={[styles.paymentBadge,
            item.paymentStatus === "Paid" ? styles.paidBadge : styles.pendingBadge]}>
              <Text style={styles.paymentText}>{item.paymentStatus}</Text>
            </View>
          </View>

          {item?.user && (
            <View style={styles.customerInfo}>
              <Text style={styles.sectionTitle}>Customer Information</Text>

              {item?.user?.email && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{item.user.email}</Text>
                </View>
              )}

              {item?.user?.address && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Address:</Text>
                  <Text style={styles.infoValue}>{item.user.address}</Text>
                </View>
              )}

              {item?.user?.country && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Country:</Text>
                  <Text style={styles.infoValue}>{item.user.country}</Text>
                </View>
              )}

              {item?.user?.city && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>City:</Text>
                  <Text style={styles.infoValue}>{item.user.city}</Text>
                </View>
              )}

              {item?.user?.postalCode && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Post Code:</Text>
                  <Text style={styles.infoValue}>{item.user.postalCode}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Orders</Text>
      </View>

      {loading && (
        <View style={styles.centeredContent}>
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      )}

      {error && (
        <View style={styles.centeredContent}>
          <AntDesign name="exclamationcircle" size={24} color="red" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && orders.length === 0 && (
        <View style={styles.centeredContent}>
          <AntDesign name="inbox" size={48} color="#888" />
          <Text style={styles.emptyText}>No orders found</Text>
          <Text style={styles.emptySubText}>
            Your orders will appear here once customers place them
          </Text>
        </View>
      )}

      {!loading && !error && orders.length > 0 && (
        <FlatList
          data={orders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles.orderList}
          showsVerticalScrollIndicator={false}
          numColumns={1}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ff9800', // Orange for Cancel
  },
  rejectButton: {
    backgroundColor: '#f44336', // Red for Reject
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white'
  },
  productImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white'
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
    color: 'black'
  },
  emptySubText: {
    fontSize: 14,
    color: 'black',
    marginTop: 8,
    textAlign: 'center',
  },
  orderList: {
    padding: 12,
    backgroundColor: 'white'
  },
  orderCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
    backgroundColor: 'white'
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'white'
  },
  statusBadge: {
    backgroundColor: '#007bff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    color: 'black',
  },
  orderInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    backgroundColor: 'white'
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'white'
  },
  infoLabel: {
    fontSize: 14,
    color: 'black',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: 'black'
  },
  paymentBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
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
    fontSize: 12,
    fontWeight: '500',
  },
  customerInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 12,
    paddingTop: 12,
    backgroundColor: 'white'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black'
  },
});