import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import NavigationHeader from '../../navigation-header';
import { useCart } from '../../../../components/cartcontext';
import { useNavigation } from '@react-navigation/native';

const IMAGE_BASE_URL = 'http://localhost:3000'; // Base URL for images

const ShoppingCart = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useCart();
  const navigation = useNavigation();

  // Calculate total amount
  const totalAmount = cart.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);

  // Format image URL
  const formatImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://via.placeholder.com/80';
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

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Add some products before checkout.');
      return;
    }
    
    // Navigate to checkout screen or process checkout
    // navigation.navigate('Checkout');
    Alert.alert('Checkout', 'Proceeding to checkout...');
  };

  // Handle clear cart with confirmation
  const handleClearCart = () => {
    if (cart.length === 0) return;
    
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          onPress: () => clearCart(),
          style: 'destructive'
        }
      ]
    );
  };

  // Empty cart view
  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <NavigationHeader title="Cart" />
        <View style={styles.emptyCartContainer}>
          <Feather name="shopping-cart" size={64} color="#ccc" />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={() => navigation.navigate('products-listing')}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavigationHeader title="Cart" />
      
      <ScrollView>
        {/* Product List */}
        <View style={styles.productList}>
          {cart.map(product => (
            <View key={product.id} style={styles.productCard}>
              <Image 
                source={{ uri: formatImageUrl(product.image) }}
                style={styles.productImage}
                defaultSource={require('@/assets/images/product-placeholder.jpeg')}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{product.name}</Text>
                {product.color && <Text style={styles.productMeta}>Color: {product.color}</Text>}
                {product.size && <Text style={styles.productMeta}>Size: {product.size}</Text>}
                {product.quality && <Text style={styles.productMeta}>Quality: {product.quality}</Text>}
                <Text style={styles.productPrice}>PKR {product.price}</Text>
              </View>
              
              <View style={styles.rightSection}>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeFromCart(product.id)}
                >
                  <Feather name="trash-2" size={18} color="#ff4d4d" />
                </TouchableOpacity>
                
                <View style={styles.quantityControls}>
                  <TouchableOpacity 
                    style={styles.quantityButton} 
                    onPress={() => decreaseQuantity(product.id)}
                  >
                    <Feather name="minus" size={18} color="#000" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{product.quantity}</Text>
                  <TouchableOpacity 
                    style={styles.quantityButton} 
                    onPress={() => increaseQuantity(product.id)}
                  >
                    <Feather name="plus" size={18} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Total Section */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Subtotal</Text>
            <Text style={styles.totalAmount}>PKR {totalAmount}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Shipping</Text>
            <Text style={styles.totalAmount}>PKR 0</Text>
          </View>
          
          <View style={[styles.totalRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalText}>Total Amount</Text>
            <Text style={styles.grandTotalAmount}>PKR {totalAmount}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearCart}
          >
            <Text style={styles.clearButtonText}>Clear Cart</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Feather name="lock" size={16} color="#fff" style={styles.lockIcon} />
            <Text style={styles.checkoutText}>Checkout Securely</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  productList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 16,
    marginTop: 16,
  },
  productCard: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  productMeta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  removeButton: {
    padding: 8,
    alignSelf: 'flex-end',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  totalSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 8,
    paddingTop: 16,
  },
  totalText: {
    fontSize: 14,
    color: '#666',
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: '500',
  },
  grandTotalText: {
    fontSize: 16,
    fontWeight: '600',
  },
  grandTotalAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
  },
  clearButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  checkoutButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginLeft: 12,
  },
  lockIcon: {
    marginRight: 8,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  continueShoppingButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  continueShoppingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ShoppingCart;