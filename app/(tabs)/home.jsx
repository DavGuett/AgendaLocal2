import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { images } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getAllEvents, getLatestPosts } from "../../lib/appwrite";
import { EmptyState, SearchInput } from "../../components";
import CardList from "../../components/CardList";
import { TouchableOpacity } from "react-native";

const Home = () => {
  const { data: events, refetch } = useAppwrite(getAllEvents);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  // one flatlist
  // with list header
  // and horizontal flatlist

  //  we cannot do that with just scrollview as there's both horizontal and vertical scroll (two flat lists, within trending)

  return (
    <SafeAreaView className="bg-primary">
      <FlatList
        data={events}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <CardList
              title={item.title}
              description={item.description}
              url={item.thumbnail}
              tag={item.tag}
            />
          </TouchableOpacity>
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Bem Vindo de Volta
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  DavidGuetten
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Eventos
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="Sem Eventos Encontrados"
            subtitle="Nenhum evento criado"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="bg-primary flex-1 justify-center items-center">
            <Text className="text-xl font-semibold text-white">
              {selectedItem.title}
            </Text>
            <Image source={{ uri: selectedItem.url }} resizeMode="contain" />
            <View className="p-4 md:p-5 space-y-4">
              <Text className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {selectedItem.description}
              </Text>
            </View>

            <View className="flex items-start p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <Text className="text-blue-500 bg-blue-100 px-2 py-1 rounded-full mr-2">
                {selectedItem.tag}
              </Text>
            </View>

            <View>
              <Button title="Fechar" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default Home;
