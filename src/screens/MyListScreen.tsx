import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Heart, Trash2 } from "lucide-react-native";

import { MovieCard, LoadingSpinner } from "../components";
import { getFavorites, removeFavorite } from "../services/storage";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from "../styles/theme";
import type { Movie, RootStackParamList } from "../types/movie";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/* =======================
   Popup Types
======================= */
type ConfirmRemoveParams = {
  movie: Movie;
  onConfirm: (movieId: number) => void;
};

export const MyListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  /* =======================
     Data
  ======================= */
  const loadFavorites = useCallback(async (): Promise<void> => {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (err) {
      console.error("Error loading favorites:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites]),
  );

  const onRefresh = useCallback((): void => {
    setRefreshing(true);
    loadFavorites();
  }, [loadFavorites]);

  /* =======================
     Actions
  ======================= */
  const handleMoviePress = (movie: Movie): void => {
    navigation.navigate("MovieDetail", { movieId: movie.id });
  };

  const handleRemove = async (movieId: number): Promise<void> => {
    try {
      await removeFavorite(movieId);
      setFavorites((prev) => prev.filter((m) => m.id !== movieId));
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  /* =======================
     Typed Popup
  ======================= */
  const confirmRemove = ({ movie, onConfirm }: ConfirmRemoveParams): void => {
    Alert.alert(
      "Remove from My List",
      `Are you sure you want to remove "${movie.title}" from your list?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => onConfirm(movie.id),
        },
      ],
      { cancelable: true },
    );
  };

  /* =======================
     Render
  ======================= */
  const renderMovieItem = ({ item }: { item: Movie }) => (
    <View style={styles.movieItemContainer}>
      <MovieCard
        movie={item}
        variant="vertical"
        onPress={handleMoviePress}
        showRating
      />
      <Pressable
        style={styles.removeButton}
        onPress={() =>
          confirmRemove({
            movie: item,
            onConfirm: handleRemove,
          })
        }
        hitSlop={10}
      >
        <Trash2 size={18} color={colors.error} />
      </Pressable>
    </View>
  );

  if (loading) {
    return <LoadingSpinner message="Loading favorites..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My List</Text>
        <Text style={styles.subtitle}>
          {favorites.length} {favorites.length === 1 ? "movie" : "movies"}
        </Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Heart size={64} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Your list is empty</Text>
          <Text style={styles.emptyText}>
            Movies you add to your list will appear here
          </Text>
          <Pressable
            style={styles.exploreButton}
            onPress={() => navigation.getParent()?.navigate("Explore")}
          >
            <Text style={styles.exploreButtonText}>Explore Movies</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => `fav-${item.id}`}
          renderItem={renderMovieItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

/* =======================
   Styles
======================= */
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
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  row: {
    justifyContent: "space-between",
  },
  movieItemContainer: {
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.lg + spacing.sm,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: spacing.sm,
    borderRadius: borderRadius.full,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xxl,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  exploreButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  exploreButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.background,
  },
});
