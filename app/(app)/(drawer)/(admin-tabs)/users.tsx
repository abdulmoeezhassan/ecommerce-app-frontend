import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import userService from "@/services/user-service/user-service";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";


const API_BASE_URL = "http://localhost:3000";

const Users = () => {
  const [userData, setUserData] = useState([]);
  const navigation = useNavigation();

  const getAllOpportunities = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found!");
      }

      const response = await axios.get(`${API_BASE_URL}/api/users/get-all-users`);
      console.log(response);
      setUserData(response.data?.data || []);

    } catch (error) {
      console.error("Failed to fetch templates:", error);
    }
  };

  useEffect(() => {
    getAllOpportunities();
  }, []);

  const handleViewDetails = (item) => {
    // router.push({ pathname: "/opportunities-details", params: { id: item._id } });
  };

  const capitalizeFirstLetter = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
      onPress={() => handleViewDetails(item)}
    >
      <View style={styles.leftContainer}>
        <Icon name="user" size={40} color="#555" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={[styles.name]}>{capitalizeFirstLetter(item.firstName)} {capitalizeFirstLetter(item.lastName)}</Text>
          <Text style={[styles.email]} className="pt-2">{item.email}</Text>
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
        ListEmptyComponent={<Text style={styles.noDataText}>No users to show</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
    alignItems: "center",
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
  icon: {
    marginRight: 10,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 100,
  },
});

export default Users;
