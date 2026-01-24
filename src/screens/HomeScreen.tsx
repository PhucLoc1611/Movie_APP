import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
  Pressable,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Play, ChevronRight } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { MovieCard, CategoryPill, LoadingSpinner } from "../components";
import {
  getTrendingMovies,
  getBackdropURL,
  getGenreNames,
} from "../services/tmdb";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
} from "../styles/theme";
import type { Movie, RootStackParamList } from "../types/movie";

const { width, height } = Dimensions.get("window");
const HERO_HEIGHT = height * 0.55;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const response = await getTrendingMovies("week");
      setTrendingMovies(response.results);

      // Set random featured movie from top 5
      if (response.results.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * Math.min(5, response.results.length),
        );
        setFeaturedMovie(response.results[randomIndex]);
      }
    } catch (err) {
      setError("Failed to load movies. Please check your API key.");
      console.error("Error fetching trending movies:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate("MovieDetail", { movieId: movie.id });
  };

  if (loading) {
    return <LoadingSpinner message="Loading movies..." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const genres = featuredMovie ? getGenreNames(featuredMovie.genre_ids) : [];
  const releaseYear = featuredMovie?.release_date?.split("-")[0] || "";

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Hero Section */}
        {featuredMovie && (
          <View style={styles.heroContainer}>
            <Image
              source={{ uri: getBackdropURL(featuredMovie.backdrop_path) }}
              style={styles.heroImage}
              contentFit="cover"
              transition={300}
            />
            <LinearGradient
              colors={["transparent", "rgba(13,13,13,0.8)", colors.background]}
              style={styles.heroGradient}
            />

            {/* Hero Content */}
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{featuredMovie.title}</Text>

              {/* Category Pills */}
              <View style={styles.pillsContainer}>
                {genres.map((genre) => (
                  <CategoryPill key={genre} label={genre} />
                ))}
                {releaseYear && <CategoryPill label={releaseYear} />}
              </View>

              {/* Play Button */}
              <Pressable
                style={styles.playButton}
                onPress={() => handleMoviePress(featuredMovie)}
              >
                <Play
                  size={24}
                  color={colors.textPrimary}
                  fill={colors.textPrimary}
                />
              </Pressable>
            </View>

            {/* Thumbnail Carousel */}
            <FlatList
              horizontal
              data={trendingMovies.slice(0, 6)}
              keyExtractor={(item) => `thumb-${item.id}`}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.thumbnailContainer}
                  onPress={() => handleMoviePress(item)}
                >
                  <Image
                    source={{ uri: getBackdropURL(item.backdrop_path, "w300") }}
                    style={styles.thumbnail}
                    contentFit="cover"
                    transition={200}
                  />
                </Pressable>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailList}
            />
          </View>
        )}

        {/* Top 10 Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top 10 Movies This Week</Text>
            <Pressable style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See all</Text>
              <ChevronRight size={16} color={colors.primary} />
            </Pressable>
          </View>

          <FlatList
            horizontal
            data={trendingMovies.slice(0, 10)}
            keyExtractor={(item) => `top10-${item.id}`}
            renderItem={({ item, index }) => (
              <MovieCard
                movie={item}
                variant="horizontal"
                onPress={handleMoviePress}
                showRating={true}
                index={index}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.movieList}
          />
        </View>

        {/* Trending Today Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Today</Text>
          </View>

          <FlatList
            horizontal
            data={trendingMovies.slice(5, 15)}
            keyExtractor={(item) => `trending-${item.id}`}
            renderItem={({ item }) => (
              <MovieCard
                movie={item}
                variant="horizontal"
                onPress={handleMoviePress}
                showRating={true}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.movieList}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  errorText: {
    fontSize: fontSize.lg,
    color: colors.error,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  retryText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.background,
  },
  heroContainer: {
    height: HERO_HEIGHT,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: HERO_HEIGHT * 0.6,
  },
  heroContent: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  heroTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.md,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  pillsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: spacing.lg,
    flexWrap: "wrap",
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.textPrimary,
  },
  thumbnailList: {
    paddingHorizontal: spacing.lg,
    position: "absolute",
    bottom: 10,
  },
  thumbnailContainer: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.sm,
    overflow: "hidden",
    marginRight: spacing.sm,
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginRight: 2,
  },
  movieList: {
    paddingRight: spacing.lg,
  },
});
