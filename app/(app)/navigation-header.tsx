import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';  
import { useCart } from '../../components/cartcontext';   
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import axios from 'axios';

const API_BASE_URL = 'https://ecommerce-app-backend-indol.vercel.app/api/';
interface UserData {
  imagePath?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}
const NavigationHeader = ({ title, }) => {
  const router = useRouter();  // Initialize the router
  const { cart } = useCart(); // Use cart context to get the current cart items
  const [profileImage, setProfileImage] = useState(null); // Set null initially
  const [userData, setUserData] = useState<UserData>({});
  const [error, setError] = useState(false);

  const getAllOpportunities = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      if (!userId) {
        throw new Error("User id not found!");
      }

      const response = await axios.get(`${API_BASE_URL}users/get-single-user/${userId}`);
      setUserData(response.data?.data || []);

    } catch (error) {
      console.error("Failed to fetch templates:", error);
    }
  };
  const capitalizeFirstLetter = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  useEffect(() => {
    getAllOpportunities();
  }, []);
  // Fetch the profile image from AsyncStorage (local storage)
  // useEffect(() => {
  //   const fetchProfileImage = async () => {
  //     try {
  //       const storedImageUrl = await AsyncStorage.getItem('profileImage');
  //       if (storedImageUrl) {
  //         setProfileImage({ uri: storedImageUrl }); // Update with the stored image URL
  //       } else {
  //         setProfileImage(require('@/assets/images/default-avatar.png')); // Set default image if no profile image
  //       }
  //     } catch (error) {
  //       console.error('Failed to load profile image from AsyncStorage:', error);
  //       setProfileImage(require('@/assets/images/default-avatar.png')); // Set default image on error
  //     }
  //   };

  //   fetchProfileImage();
  // }, []);

  // Calculate total cart item count
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    
    <View style={styles.headerContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.back()} // Go back to the previous screen
      >
        {/* <Ionicons name="arrow-back-outline" size={24} color="black" /> */}
        <Ionicons name="chevron-back" size={24} color="black" />


      </TouchableOpacity>

      {/* Title in the center */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{title}</Text>
      </View>

      <View style={styles.rightContainer}>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push('/cart')} // Navigate to Cart screen using expo-router
        >
          <Ionicons name="cart-outline" size={22} color="black" />
          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push('/profile')} // Navigate to Profile screen using expo-router
        >
          <Image
            source={
              error || !userData?.imagePath
                ? require("@/assets/images/user-placeholder-img.png")
                : { uri: userData?.imagePath }
            }
            style={styles.icon}
            onError={() => setError(true)}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  menuButton: {
    padding: 4,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center', // Center the title
  },
  icon: {
    width: 25,
    height: 25,
    borderRadius: 25,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    padding: 8,
    marginRight: 12,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff4d4d',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 0,
  },
  profileImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
});

export default NavigationHeader;
