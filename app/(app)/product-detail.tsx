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

const { width } = Dimensions.get('window');

const ProductDetail = () => {
  const navigation = useNavigation();
  const [selectedColor, setSelectedColor] = useState('red');
  const [selectedSize, setSelectedSize] = useState('S');
  const [quantity, setQuantity] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState('237.34');
  const [showQualityOptions, setShowQualityOptions] = useState(false);
// sample data options
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

  const handleGoBack = () => {
    navigation.goBack();
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Preview</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconContainer}>
              <Ionicons name="search-outline" size={22} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconContainer, styles.bagIcon]}>
              <Ionicons name="bag-outline" size={22} color="black" />
              <View style={styles.bagBadge}>
                <Text style={styles.bagBadgeText}>1</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://s3-alpha-sig.figma.com/img/2536/4fa7/5335fdf391d9229fda9ae943da540bf0?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=axuJF9Hz0TLrPB4eHsZrFK5~fngwZxumNQbf4g2VXWZDxhWWXP~jB9CZ7-MiuefXbz-wzi3chDodf1pmQ0KYWy~bUrOneo7~Zc9J4F4JgaT4~~xu~KmMFyeLW6RCXCCjYa2Yns8-cNaodZf8N9zR2dem0LI-dn~7P8CSYX0QAPshjmaL-oNIQKZwG3Cd4TuYdRj09DqwWBnGgvJvmkjKbXrFpR5e59g8cEqTywvhDhUF0sli6IctWlpUAnwDYj1heiR-hXWb2CNJ7KQ0hTnHkA1wtOFJvYl3-USxmYbrkWzM7JFURY-awPhon8rPX1TCXkZF4AUae~QEVGGaASfa2w__' }}
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
                  style={[
                    styles.colorCircle,
                    { backgroundColor: item.color },
                    selectedColor === item.id && styles.selectedColorBorder,
                  ]}
                  onPress={() => setSelectedColor(item.id)}
                />
              ))}
            </View>
          </View>

          {/* Quality Selection */}
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Select Quality</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.decreaseButton} 
                onPress={decreaseQuantity}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <View style={styles.quantityValue}>
                <Text>{quantity}</Text>
              </View>
              <TouchableOpacity 
                style={styles.increaseButton} 
                onPress={increaseQuantity}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
         

          {/* Chosen Quality */}
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Chose cloth Quality</Text>
            <View style={styles.qualitySelectorContainer}>
              {showQualityOptions && (
                <View style={styles.qualityDropdown}>
                  {qualityOptions.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.qualityOption,
                        selectedQuality === option.id && styles.selectedQualityOption
                      ]}
                      onPress={() => selectQuality(option.id)}
                    >
                      <Text style={styles.qualityOptionText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <TouchableOpacity 
                style={styles.qualitySelector}
                onPress={toggleQualityOptions}
              >
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
                  style={[
                    styles.sizeCircle,
                    selectedSize === item.id && styles.selectedSize,
                  ]}
                  onPress={() => setSelectedSize(item.id)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === item.id && styles.selectedSizeText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity style={styles.addToCartButton}>
            <Ionicons name="bag-outline" size={22} color="white" />
            <Text style={styles.addToCartText}>Add Cart</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  bagIcon: {
    position: 'relative',
  },
  bagBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bagBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
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