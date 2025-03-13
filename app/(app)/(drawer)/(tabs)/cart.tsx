import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import NavigationHeader from '../../navigation-header';

const ShoppingCart = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      title: 'Non excepturi come dolor sighs',
      price: 15,
      quantity: 2,
      image: 'https://via.placeholder.com/80'
    },
    {
      id: 2,
      title: 'Lorem ipsum dolor Auf labor',
      price: 24,
      quantity: 1,
      image: 'https://via.placeholder.com/80'
    },
    {
      id: 3,
      title: 'In modi dius qui iuste lorem',
      price: 31,
      quantity: 1,
      image: 'https://via.placeholder.com/80'
    }
  ]);

  // Calculate total amount
  const totalAmount = products.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);

  // Function to handle quantity changes
  const updateQuantity = (id, increment) => {
    setProducts(products.map(product => {
      if (product.id === id) {
        const newQuantity = product.quantity + increment;
        // Ensure quantity doesn't go below 1
        return {
          ...product,
          quantity: newQuantity < 1 ? 1 : newQuantity
        };
      }
      return product;
    }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Product List */}
       <NavigationHeader title="Cart" />
      <View style={styles.productList}>
        {products.map(product => (
          <View key={product.id} style={styles.productCard}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>{product.title}</Text>
              <Text style={styles.productPrice}>PKR-{product.price}</Text>
            </View>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={() => updateQuantity(product.id, -1)}
              >
                <Feather name="minus" size={18} color="#000" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{product.quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={() => updateQuantity(product.id, 1)}
              >
                <Feather name="plus" size={18} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Total Section */}
      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total Amount</Text>
          <Text style={styles.totalAmount}>PKR-{totalAmount}</Text>
        </View>
      </View>

      {/* Checkout Button */}
      <TouchableOpacity style={styles.checkoutButton}>
        <Feather name="lock" size={16} color="#fff" style={styles.lockIcon} />
        <Text style={styles.checkoutText}>Checkout Security</Text>
      </TouchableOpacity>
    </ScrollView>
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
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 12,
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
  totalText: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  checkoutButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 24,
  },
  lockIcon: {
    marginRight: 8,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShoppingCart;