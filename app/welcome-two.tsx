import React from "react";
import { ImageBackground, View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const image = require("@/assets/images/welcome.png");

const WelcomeTwo = () => {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground 
        source={image} 
        style={{ width: '100%', height: '100%' }}
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
            
            <View style={{ width: '100%', maxWidth: 320, marginTop: 20 }}>
              <TouchableOpacity 
                style={{ 
                  backgroundColor: 'white', 
                  paddingVertical: 12, 
                  paddingHorizontal: 24, 
                  borderRadius: 30, 
                  width: '100%', 
                  alignItems: 'center',
                }}
                onPress={() => router.replace('/sign-in')}
              >
                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16 }}>
                  Sign In
                </Text>
              </TouchableOpacity>
              
              {/* Adding margin between buttons */}
              <View style={{ height: 32 }} />
              
              <TouchableOpacity 
                style={{ 
                  backgroundColor: 'transparent', 
                  paddingVertical: 12, 
                  paddingHorizontal: 24, 
                  borderRadius: 30, 
                  width: '100%', 
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'white'
                }}
                onPress={() => router.replace('/sign-up')}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default WelcomeTwo;