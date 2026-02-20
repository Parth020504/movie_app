import MovieCard from "@/components/MovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getSavedMovies } from "@/services/appwrite";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Image, RefreshControl, Text, View } from "react-native";

const Saved = () => {
  const { user } = useGlobalContext();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSavedMovies = useCallback(async () => {
    if (user?.$id) {
      setLoading(true);
      try {
        const res = await getSavedMovies(user.$id);
        const mappedMovies = res.map((doc: any) => ({
          id: doc.movie_id,
          title: doc.title,
          poster_path: doc.poster_url?.replace("https://image.tmdb.org/t/p/w500", ""),
          vote_average: doc.vote_average,
          release_date: doc.release_date,
          savedDocId: doc.$id
        }));
        setMovies(mappedMovies);
      } catch (error) {
        console.error("Error fetching saved movies:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchSavedMovies();
    }, [fetchSavedMovies])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchSavedMovies();
  };

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />

      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <MovieCard
            {...item}
            onRefresh={fetchSavedMovies} // 🔹 Pass the refresh function
          />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          paddingHorizontal: 20,
          marginBottom: 20
        }}
        contentContainerStyle={{ paddingBottom: 150 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF8F71" />
        }
        ListHeaderComponent={
          <View className="px-5 mt-20 mb-10">
            <Text className="text-white text-3xl font-bold">Saved Movies</Text>
            <Text className="text-gray-400 text-base mt-2">Movies you've marked to watch later</Text>
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <View className="items-center mt-20 px-10">
              <View className="w-32 h-32 bg-[#1C1C1C] rounded-full justify-center items-center border border-gray-800">
                <Image source={icons.save} className="size-12 opacity-50" tintColor="#fff" />
              </View>
              <Text className="text-white text-xl font-bold mt-8">No Saved Movies</Text>
              <Text className="text-gray-500 text-center mt-2">
                You haven't saved any movies yet. Explore and find something you like!
              </Text>
            </View>
          ) : (
            <ActivityIndicator size="large" color="#FF8F71" className="mt-20" />
          )
        }
      />
    </View>
  );
};

export default Saved;