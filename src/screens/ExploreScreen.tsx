import React, { useState, useCallback, useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { SearchBar, MovieCard, LoadingSpinner } from "../components";
import { searchMovies, getTrendingMovies } from "../services/tmdb";
import { colors, spacing, fontSize, fontWeight } from "../styles/theme";
import type { Movie, RootStackParamList } from "../types/movie";

const { width } = Dimensions.get("window");
const DEBOUNCE_DELAY = 600; // 600ms debounce

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ExploreScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Load trending movies initially
  useEffect(() => {
    const loadInitialMovies = async () => {
      try {
        const response = await getTrendingMovies("day");
        setMovies(response.results);
      } catch (err) {
        console.error("Error loading initial movies:", err);
      } finally {
        setInitialLoading(false);
      }
    };
    loadInitialMovies();
  }, []);

  // Debounced search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!query.trim()) {
      // Reset to trending if empty
      getTrendingMovies("day").then((response) => {
        setMovies(response.results);
      });
      return;
    }

    // Set debounce timer
    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await searchMovies(query);
        setMovies(response.results);

        if (response.results.length === 0) {
          setError(`No results found for "${query}"`);
        }
      } catch (err) {
        setError("Search failed. Please try again.");
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_DELAY);
  }, []);

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate("MovieDetail", { movieId: movie.id });
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <MovieCard
      movie={item}
      variant="vertical"
      onPress={handleMoviePress}
      showRating={true}
    />
  );

  if (initialLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search for movies..."
          style={styles.searchBar}
        />
      </View>

      {loading ? (
        <LoadingSpinner size="small" />
      ) : error && movies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => `search-${item.id}`}
          renderItem={renderMovieItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            searchQuery ? (
              <Text style={styles.resultsText}>
                Results for "{searchQuery}"
              </Text>
            ) : (
              <Text style={styles.resultsText}>Trending Today</Text>
            )
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  searchBar: {
    marginBottom: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  row: {
    justifyContent: "space-between",
  },
  resultsText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
