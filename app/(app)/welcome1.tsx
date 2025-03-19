import React from "react";
import { ImageBackground, View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons"; // Make sure you have expo vector icons installed
import { router } from "expo-router";

const image = require("@/assets/images/welcome.png");

const WelcomeOne = () => {
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
            <TouchableOpacity
              className="bg-white py-3 px-8 rounded-full mt-5 flex-row items-center"
              onPressIn={() => router.replace('/welcome2')}
            >              <Text className="text-black font-bold text-base mr-2">
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