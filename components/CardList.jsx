import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image } from "react-native";

import { icons } from "../constants";

const CardList = ({ title, description, url, tag, ...props }) => {
  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-center">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text className="font-psemibold text-sm text-white">{title}</Text>
            <View className="w-[200px] h-[200px] mt-6">
              <Image
                source={{ uri: url }}
                className="w-full h-full rounded-lg"
                resizeMode="cover"
              />
            </View>
            <Text
              numberOfLines={10}
              className="text-xs text-gray-100 font-pregular"
            >
              {description}
            </Text>
            <Text className="text-blue-500  bg-blue-100 px-2 py-1 rounded-full mr-2">
              {tag}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CardList;
