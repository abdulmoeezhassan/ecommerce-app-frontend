import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import NavigationHeader from './navigation-header';
import { useCart } from '../../components/cartcontext';

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api/products/get-all-products'; // Main API endpoint
const IMAGE_BASE_URL = 'http://localhost:3000'; // Base URL for images

// Get screen width for responsive design
const { width } = Dimensions.get('window');

const ProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({ status: false, productId: null });
  
  const navigation = useNavigation();
  const router = useRouter();
  const { addToCart, getCartSupplierId } = useCart(); // Use the cart context with supplier validation

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      
      // Use axios with responseType 'text' to get raw response
      const response = await axios.get(`${API_BASE_URL}`, {
        responseType: 'text'
      });
      
      // Parse the special format response "se{...json...}"
      const jsonData = parseResponse(response.data);
      
      if (jsonData && jsonData.products) {
        // Process the products array
        const processedProducts = jsonData.products.map(product => ({
          ...product,
          id: product._id, // Ensure id exists for cart context
          // Fix the image path handling
          image: formatImageUrl(product.image),
          // Parse nested JSON strings in arrays if present
          color: parseArrayField(product.color),
          quality: parseArrayField(product.quality),
          size: parseArrayField(product.size)
        }));
        
        setProducts(processedProducts);
        
        // Extract categories
        const uniqueCategories = extractCategories(processedProducts);
        setCategories(uniqueCategories);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Improved function to format image URLs correctly
  const formatImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://via.placeholder.com/150';
    }
    
    // If it's already a full URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Replace backslashes with forward slashes
    const normalizedPath = imagePath.replace(/\\/g, '/');
    
    // Make sure we don't have double slashes when joining paths
    const baseUrlWithoutTrailingSlash = IMAGE_BASE_URL.endsWith('/') 
      ? IMAGE_BASE_URL.slice(0, -1) 
      : IMAGE_BASE_URL;
    
    const pathWithoutLeadingSlash = normalizedPath.startsWith('/') 
      ? normalizedPath.slice(1) 
      : normalizedPath;
    
    return `${baseUrlWithoutTrailingSlash}/${pathWithoutLeadingSlash}`;
  };

  // Parse the special response format "se{...json...}"
  const parseResponse = (responseText) => {
    try {
      // Find where the JSON object starts
      const jsonStartIndex = responseText.indexOf('{');
      if (jsonStartIndex === -1) {
        console.error('No JSON data found in the response');
        return null;
      }
      
      // Extract and parse the JSON part
      const jsonString = responseText.substring(jsonStartIndex);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing response:', error);
      return null;
    }
  };

  // Parse array fields that might be nested JSON strings
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

  // Extract unique categories from products
  const extractCategories = (productsList) => {
    const uniqueCategories = new Set();
    productsList.forEach(product => {
      if (product.category) {
        uniqueCategories.add(product.category);
      }
    });
    
    return [
      { id: 'all', name: 'All', icon: 'shirt-outline' },
      ...Array.from(uniqueCategories).map((category, index) => ({
        id: `category-${index + 1}`,
        name: category,
        icon: 'shirt-outline'
      }))
    ];
  };

  // Check for supplier conflict
  const checkSupplierConflict = (supplierId) => {
    if (!supplierId) return false;
    
    const currentSupplierId = getCartSupplierId();
    if (!currentSupplierId) return false;
    
    return currentSupplierId !== supplierId;
  };

  // Handle adding product to cart
  const handleAddToCart = async (product) => {
    // Check for supplier conflict
    if (checkSupplierConflict(product.supplierId)) {
      Alert.alert(
        "Cannot Add Product",
        "You can only add products from the same supplier in a single order. Please complete your current order or clear your cart before adding products from a different supplier."
      );
      return;
    }
    
    // Add loading state for this specific product
    setAddingToCart({ status: true, productId: product._id || product.id });
    
    try {
      // Format product for cart context
      const cartProduct = {
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        // Add image to cart item for display in cart
        image: product.image,
        // Include supplierId
        supplierId: product.supplierId
      };
      
      // Use the updated addToCart that returns success status
      const success = await addToCart(cartProduct);
      
      if (success) {
        // Optional: show success message
        // Alert.alert('Success', 'Product added to cart');
      }
    } finally {
      // Clear loading state
      setAddingToCart({ status: false, productId: null });
    }
  };

  // Handle product press - navigate to product details
  const handleProductPress = (product) => {
    // Only pass the product ID
    router.push({
      pathname: '/product-detail',
      params: { productId: product._id || product.id }
    });
  };

  // Filter products by selected category
  const getFilteredProducts = () => {
    if (selectedCategory === 'all') {
      return products;
    }
    
    const categoryName = categories.find(cat => cat.id === selectedCategory)?.name;
    return products.filter(product => product.category === categoryName);
  };

  // Render product item
  const renderProductItem = ({ item }) => {
    const isAddingToCart = addingToCart.status && addingToCart.productId === (item._id || item.id);
    const hasSupplierConflict = checkSupplierConflict(item.supplierId);
    
    return (
      <TouchableOpacity 
        style={styles.productItem}
        onPress={() => handleProductPress(item)}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.productImage} 
            resizeMode="cover"
            defaultSource={require('@/assets/images/product-placeholder.jpeg')}
          />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.categoryText} numberOfLines={1}>{item.category || ''}</Text>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.productPrice}>PKR {item.price}</Text>
          
          {/* Show sizes if available */}
          {item.size && item.size.length > 0 && (
            <View style={styles.sizesContainer}>
              {item.size.slice(0, 3).map((size, index) => (
                <Text key={index} style={styles.sizeText}>{size}</Text>
              ))}
              {item.size.length > 3 && <Text style={styles.sizeText}>+{item.size.length - 3}</Text>}
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={[
            styles.cartButton,
            hasSupplierConflict && styles.disabledCartButton
          ]}
          onPress={() => handleAddToCart(item)}
          disabled={hasSupplierConflict || isAddingToCart}
        >
          {isAddingToCart ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Ionicons 
              name={hasSupplierConflict ? "close-outline" : "bag-outline"} 
              size={18} 
              color={hasSupplierConflict ? "#ff4d4d" : "black"} 
            />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // Render category item
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.categoryItem, 
        selectedCategory === item.id && styles.selectedCategoryItem
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text 
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.selectedCategoryText
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Render loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader title="Products" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e88e5" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader title="Products" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#ff4d4d" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchProducts}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const filteredProducts = getFilteredProducts();

  return (
    <SafeAreaView style={styles.container}>
      <NavigationHeader title="Products" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Design Your Cloth Banner */}
        <View style={styles.designBannerContainer}>
          <Image
            source={{ uri: 'https://s3-alpha-sig.figma.com/img/eaca/75f8/d634283bec04f97c63ec4ea1d9763d77?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=t~QAzLnVRq814zf6T8ivWJB-euaiGBPZ-ru4Y8d-H5yAZor2VcM7zcX3mOJrWTNsfya~677N23MI~P~a4k1z2ldtWHgb2-yToB2ixZPV9s0XfHK4Ar9tpM9UikbdxAv5Us32X-GY~m7sJTrKDKxdc7w-QNqSWfP3B7MBXrm5q6Smd3tuiFuTuFfq5PGU5sVnPeAaDKLSdS9507~mWPq9ErvBu7d0YfgcmAjnnA1T5VKkFwaQjJ5l~npFlia1PvUGTH8Js9PG6DGKa~KQ7tBYJBzQL7kHszCBCWcKjD2zrncQRIZ6kdtu3k35IS0Q7lwBhmmxB9LyrZ7Ux4yQGsnbWg__' }}
            style={styles.designBannerImage}
            resizeMode="cover"
          />
          <View style={styles.designBannerOverlay}>
            <Text style={styles.designBannerTitle}>Design your{'\n'}Cloth</Text>
          </View>
        </View>
        
        {/* Design Categories */}
        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
        
        {/* Product Section Title */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Products' : 
              `${categories.find(cat => cat.id === selectedCategory)?.name} Products`}
          </Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {/* Products Grid */}
        <View style={styles.productsContainer}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(item => (
              <View key={item.id || item._id} style={styles.productItemWrapper}>
                {renderProductItem({ item })}
              </View>
            ))
          ) : (
            <View style={styles.noProductsContainer}>
              <Ionicons name="basket-outline" size={60} color="#b0bec5" />
              <Text style={styles.noProductsText}>No products found in this category</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#1e88e5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Design Banner Styles
  designBannerContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  designBannerImage: {
    width: '100%',
    height: '100%',
  },
  designBannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  designBannerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  
  // Categories Styles
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 12,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selectedCategoryItem: {
    borderBottomColor: '#1e88e5',
  },
//   categoryText: {
//     fontSize: 12,
//     color: '#6e6e6e',
//     marginBottom: 2,
//   },
  selectedCategoryText: {
    color: '#1e88e5',
    fontWeight: '500',
  },
  
  // Section Title Styles
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllText: {
    color: '#1e88e5',
    fontSize: 14,
  },
  
  // Products Grid Styles
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  productItemWrapper: {
    width: '50%',
    padding: 8,
  },
  productItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: '100%',
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#f5f5f5', // Light gray background for image loading
  },
  productImage: {
    width: '100%',
    height: 180,
  },
  productInfo: {
    padding: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#6e6e6e',
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cartButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 15,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
  },
  disabledCartButton: {
    backgroundColor: '#ffe5e5',
    borderColor: '#ffcdd2',
    borderWidth: 1,
  },
  noProductsContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noProductsText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  // Size display
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  sizeText: {
    fontSize: 12,
    color: '#6e6e6e',
    marginRight: 6,
    marginBottom: 4,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

export default ProductsScreen;