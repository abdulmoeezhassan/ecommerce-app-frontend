import { StyleSheet, Image, Platform, TouchableOpacity, FlatList, View, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const API_BASE_URL = "https://ecommerce-app-backend-indol.vercel.app/api";
// const API_BASE_URL = "http://localhost:3000/api"
// const IMAGE_BASE_URL = "http://localhost:3000/";
const IMAGE_BASE_URL = "https://ecommerce-app-backend-indol.vercel.app/";

export default function PastOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleProductsView = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const fetchOrders = async () => {
    setLoading(true); // Ensure loading state is set before fetching

    try {
      const id = await AsyncStorage.getItem('user_id');

      if (!id) {
        throw new Error('User ID not found in storage.');
      }

      const response = await axios.get(`${API_BASE_URL}/orders/supplier-past/${id}`);

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

  const renderProductItem = ({ item, index }) => (
    <View style={styles.productItem}>
      <Image
        source={
          imageErrors[item._id] || !item.image
            ? require("@/assets/images/product-placeholder.jpeg")
            : { uri: formatImageUrl(item.image) }
        }
        style={styles.productThumbnail}
        resizeMode="contain"
        onError={() => {
          setImageErrors(prev => ({ ...prev, [item._id]: true }));
        }}
      />
      <View style={styles.productDetails}>
        <ThemedText style={styles.productName}>{item.name}</ThemedText>
        <ThemedText style={styles.productCategory}>{item.category}</ThemedText>
        <View style={styles.productSpecs}>
          <ThemedText style={styles.productSpec}>Size: {item.size?.toString().replace(/[\[\]"]/g, '')}</ThemedText>
          <ThemedText style={styles.productSpec}>Color: {item.color?.toString().replace(/[\[\]"]/g, '')}</ThemedText>
          <ThemedText style={styles.productPrice}>PKR {item.price}</ThemedText>
        </View>
      </View>
    </View>
  );

  const renderOrderCard = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.cardHeader}>
        <Image
          source={
            imageErrors[item._id] || !item.products?.[0]?.image
              ? require("@/assets/images/product-placeholder.jpeg")
              : { uri: formatImageUrl(item.products[0].image) }
          }
          style={styles.headerImage}
          resizeMode="contain"
          onError={() => {
            setImageErrors(prev => ({ ...prev, [item._id]: true }));
          }}
        />
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.orderHeader}>
          <View style={styles.statusSection}>
            <View style={styles.statusBadge}>
              <ThemedText style={styles.statusText}>{item.orderStatus}</ThemedText>
            </View>
            <ThemedText style={styles.orderDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={() => toggleProductsView(item._id)}
          >
            <AntDesign 
              name={expandedOrders[item._id] ? "up" : "down"} 
              size={16} 
              color="#007bff" 
            />
            <ThemedText style={styles.toggleText}>
              {expandedOrders[item._id] ? "Hide Products" : "Show Products"}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.orderInfo}>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Order ID:</ThemedText>
            <ThemedText style={styles.infoValue}>#{item._id.substring(0, 8)}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Total Amount:</ThemedText>
            <ThemedText style={styles.infoValue}>PKR {item.totalAmount.toFixed(2)}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Payment:</ThemedText>
            <View style={[styles.paymentBadge,
            item.paymentStatus === "Paid" ? styles.paidBadge : styles.pendingBadge]}>
              <ThemedText style={styles.paymentText}>{item.paymentStatus}</ThemedText>
            </View>
          </View>

          {expandedOrders[item._id] && item.products && item.products.length > 0 && (
            <View style={styles.productsContainer}>
              <ThemedText style={styles.sectionTitle}>Order Products</ThemedText>
              <FlatList
                data={item.products}
                renderItem={renderProductItem}
                keyExtractor={(product) => product._id}
                scrollEnabled={false}
              />
            </View>
          )}

          {item?.user && (
            <View style={styles.customerInfo}>
              <ThemedText style={styles.sectionTitle}>Customer Information</ThemedText>

              {item?.user?.email && (
                <View style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>Email:</ThemedText>
                  <ThemedText style={styles.infoValue}>{item.user.email}</ThemedText>
                </View>
              )}

              {item?.user?.address && (
                <View style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>Address:</ThemedText>
                  <ThemedText style={styles.infoValue}>{item.user.address}</ThemedText>
                </View>
              )}

              {item?.user?.country && (
                <View style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>Country:</ThemedText>
                  <ThemedText style={styles.infoValue}>{item.user.country}</ThemedText>
                </View>
              )}

              {item?.user?.city && (
                <View style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>City:</ThemedText>
                  <ThemedText style={styles.infoValue}>{item.user.city}</ThemedText>
                </View>
              )}

              {item?.user?.postalCode && (
                <View style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>Post Code:</ThemedText>
                  <ThemedText style={styles.infoValue}>{item.user.postalCode}</ThemedText>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Past Orders</ThemedText>
      </View>

      {loading && (
        <View style={styles.centeredContent}>
          <ThemedText>Loading orders...</ThemedText>
        </View>
      )}

      {error && (
        <View style={styles.centeredContent}>
          <AntDesign name="exclamationcircle" size={24} color="red" />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}

      {!loading && !error && orders.length === 0 && (
        <View style={styles.centeredContent}>
          <AntDesign name="inbox" size={48} color="#888" />
          <ThemedText style={styles.emptyText}>No orders found</ThemedText>
          <ThemedText style={styles.emptySubText}>
            Your orders will appear here once customers place them
          </ThemedText>
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
  cardHeader: {
    height: 120,
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
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
    color: '#666',
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  orderList: {
    padding: 12,
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
    backgroundColor: 'white',
  },
  orderHeader: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#007bff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginTop: 4,
  },
  toggleText: {
    fontSize: 12,
    color: '#007bff',
    marginLeft: 4,
    fontWeight: '500',
  },
  orderInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    backgroundColor: 'white',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'white',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
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
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  productsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  productSpecs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  productSpec: {
    fontSize: 12,
    color: '#666',
    marginRight: 12,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007bff',
  },
  customerInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 12,
    paddingTop: 12,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
});