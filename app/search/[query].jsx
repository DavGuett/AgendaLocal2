import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useAppwrite from "../../lib/useAppwrite";
import { searchEvents } from "../../lib/appwrite";
import { EmptyState, SearchInput, VideoCard } from "../../components";
import CardList from "../../components/CardList";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: events, refetch } = useAppwrite(() => searchEvents(query));

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={events}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <CardList
            title={item.title}
            description={item.description}
            url={item.url}
          />
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
    </SafeAreaView>
  );
};

export default Search;
