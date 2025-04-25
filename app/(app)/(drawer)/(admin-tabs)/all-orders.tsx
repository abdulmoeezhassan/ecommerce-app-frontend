import { StyleSheet, Image, Platform, TouchableOpacity, FlatList, View, Text } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// const API_BASE_URL = "https://ecommerce-app-backend-indol.vercel.app/api";
const API_BASE_URL = "http://localhost:3000/api"

const IMAGE_BASE_URL = "http://localhost:3000/";
// const IMAGE_BASE_URL = "https://ecommerce-app-backend-indol.vercel.app/";

export default function TabTwoScreen() {
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

  const updatePaymentStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/update-payment-status/${orderId}`, {
        paymentStatus: newStatus,
      });

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
        Toast.show({
          type: "success",
          text1: "Paymnet Status updated successfully",
          text2: response?.data?.message || "Error in updating payment status",
        });
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const renderProductItem = ({ item, index }) => (
    <View style={styles.productItem}>
      <Image
        source={
          imageErrors[item._id] || !item.productImage
            ? require("@/assets/images/product-placeholder.jpeg")
            : { uri: item.productImage }
        }
        style={styles.productThumbnail}
        resizeMode="cover"
        onError={() => {
          setImageErrors(prev => ({ ...prev, [item._id]: true }));
        }}
      />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>Product #{item.productId.substring(0, 8)}</Text>
        <Text style={styles.productCategory}>Quantity: {item.quantity}</Text>
        <View style={styles.productSpecs}>
          <Text style={styles.productSpec}>
            Size: {item.size}
          </Text>
          <Text style={styles.productSpec}>
            Color: {item.color}
          </Text>
          <Text style={styles.productSpec}>
            Quality: {item.quality}
          </Text>
          <Text style={styles.productPrice}>PKR {item.price}</Text>
        </View>
        {/* Custom Design Section */}
        {item.customDesignPath && (
          <>
            <Text style={styles.customDesignLabel}>Custom Design:</Text>
            <Image
              source={{ uri: item.customDesignPath }}
              style={styles.customDesignImage}
              resizeMode="contain"
            />
          </>
        )}

        {item.description && (
          <>
            <Text style={styles.customDesignLabel}>Design Description:</Text>
            <Text style={styles.customDesignDescription}>{item.description}</Text>
          </>
        )}
      </View>
    </View>
  );


  const renderOrderCard = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.cardHeader}>
        <Image
          source={
            imageErrors[item._id] || !item.cart?.products?.[0]?.productImage
              ? require("@/assets/images/product-placeholder.jpeg")
              : { uri: item.cart.products[0].productImage }
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
              <Text style={styles.statusText}>{item.orderStatus}</Text>
            </View>
            <Text style={styles.orderDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
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
            <Text style={styles.toggleText}>
              {expandedOrders[item._id] ? "Hide Products" : "Show Products"}
            </Text>
          </TouchableOpacity>
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

          {expandedOrders[item._id] && item.cart?.products && item.cart.products.length > 0 && (
            <View style={styles.productsContainer}>
              <Text style={styles.sectionTitle}>Order Products</Text>
              <FlatList
                data={item.cart.products}
                renderItem={renderProductItem}
                keyExtractor={(product, index) => product._id || `${item._id}-product-${index}`}
                scrollEnabled={false}
              />
            </View>
          )}

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

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => updateOrderStatus(item._id, "Delivered")}
            >
              <Text style={styles.buttonText}>Delivered</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => updateOrderStatus(item._id, "Rejected")}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
          {item.paymentStatus === "Pending" && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => updatePaymentStatus(item._id, "Paid")}
              >
                <Text style={styles.buttonText}>Paid</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => updatePaymentStatus(item._id, "Failed")}
              >
                <Text style={styles.buttonText}>Failed</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
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
  customDesignLabel: {
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  customDesignImage: {
    width: '100%',
    height: 120,
    marginTop: 4,
    marginBottom: 8,
    borderRadius: 4,
  },
  customDesignValue: {
    color: "#444",
    marginBottom: 4,
  },
  customDesignDescription: {
    color: "#555",
    fontStyle: "italic",
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
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  productThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
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
    color: 'black',
    marginTop: 8,
    textAlign: 'center',
  },
  orderList: {
    padding: 12,
    backgroundColor: 'white',
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
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    color: 'black',
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
    color: 'black',
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
    color: 'white',
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