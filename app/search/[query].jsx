import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useAppwrite from "../../lib/useAppwrite";
import { searchEvents } from "../../lib/appwrite";
import { EmptyState, SearchInput, VideoCard } from "../../components";
import CardList from "../../components/CardList";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: events, refetch } = useAppwrite(() => searchEvents(query));
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
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
          <>
            <View className="flex my-6 px-4">
              <Text className="font-pmedium text-gray-100 text-sm">
                Resultados
              </Text>
              <Text className="text-2xl font-psemibold text-white mt-1">
                {query}
              </Text>

              <View className="mt-6 mb-8">
                <SearchInput initialQuery={query} refetch={refetch} />
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="Nenhum evento encontrado"
            subtitle="Nenhum evento para essa pesquisa"
          />
        )}
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

export default Search;
