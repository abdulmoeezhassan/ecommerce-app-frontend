import { StyleSheet, Image, Platform, TouchableOpacity, FlatList, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const API_BASE_URL = "https://ecommerce-app-backend-indol.vercel.app/api";

export default function PastOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const renderOrderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
    >
      <ThemedView style={styles.cardContent}>
        <ThemedView style={styles.orderHeader}>
          <ThemedView style={styles.statusBadge}>
            <ThemedText style={styles.statusText}>{item.orderStatus}</ThemedText>
          </ThemedView>
          <ThemedText style={styles.orderDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.orderInfo}>
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
            <ThemedView style={[styles.paymentBadge,
            item.paymentStatus === "Paid" ? styles.paidBadge : styles.pendingBadge]}>
              <ThemedText style={styles.paymentText}>{item.paymentStatus}</ThemedText>
            </ThemedView>
          </View>

          {item.userInfo && (
            <ThemedView style={styles.customerInfo}>
              <ThemedText style={styles.sectionTitle}>Customer Information</ThemedText>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Email:</ThemedText>
                <ThemedText style={styles.infoValue}>{item.userInfo.email}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Address:</ThemedText>
                <ThemedText style={styles.infoValue}>{item.userInfo.address}</ThemedText>
              </View>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>My Orders</ThemedText>
      </View>

      {loading && (
        <ThemedView style={styles.centeredContent}>
          <ThemedText>Loading orders...</ThemedText>
        </ThemedView>
      )}

      {error && (
        <ThemedView style={styles.centeredContent}>
          <AntDesign name="exclamationcircle" size={24} color="red" />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </ThemedView>
      )}

      {!loading && !error && orders.length === 0 && (
        <ThemedView style={styles.centeredContent}>
          <AntDesign name="inbox" size={48} color="#888" />
          <ThemedText style={styles.emptyText}>No orders found</ThemedText>
          <ThemedText style={styles.emptySubText}>
            Your orders will appear here once customers place them
          </ThemedText>
        </ThemedView>
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  orderInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
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
  customerInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 12,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});