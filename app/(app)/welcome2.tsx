import React from "react";
import { ImageBackground, View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const image = require("@/assets/images/welcome.png");

const WelcomeTwo = () => {
  return (
    <View className="flex-1">
      <ImageBackground source={image} className="h-screen w-full">
        <View className="flex-1 bg-black/30 justify-center items-center">
          <View className="items-center p-5">
            <Text className="text-4xl font-bold text-white mb-2 text-center">
              Swap Rush
            </Text>
            <Text className="text-lg text-white mb-10 text-center">
              Explore the new world of clothing
            </Text>
            
            <View className="w-full max-w-xs space-y-8 mt-5">
              <TouchableOpacity 
                className="bg-white py-3 px-8 rounded-full w-full items-center" 
                onPress={() => router.replace('/sign-in')}
              >
                <Text className="text-black font-bold text-base">
                  Sign In
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="bg-transparent py-3 px-8 rounded-full w-full items-center border border-white" 
                onPress={() => router.replace('/sign-up')}
              >
                <Text className="text-white font-bold text-base">
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