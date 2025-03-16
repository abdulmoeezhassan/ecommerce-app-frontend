import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const router = useRouter();
  const categories = [
    { name: 'T-shirts', image: require('@/assets/images/t-shirts.jpg') },
    { name: 'Hoodies', image: require('@/assets/images/hoodies.png') },
    { name: 'Jacket', image: require('@/assets/images/jackets.jpg') },
  ];
  const headerImage = require("@/assets/images/headerpic.png");
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCategoryPress = (category) => {
    router.push({ pathname: '/products-listing', params: { category } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <Image 
          source={headerImage }
          style={styles.heroImage}
        />
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>Design your</Text>
          <Text style={styles.heroTitle}>Cloth</Text>
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryTabs}>
        {['All', ...categories.map((c) => c.name)].map((category) => (
          <TouchableOpacity key={category} style={styles.tab} onPress={() => setSelectedCategory(category)}>
            <Text style={[styles.tabText, selectedCategory === category && styles.selectedTabText]}>
              {category}
            </Text>
            {selectedCategory === category && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Display Selected Category */}
      <ScrollView contentContainerStyle={styles.imageList}>
        {categories
          .filter((category) => selectedCategory === 'All' || category.name === selectedCategory)
          .map((category) => (
            <TouchableOpacity key={category.name} style={styles.imageContainer} onPress={() => handleCategoryPress(category.name)}>
              <Image source={category.image} style={styles.image} />
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroBanner: { height: 200, position: 'relative' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroTextContainer: { position: 'absolute', top: 0, left: 20, justifyContent: 'center' },
  heroTitle: { color: 'white', fontSize: 32, fontWeight: 'bold' },

  categoryTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: { alignItems: 'center' },
  tabText: { fontSize: 16, fontWeight: 'bold', color: '#555' },
  selectedTabText: { color: 'black' },
  activeIndicator: { width: '80%', height: 2, backgroundColor: 'black', marginTop: 5 },

  imageList: { paddingVertical: 10 },
  imageContainer: { marginBottom: 15, alignItems: 'center' },
  image: { width: '90%', height: 150, resizeMode: 'cover', borderRadius: 10 },
  categoryText: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
});

export default HomeScreen;
