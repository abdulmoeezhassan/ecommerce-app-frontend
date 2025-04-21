import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Platform, View, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = "https://ecommerce-app-backend-indol.vercel.app";
// const IMAGE_BASE_URL = "https://ecommerce-app-backend-indol.vercel.app";

const API_BASE_URL = "http://localhost:3000";
const IMAGE_BASE_URL = "http://localhost:3000";

export default function TabTwoScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // For React Native, use AsyncStorage instead of localStorage
        const user_id = await AsyncStorage.getItem('user_id');

        if (!user_id) {
          throw new Error('User ID not found');
        }

        const response = await axios.get(`${API_BASE_URL}/api/products/get-all-products`);
        
        // Check if the response contains products data
        if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          // Handle case where products array is not in expected format
          setProducts([]);
        }
        
      } catch (err) {
        console.error('Error fetching products:', err);
        
        // Handle 404 errors more gracefully
        if (err.response && err.response.status === 404) {
          setProducts([]);
          setError(null); // Don't show error for 404, just empty state
        } else {
          setError(err.message || 'Failed to fetch products');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const navigate = () => {
    router.push('/add-product');
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

    const formattedUrl = `${baseUrlWithoutTrailingSlash}/${pathWithoutLeadingSlash}`;
    console.log("formattedUrl", formattedUrl)
    return formattedUrl;
  };

  const renderProductCard = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
    >
      <ThemedView style={styles.cardContent}>
         <Image
                  source={
                    imageErrors[item._id] || !item.colorImages
                      ? require("@/assets/images/product-placeholder.jpeg")
                      : { uri: formatImageUrl(Object.values(item.colorImages)[0]) }
                  }
                  style={styles.productImage}
                  resizeMode="contain"
                  onError={() => {
                    console.log(`Failed to load image: ${API_BASE_URL}/${Object.values(item.colorImages)[0]}`);
                    setImageErrors(prev => ({ ...prev, [item._id]: true }));
                  }}
                />

        <ThemedView style={styles.categoryBadge}>
          <ThemedText style={styles.categoryText}>{item.category}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.productInfo}>
          <View className='flex flex-row justify-between w-full'>
            <ThemedText style={styles.productName} className='text-black'>{item.name}</ThemedText>
            <ThemedText style={styles.productPrice}>${item.price.toFixed(2)}</ThemedText>
          </View>

          {item.color && item.color.length > 0 && (
            <ThemedView style={styles.attributeRow}>
              <ThemedText style={styles.attributeLabel} className='text-black'>Colors:</ThemedText>
              <ThemedView style={styles.colorContainer}>
                {item.color.map((colorName, index) => (
                  <ThemedView
                    key={index}
                    style={[
                      styles.colorDot,
                      { backgroundColor: getColorHex(colorName) }
                    ]}
                  />
                ))}
              </ThemedView>
            </ThemedView>
          )}

          {item.size && (
            <ThemedView style={styles.attributeRow}>
              <ThemedText style={styles.attributeLabel}>Sizes:</ThemedText>
              <ThemedView style={styles.chipContainer}>
                {Array.isArray(item.size) ?
                  item.size.map((size, index) => (
                    <ThemedView key={index} style={styles.chip}>
                      <ThemedText style={styles.chipText}>{size.replace(/[\[\]"']/g, '')}</ThemedText>
                    </ThemedView>
                  ))
                  :
                  <ThemedView style={styles.chip}>
                    <ThemedText style={styles.chipText}>{item.size.replace(/[\[\]"']/g, '')}</ThemedText>
                  </ThemedView>
                }
              </ThemedView>
            </ThemedView>
          )}

          {item.quality && (
            <ThemedView style={styles.attributeRow}>
              <ThemedText style={styles.attributeLabel}>Quality:</ThemedText>
              <ThemedText style={styles.qualityText}>
                {Array.isArray(item.quality) ?
                  item.quality.join(', ').replace(/[\[\]"']/g, '')
                  :
                  item.quality.replace(/[\[\]"']/g, '')}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  // Helper function to convert color names to hex codes
  const getColorHex = (colorName) => {
    const colorMap = {
      red: '#ff5252',
      blue: '#536dfe',
      green: '#4caf50',
      black: '#212121',
      white: '#ffffff',
      yellow: '#ffeb3b',
      purple: '#9c27b0',
      orange: '#ff9800',
      pink: '#e91e63',
      gray: '#9e9e9e',
      brown: '#795548',
      // Add more colors as needed
    };

    return colorMap[colorName.toLowerCase()] || '#888888';
  };

  return (
    <View style={styles.container}>
      {loading && (
        <ThemedView style={styles.centeredContent}>
          <ThemedText>Loading products...</ThemedText>
        </ThemedView>
      )}

      {error && (
        <ThemedView style={styles.centeredContent}>
          <AntDesign name="exclamationcircle" size={24} color="red" />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </ThemedView>
      )}

      {!loading && !error && products.length === 0 &&(
        <ThemedView style={styles.centeredContent}>
          <AntDesign name="inbox" size={48} color="#888" />
          <ThemedText style={styles.emptyText}>No products found</ThemedText>
          {/* <ThemedText style={styles.emptySubText}>
            Tap the button above to add your first product
          </ThemedText> */}
        </ThemedView>
      )}

      {!loading && !error && products.length > 0 && (
        <FlatList
          data={products}
          renderItem={renderProductCard}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles.productList}
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
  addButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white'
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  productList: {
    padding: 12,
  },
  productCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    position: 'relative',
    backgroundColor: '#ffffff', 
  },
  productImage: {
    width: '100%',
    height: 180,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 16,
    backgroundColor: '#ffffff', 
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: 'black'
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a4a4a',
    marginBottom: 12,
  },
  attributeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff', 

    marginBottom: 8,
  },
  attributeLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
    width: 60,
    color: 'black'
  },
  colorContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff', 
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ffffff', 
  },
  chip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  chipText: {
    fontSize: 12,
    color: 'black'
  },
  qualityText: {
    fontSize: 14,
    color: '#555',
  },
});