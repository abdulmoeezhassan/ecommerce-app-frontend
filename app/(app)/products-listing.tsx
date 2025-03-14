import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import NavigationHeader from './navigation-header';
// Get screen width for responsive design
const { width } = Dimensions.get('window');

// Sample product data
const PRODUCTS = [
  {
    id: '1',
    name: 'Blue Hoodie Shirt',
    price: 15,
    image: 'https://via.placeholder.com/150',
    isFavorite: false
  },
  {
    id: '2',
    name: 'White Sweatshirt',
    price: 31,
    image: 'https://via.placeholder.com/150',
    isFavorite: false
  },
  {
    id: '3',
    name: 'Black Jeans',
    price: 45,
    image: 'https://via.placeholder.com/150',
    isFavorite: false
  },
  {
    id: '4',
    name: 'Green T-Shirt',
    price: 22,
    image: 'https://via.placeholder.com/150',
    isFavorite: false
  },
  {
    id: '5',
    name: 'Red Cap',
    price: 18,
    image: 'https://via.placeholder.com/150',
    isFavorite: false
  },
  {
    id: '6',
    name: 'Denim Jacket',
    price: 65,
    image: 'https://via.placeholder.com/150',
    isFavorite: false
  },
];

// Design categories
const CATEGORIES = [
    {
        id: '1',
        name: 'All',
        icon: 'shirt-outline'
      },
  {
    id: '2',
    name: 'T-shirt',
    icon: 'shirt-outline'
  },
  {
    id: '3',
    name: 'Hoodies',
    icon: 'shirt-outline'
  },
  {
    id: '4',
    name: 'Jacket',
    icon: 'shirt-outline'
  }
];

const ProductsScreen = () => {
  const [products, setProducts] = useState(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigation = useNavigation();
  const router = useRouter();

  const toggleFavorite = (id) => {
    setProducts(
      products.map(product => 
        product.id === id 
          ? {...product, isFavorite: !product.isFavorite} 
          : product
      )
    );
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.productImage} 
          resizeMode="cover"
        />
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons 
            name={item.isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={item.isFavorite ? "#ff4d4d" : "white"} 
          />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
      <TouchableOpacity style={styles.cartButton}>
        <Ionicons name="bag-outline" size={18} color="black" />
      </TouchableOpacity>
    </View>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.categoryItem, 
        selectedCategory === item.id && styles.selectedCategoryItem
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      {/* <Ionicons 
        name={item.icon} 
        size={24} 
        color={selectedCategory === item.id ? "#1e88e5" : "#6e6e6e"} 
      /> */}
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

  return (
    <SafeAreaView style={styles.container}>
    <NavigationHeader 
        title="Products"
      // Use navigation here
    //   onCartPress={() => router.push('/cart')} // Navigate to the Cart screen
    //   onProfilePress={() => router.push('/profile')} // Navigate to the Profile screen
    />
    
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
          data={CATEGORIES}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {/* Product Section Title */}
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Popular Products</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      {/* Products Grid */}
      <View style={styles.productsContainer}>
        {products.map(item => (
          <View key={item.id} style={styles.productItemWrapper}>
            {renderProductItem({ item })}
          </View>
        ))}
      </View>
    </ScrollView>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 4,
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
  categoryText: {
    marginTop: 4,
    color: '#6e6e6e',
    fontSize: 14,
  },
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
  },
  productImage: {
    width: '100%',
    height: 180,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    padding: 6,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 15,
    padding: 8,
  },
});

export default ProductsScreen;