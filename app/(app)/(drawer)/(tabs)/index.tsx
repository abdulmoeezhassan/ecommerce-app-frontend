import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NavigationHeader from '../../navigation-header';
const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('T-shirt');
  
  const categories = ['T-shirt', 'Hoodies', 'Jacket'];
  //sample category added
  const clothingItems = {
    'T-shirt': [
      { id: 1, image: require('../../../../assets/images/auth-bg.png'), title: 'BELIEVE' },
      { id: 2, image: require('../../../../assets/images/auth-bg.png'), title: 'Custom Design' },
    ],
    'Hoodies': [
      { id: 3, image: require('../../../../assets/images/auth-bg.png'), title: 'GOOD VIBES' },
      { id: 4, image: require('../../../../assets/images/auth-bg.png'), title: 'Custom Design' },
    ],
    'Jacket': [
      { id: 5, image: require('../../../../assets/images/auth-bg.png'), title: 'Leather Jacket' },
      { id: 6, image: require('../../../../assets/images/auth-bg.png'), title: 'Custom Design' },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <NavigationHeader title={'Home'} />
   
      
      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <Image 
          source={{uri:"https://s3-alpha-sig.figma.com/img/eaca/75f8/d634283bec04f97c63ec4ea1d9763d77?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=t~QAzLnVRq814zf6T8ivWJB-euaiGBPZ-ru4Y8d-H5yAZor2VcM7zcX3mOJrWTNsfya~677N23MI~P~a4k1z2ldtWHgb2-yToB2ixZPV9s0XfHK4Ar9tpM9UikbdxAv5Us32X-GY~m7sJTrKDKxdc7w-QNqSWfP3B7MBXrm5q6Smd3tuiFuTuFfq5PGU5sVnPeAaDKLSdS9507~mWPq9ErvBu7d0YfgcmAjnnA1T5VKkFwaQjJ5l~npFlia1PvUGTH8Js9PG6DGKa~KQ7tBYJBzQL7kHszCBCWcKjD2zrncQRIZ6kdtu3k35IS0Q7lwBhmmxB9LyrZ7Ux4yQGsnbWg__"}} 
          style={styles.heroImage}
        />
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>Design your</Text>
          <Text style={styles.heroTitle}>Cloth</Text>
        </View>
      </View>
      
      {/* Category Tabs */}
      <View style={styles.categoryTabs}>
        {categories.map((category) => (
          <TouchableOpacity 
          key={category} 
          style={[
            styles.categoryTab, 
            selectedCategory === category && styles.selectedCategoryTab
          ]}
          onPress={() => setSelectedCategory(category)}
        >
            <Text style={styles.categoryText}>{category}</Text>
            {selectedCategory === category && <View style={styles.categoryIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Product List */}
      <ScrollView style={styles.productsContainer}>
        {clothingItems[selectedCategory].map((item) => (
          <View key={item.id} style={styles.productCard}>
            <Image source={item.image} style={styles.productImage} />
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addToCartButton}>
              <Ionicons name="cart" size={20} color="black" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    marginRight: 15,
  },
  cartButton: {
    backgroundColor: 'black',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  heroBanner: {
    height: 200,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  heroTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  categoryTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryTab: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    position: 'relative',
  },
  selectedCategoryTab: {
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 16,
  },
  categoryIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'black',
  },
  productsContainer: {
    flex: 1,
    padding: 10,
  },
  productCard: {
    height: 220,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;