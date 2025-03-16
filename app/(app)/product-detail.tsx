import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../../components/cartcontext';
import NavigationHeader from './navigation-header';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');
const IMAGE_BASE_URL = 'https://ecommerce-app-backend-indol.vercel.app'; // Base URL for images
const API_BASE_URL = 'https://ecommerce-app-backend-indol.vercel.app/api/products'; // Base API URL


const ProductDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { addToCart, getCartSupplierId } = useCart();
  
  // Get productId from route params
  const productId = route.params?.productId;
  
  // State variables
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState('');
  const [showQualityOptions, setShowQualityOptions] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [hasSupplierConflict, setHasSupplierConflict] = useState(false);
  
  // Fetch product details when component mounts
  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    } else {
      setLoading(false);
      setError('Product ID not provided');
    }
  }, [productId]);
  
  // Function to fetch product details from API
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/get-product-by-id/${productId}`);
      
      if (response.data && response.data.message === 'Product fetched successfully') {
        const fetchedProduct = response.data.products;
        setProduct(fetchedProduct);
        
        // Parse product options and set initial selections
        const colors = parseArrayField(fetchedProduct.color);
        const sizes = parseArrayField(fetchedProduct.size);
        const qualities = parseArrayField(fetchedProduct.quality);
        
        setSelectedColor(colors[0] || '');
        setSelectedSize(sizes[0] || '');
        setSelectedQuality(qualities[0] || '');
        
        // Check for supplier conflict
        checkSupplierConflict(fetchedProduct.supplierId);
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      setError('Failed to load product details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Check for supplier conflicts
  const checkSupplierConflict = (productSupplierId) => {
    // Get current cart supplier ID
    const currentSupplierId = getCartSupplierId();
    
    // If no current supplier or IDs match, no conflict
    if (!currentSupplierId || !productSupplierId) {
      setHasSupplierConflict(false);
      return;
    }
    
    // Different suppliers - conflict exists
    if (currentSupplierId !== productSupplierId) {
      setHasSupplierConflict(true);
    } else {
      setHasSupplierConflict(false);
    }
  };
  
  // Parse product data (handling array fields that might be JSON strings)
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

  // Get parsed options for UI
  const getColorOptions = () => product ? parseArrayField(product.color) : [];
  const getQualityOptions = () => product ? parseArrayField(product.quality) : [];
  const getSizeOptions = () => product ? parseArrayField(product.size) : [];

  // Quantity management
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Quality dropdown management
  const toggleQualityOptions = () => {
    setShowQualityOptions(!showQualityOptions);
  };

  const selectQuality = (quality) => {
    setSelectedQuality(quality);
    setShowQualityOptions(false);
  };

  // Format image URL
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

  // Handle Add to Cart
  const handleAddToCart = async () => {
    // Check if all options are selected
    if (!selectedColor || !selectedSize || !selectedQuality) {
      Alert.alert('Selection Required', 'Please select all product options before adding to cart.');
      return;
    }
    
    // Prevent adding to cart if there's a supplier conflict
    if (hasSupplierConflict) {
      Alert.alert(
        "Cannot Add Product",
        "You can only add products from the same supplier in a single order. Please complete your current order or clear your cart before adding products from a different supplier."
      );
      return;
    }

    // Create cart product object with supplierId
    const cartProduct = {
      id: product._id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      quality: selectedQuality,
      quantity: quantity,
      image: product.image,
      supplierId: product.supplierId // Include supplierId
    };

    setAddingToCart(true);
    try {
      // The addToCart function now returns a boolean success value
      const success = await addToCart(cartProduct);
      
      if (success) {
        Toast.show({
          type: 'success',
          text1: 'Product Added to Cart',
          text2: `${quantity} x ${product.name}`,
        })
      }
      // If not successful, the cart context already showed an error message
    } finally {
      setAddingToCart(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader title="Loading Product..." />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e88e5" />
          <Text style={styles.loadingText}>Loading product details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader title="Product Details" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#ff4d4d" />
          <Text style={styles.errorText}>{error || 'Product information not available'}</Text>
          {productId && (
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchProductDetails}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Get options for display
  const colorOptions = getColorOptions();
  const qualityOptions = getQualityOptions();
  const sizeOptions = getSizeOptions();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      <NavigationHeader title={product.name || "Product Details"} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: formatImageUrl(product.image) }}
            style={styles.productImage}
            resizeMode="cover"
            defaultSource={require('@/assets/images/product-placeholder.jpeg')}
          />
        </View>
        
        {/* Product Info */}
        <View style={styles.productInfoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productCategory}>{product.category}</Text>
          <Text style={styles.productPrice}>PKR {product.price}</Text>
        </View>

        {/* Supplier Conflict Warning */}
        {hasSupplierConflict && (
          <View style={styles.warningContainer}>
            <Ionicons name="warning-outline" size={24} color="#ff9800" />
            <Text style={styles.warningText}>
              This product is from a different supplier than items in your cart. 
              You need to complete or clear your current order before adding this product.
            </Text>
          </View>
        )}

        {/* Product Options */}
        <View style={styles.optionsContainer}>
          {/* Color Selection - Only show if colors are available */}
          {colorOptions.length > 0 && (
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Color</Text>
              <View style={styles.colorOptions}>
                {colorOptions.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorCircle, 
                      { backgroundColor: color.toLowerCase() },
                      selectedColor === color && styles.selectedColorBorder
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Quantity Selection */}
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Select Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity style={styles.decreaseButton} onPress={decreaseQuantity}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <View style={styles.quantityValue}>
                <Text>{quantity}</Text>
              </View>
              <TouchableOpacity style={styles.increaseButton} onPress={increaseQuantity}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quality Selection - Only show if qualities are available */}
          {qualityOptions.length > 0 && (
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Choose Cloth Quality</Text>
              <View style={styles.qualitySelectorContainer}>
                {showQualityOptions && (
                  <View style={styles.qualityDropdown}>
                    {qualityOptions.map((quality, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.qualityOption, 
                          selectedQuality === quality && styles.selectedQualityOption
                        ]}
                        onPress={() => selectQuality(quality)}
                      >
                        <Text style={styles.qualityOptionText}>{quality}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                <TouchableOpacity style={styles.qualitySelector} onPress={toggleQualityOptions}>
                  <Text style={styles.qualityValue}>{selectedQuality || "Select"}</Text>
                  <Ionicons name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Size Selection - Only show if sizes are available */}
          {sizeOptions.length > 0 && (
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Select Size</Text>
              <View style={styles.sizeOptions}>
                {sizeOptions.map((size, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.sizeCircle, 
                      selectedSize === size && styles.selectedSize
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text 
                      style={[
                        styles.sizeText, 
                        selectedSize === size && styles.selectedSizeText
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Add to Cart Button */}
          <TouchableOpacity 
            style={[
              styles.addToCartButton,
              hasSupplierConflict && styles.disabledButton
            ]}
            onPress={handleAddToCart}
            disabled={hasSupplierConflict || addingToCart}
          >
            {addingToCart ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="bag-outline" size={22} color="white" />
                <Text style={styles.addToCartText}>
                  {hasSupplierConflict ? 'Cannot Add To Cart' : 'Add to Cart'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  imageContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  productImage: {
    width: '100%',
    height: 360,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  productInfoContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e88e5',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  warningText: {
    flex: 1,
    marginLeft: 8,
    color: '#e65100',
    fontSize: 14,
  },
  optionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
    width: '40%',
  },
  colorOptions: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'flex-start',
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 16,
  },
  selectedColorBorder: {
    borderWidth: 2,
    borderColor: '#ddd',
  },
  qualitySelectorContainer: {
    position: 'relative',
    width: '60%',
  },
  qualitySelector: {
    backgroundColor: '#e9e9e9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qualityValue: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  qualityDropdown: {
    marginBottom: 4,
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',
    position: 'absolute',
    bottom: '100%',
    right: 0,
    zIndex: 1000,
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qualityOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedQualityOption: {
    backgroundColor: '#f0f0f0',
  },
  qualityOptionText: {
    fontSize: 14,
  },
  sizeOptions: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'flex-start',
  },
  sizeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedSize: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  sizeText: {
    fontSize: 14,
    color: '#333',
  },
  selectedSizeText: {
    color: 'white',
  },
  addToCartButton: {
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 50,
    marginTop: 12,
    marginBottom:30,
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  decreaseButton: {
    width: 36,
    height: 36,
    backgroundColor: '#e9e9e9',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  increaseButton: {
    width: 36,
    height: 36,
    backgroundColor: '#e9e9e9',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    width: 48,
    height: 36,
    backgroundColor: '#e9e9e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProductDetail;