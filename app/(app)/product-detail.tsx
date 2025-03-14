import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../components/cartcontext';  // Import the useCart hook
import NavigationHeader from './navigation-header'; // Import NavigationHeader

const { width } = Dimensions.get('window');

const ProductDetail = () => {
  const navigation = useNavigation();
  const { addToCart } = useCart();  // Use the addToCart function from the context

  const [selectedColor, setSelectedColor] = useState('red');
  const [selectedSize, setSelectedSize] = useState('S');
  const [quantity, setQuantity] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState('237.34');
  const [showQualityOptions, setShowQualityOptions] = useState(false);

  // Sample data options
  const colors = [
    { id: 'red', color: '#FF0000' },
    { id: 'blue', color: '#72B4C2' },
    { id: 'black', color: '#000000' },
  ];

  const sizes = [
    { id: 'S', label: 'S' },
    { id: 'M', label: 'M' },
    { id: 'L', label: 'L' },
  ];

  const qualityOptions = [
    { id: '180.50', label: '180.50' },
    { id: '200.75', label: '200.75' },
    { id: '237.34', label: '237.34' },
    { id: '250.00', label: '250.00' },
  ];

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const toggleQualityOptions = () => {
    setShowQualityOptions(!showQualityOptions);
  };

  const selectQuality = (quality) => {
    setSelectedQuality(quality);
    setShowQualityOptions(false);
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    const product = {
      id: `${selectedColor}-${selectedSize}-${selectedQuality}`,
      name: `Product ${selectedColor} ${selectedSize}`,
      color: selectedColor,
      size: selectedSize,
      quality: selectedQuality,
      price: parseFloat(selectedQuality), // Assuming price is the same as quality
      quantity,
    };

    addToCart(product); // Adding product to the cart using context
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      {/* Add Navigation Header here */}
      <NavigationHeader title="Product Details" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://s3-alpha-sig.figma.com/img/2536/4fa7/5335fdf391d9229fda9ae943da540bf0' }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        {/* Product Options */}
        <View style={styles.optionsContainer}>
          {/* Color Selection */}
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Color</Text>
            <View style={styles.colorOptions}>
              {colors.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.colorCircle, { backgroundColor: item.color }, selectedColor === item.id && styles.selectedColorBorder]}
                  onPress={() => setSelectedColor(item.id)}
                />
              ))}
            </View>
          </View>

          {/* Quality Selection */}
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Select Quality</Text>
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

          {/* Chosen Quality */}
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Chose Cloth Quality</Text>
            <View style={styles.qualitySelectorContainer}>
              {showQualityOptions && (
                <View style={styles.qualityDropdown}>
                  {qualityOptions.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[styles.qualityOption, selectedQuality === option.id && styles.selectedQualityOption]}
                      onPress={() => selectQuality(option.id)}
                    >
                      <Text style={styles.qualityOptionText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <TouchableOpacity style={styles.qualitySelector} onPress={toggleQualityOptions}>
                <Text style={styles.qualityValue}>{selectedQuality}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Size Selection */}
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Select Size</Text>
            <View style={styles.sizeOptions}>
              {sizes.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.sizeCircle, selectedSize === item.id && styles.selectedSize]}
                  onPress={() => setSelectedSize(item.id)}
                >
                  <Text style={[styles.sizeText, selectedSize === item.id && styles.selectedSizeText]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Ionicons name="bag-outline" size={22} color="white" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
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
  optionsContainer: {
    padding: 16,
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
  },
  qualityValue: {
    fontSize: 16,
    color: '#333',
  },
  qualitySubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: -12,
    marginBottom: 16,
    marginLeft: '40%',
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