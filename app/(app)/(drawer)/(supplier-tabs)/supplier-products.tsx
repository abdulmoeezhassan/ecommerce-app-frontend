import { StyleSheet, Image, Platform, TouchableOpacity, FlatList, View } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = "https://ecommerce-app-backend-indol.vercel.app";

export default function TabTwoScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const user_id = await AsyncStorage.getItem('user_id');
        
        if (!user_id) {
          throw new Error('User ID not found');
        }
        
        const response = await axios.get(`${API_BASE_URL}/api/products/get-products-by-supplier/${user_id}`);
        
        if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          setProducts([]);
        }
        
      } catch (err) {
        console.error('Error fetching products:', err);
        
        if (err.response && err.response.status === 404) {
          setProducts([]);
          setError(null); 
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

  // Parse JSON strings into arrays if needed
  const parseArrayField = (field) => {
    if (!field) return [];
    
    // If already an array
    if (Array.isArray(field)) {
      // Handle case where array contains JSON strings
      if (field.length > 0 && typeof field[0] === 'string' && field[0].startsWith('[')) {
        try {
          return JSON.parse(field[0]);
        } catch (e) {
          return field;
        }
      }
      return field;
    }
    
    // If it's a string that looks like JSON
    if (typeof field === 'string') {
      if (field.startsWith('[')) {
        try {
          return JSON.parse(field);
        } catch (e) {
          return [field];
        }
      }
      return [field];
    }
    
    return [];
  };

  const renderProductCard = ({ item }) => {
    // Parse array fields
    const colors = parseArrayField(item.color);
    const sizes = parseArrayField(item.size);
    const qualities = parseArrayField(item.quality);
    
    return (
      <TouchableOpacity 
        style={styles.productCard}
      >
        <View style={styles.cardContent}>
          <Image
            source={
              imageErrors[item._id] || !item.image
                ? require("@/assets/images/product-placeholder.jpeg")
                : { uri: `${API_BASE_URL}/${item.image}` }
            }
            style={styles.productImage}
            resizeMode="cover"
            onError={() => {
              console.log(`Failed to load image: ${API_BASE_URL}/${item.image}`);
              setImageErrors(prev => ({...prev, [item._id]: true}));
            }}
          />
          
          <View style={styles.categoryBadge}>
            <ThemedText style={styles.categoryText}>{item.category}</ThemedText>
          </View>
          
          <View style={styles.productInfo}>
            <View style={styles.productHeader}>
              <ThemedText style={styles.productName}>{item.name}</ThemedText>
              <ThemedText style={styles.productPrice}>PKR {item.price.toFixed(2)}</ThemedText>
            </View>
            
            {colors && colors.length > 0 && (
              <View style={styles.attributeRow}>
                <ThemedText style={styles.attributeLabel}>Colors:</ThemedText>
                <View style={styles.colorContainer}>
                  {colors.map((colorName, index) => (
                    <View 
                      key={index} 
                      style={[
                        styles.colorDot,
                        { backgroundColor: getColorHex(colorName) }
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}
            
            {sizes && sizes.length > 0 && (
              <View style={styles.attributeRow}>
                <ThemedText style={styles.attributeLabel}>Sizes:</ThemedText>
                <View style={styles.chipContainer}>
                  {sizes.map((size, index) => (
                    <View key={index} style={styles.chip}>
                      <ThemedText style={styles.chipText}>
                        {typeof size === 'string' ? size.replace(/[\[\]"']/g, '') : size}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {qualities && qualities.length > 0 && (
              <View style={styles.attributeRow}>
                <ThemedText style={styles.attributeLabel}>Quality:</ThemedText>
                <ThemedText style={styles.qualityText}>
                  {qualities.map(q => 
                    typeof q === 'string' ? q.replace(/[\[\]"']/g, '') : q
                  ).join(', ')}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  // Helper function to convert color names to hex codes
  const getColorHex = (colorName) => {
    if (!colorName || typeof colorName !== 'string') return '#888888';
    
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
      <View style={styles.header}>
        <ThemedText style={styles.title}>My Products</ThemedText>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={navigate}
        >
          <AntDesign name="pluscircle" size={15} color="white" />
          <ThemedText style={styles.buttonText}>Add new product</ThemedText>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centeredContent}>
          <ThemedText>Loading products...</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.centeredContent}>
          <AntDesign name="exclamationcircle" size={24} color="red" />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.centeredContent}>
          <AntDesign name="inbox" size={48} color="#888" />
          <ThemedText style={styles.emptyText}>No products found</ThemedText>
          <ThemedText style={styles.emptySubText}>
            Tap the button above to add your first product
          </ThemedText>
        </View>
      ) : (
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000'
  },
  addButton: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF'
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666666',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
  productList: {
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  productCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  productImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#f9f9f9',
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
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    width: '100%',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
    marginRight: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a4a4a',
  },
  attributeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  attributeLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
    width: 60,
    color: '#555555',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
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
    color: '#333333',
  },
  qualityText: {
    fontSize: 14,
    color: '#555555',
    flex: 1,
  },
});