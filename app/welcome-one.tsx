import React from "react";
import { ImageBackground, View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";

const image = require("@/assets/images/welcome.png");

const WelcomeOne = () => {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground 
        source={image} 
        style={{ width: '100%', height: '100%', overflowX: 'hidden' }}
        resizeMode="cover"
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 36, fontWeight: 'bold', color: 'white', marginBottom: 8, textAlign: 'center' }}>
              Swap Rush
            </Text>
            <Text style={{ fontSize: 18, color: 'white', marginBottom: 40, textAlign: 'center' }}>
              Explore the new world of clothing
            </Text>
            <TouchableOpacity 
              style={{ backgroundColor: 'white', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 30, marginTop: 20, flexDirection: 'row', alignItems: 'center' }}
              onPress={() => router.replace('/welcome-two')}
            >
              <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16, marginRight: 8 }}>
                Let's Explore
              </Text>
              <AntDesign name="right" size={16} color="black" />
              <AntDesign name="right" size={16} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default WelcomeOne;