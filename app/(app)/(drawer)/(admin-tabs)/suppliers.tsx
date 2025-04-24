import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import Toast from "react-native-toast-message";

const API_BASE_URL = "https://ecommerce-app-backend-indol.vercel.app";
// const API_BASE_URL = "http://localhost:3000"
const Suppliers = () => {
  const [userData, setUserData] = useState([]);
  const navigation = useNavigation();

  const getAllOpportunities = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found!");
      }

      const response = await axios.get(`${API_BASE_URL}/api/users/get-all-suppliers`);
      console.log(response);
      setUserData(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    }
  };

  const updateUserStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/reject-user/${orderId}`, {
        isAccountActive: newStatus,
      });

      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: "User Status updated successfully",
          text2: response?.data?.message || "Error in updating user status",
        });
        getAllOpportunities();
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const approveUser = async (orderId, newStatus) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/approve-user/${orderId}`, {
        isAccountActive: newStatus,
      });

      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: "User Status updated successfully",
          text2: response?.data?.message || "Error in updating user status",
        });
        getAllOpportunities();
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  useEffect(() => {
    getAllOpportunities();
  }, []);

  const handleViewDetails = (item) => {
    // router.push({ pathname: "/opportunities-details", params: { id: item._id } });
  };

  const handleApprove = async (id) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found!");
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/users/approve-user/${id}`,
        { 
          userId: id,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: "Suplier approved successfully",
          text2: response?.data?.message || "Error in approving supplier",
        });  
        getAllOpportunities(); // Refresh the list
      }
    } catch (error) {
      console.error("Failed to approve supplier:", error);
      Alert.alert("Error", "Failed to approve supplier");
    }
  };

  const handleReject = async (id) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found!");
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/users/reject-user/${id}`,
        {
          data: { userId: id } // Send id in the request body for DELETE request
        }
      );
      
      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: "Suplier rejected successfully",
          text2: response?.data?.message || "Error in rejecting supplier",
        });         getAllOpportunities(); // Refresh the list
      }
    } catch (error) {
      console.error("Failed to reject supplier:", error);
      Alert.alert("Error", "Failed to reject supplier");
    }
  };

  const capitalizeFirstLetter = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
      onPress={() => console.log("View Details", item)}
    >
      <View style={styles.leftContainer}>
        <Icon name="user" size={40} color="#555" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>
            {capitalizeFirstLetter(item.firstName)} {capitalizeFirstLetter(item.lastName)}
          </Text>
               <Text style={styles.email}>{item.email}</Text>
                    <Text style={styles.email}>Role: {item.role}</Text>
                    <Text style={styles.subText}>Mobile: {item.mobileNumber || 'N/A'}</Text>
                    <Text style={styles.subText}>Country: {item.country || 'N/A'}</Text>
                    <Text style={styles.subText}>City: {item.city || 'N/A'}</Text>
                    <Text style={styles.subText}>Address: {item.address || 'N/A'}</Text>
                    <Text style={styles.subText}>Mobile Number: {item.mobileNumber || 'N/A'}</Text>
                    <Text style={styles.subText} className="mb-2">Postal Code: {item.postalCode || 'N/A'}</Text>
                    {item.isAccountActive === false && (
                                <View style={styles.buttonContainer}>
                                  <TouchableOpacity
                                    style={[styles.actionButton, styles.cancelButton]}
                                    onPress={() => approveUser(item._id, true)}
                                  >
                                    <Text style={styles.buttonText}>Approve</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={[styles.actionButton, styles.rejectButton]}
                                    onPress={() => updateUserStatus(item._id, false)}
                                  >
                                    <Text style={styles.buttonText}>Reject</Text>
                                  </TouchableOpacity>
                                </View>
                              )}
        </View>
      </View>
    </TouchableOpacity>
  );
  

  return (
    <View style={styles.container}>
      <FlatList
        data={userData}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.table}
        ListEmptyComponent={<Text style={styles.noDataText}>No suppliers to show</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  subText: {
    fontSize: 13,
    color: "#555",
    marginBottom: 2,
  },
  container: {
    flex: 1,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    width: "100%",
  },
  table: {
    borderTopColor: "#ddd",
    paddingBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 0.5,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
    marginTop: 10,
    width: "100%",
    justifyContent: "space-between",
  },
  evenRow: {
    backgroundColor: "#ffff",
  },
  oddRow: {
    backgroundColor: "#fff",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  textContainer: {
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  createdAt: {
    fontSize: 14,
    color: "#999",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 15,
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
  icon: {
    marginRight: 10,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 100,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  approveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  
  cardTitleContainer: {
    marginLeft: 12,
  },
  
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  
  cardBody: {
    marginTop: 8,
  },
  
  cardDetail: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  
  bold: {
    fontWeight: "600",
  },
  
});

export default Suppliers;