import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Heart,
  Star,
  Clock,
  Calendar,
  Play,
} from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import YoutubePlayer from "react-native-youtube-iframe";

import { LoadingSpinner, CategoryPill } from "../components";
import {
  getMovieDetails,
  getYouTubeTrailerKey,
  getBackdropURL,
  getPosterURL,
} from "../services/tmdb";
import { isFavorite, toggleFavorite } from "../services/storage";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
} from "../styles/theme";
import type { MovieDetails, RootStackParamList } from "../types/movie";

const { width, height } = Dimensions.get("window");
const BACKDROP_HEIGHT = height * 0.45;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type DetailRouteProp = RouteProp<RootStackParamList, "MovieDetail">;

export const MovieDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailRouteProp>();
  const { movieId } = route.params;

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMovie = useCallback(async () => {
    try {
      setError(null);
      const [details, favStatus, videoKey] = await Promise.all([
        getMovieDetails(movieId),
        isFavorite(movieId),
        getYouTubeTrailerKey(movieId),
      ]);

      setMovie(details);
      setIsFav(favStatus);
      setTrailerKey(videoKey);
    } catch (err) {
      setError("Failed to load movie details");
      console.error("Error loading movie:", err);
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    loadMovie();
  }, [loadMovie]);

  const handleToggleFavorite = async () => {
    if (!movie) return;

    try {
      const newStatus = await toggleFavorite({
        id: movie.id,
        title: movie.title,
        original_title: movie.original_title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        popularity: movie.popularity,
        genre_ids: movie.genres.map((g) => g.id),
        adult: movie.adult,
        original_language: movie.original_language,
        video: movie.video,
      });
      setIsFav(newStatus);

      Alert.alert(
        newStatus ? "Added to My List" : "Removed from My List",
        newStatus
          ? `${movie.title} has been added to your list`
          : `${movie.title} has been removed from your list`,
        [{ text: "OK" }],
      );
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const formatRuntime = (minutes: number | null): string => {
    if (!minutes) return "N/A";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return <LoadingSpinner message="Loading movie..." />;
  }

  if (error || !movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || "Movie not found"}</Text>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const releaseYear = movie.release_date?.split("-")[0] || "N/A";

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Backdrop Image */}
        <View style={styles.backdropContainer}>
          {showTrailer && trailerKey ? (
            <View style={styles.playerContainer}>
              <YoutubePlayer
                height={BACKDROP_HEIGHT}
                width={width}
                videoId={trailerKey}
                play={showTrailer}
              />
            </View>
          ) : (
            <>
              <Image
                source={{ uri: getBackdropURL(movie.backdrop_path) }}
                style={styles.backdrop}
                contentFit="cover"
                transition={300}
              />
              <LinearGradient
                colors={[
                  "transparent",
                  "rgba(13,13,13,0.9)",
                  colors.background,
                ]}
                style={styles.gradient}
              />
            </>
          )}

          {/* Header Buttons */}
          <SafeAreaView style={styles.headerButtons} edges={["top"]}>
            <Pressable
              style={styles.iconButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={24} color={colors.textPrimary} />
            </Pressable>

            <Pressable style={styles.iconButton} onPress={handleToggleFavorite}>
              <Heart
                size={24}
                color={isFav ? colors.accent : colors.textPrimary}
                fill={isFav ? colors.accent : "transparent"}
              />
            </Pressable>
          </SafeAreaView>

          {/* Play Trailer Button */}
          {trailerKey && !showTrailer && (
            <Pressable
              style={styles.playTrailerButton}
              onPress={() => setShowTrailer(true)}
            >
              <Play
                size={32}
                color={colors.textPrimary}
                fill={colors.textPrimary}
              />
            </Pressable>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Rating */}
          <Text style={styles.title}>{movie.title}</Text>

          {movie.tagline ? (
            <Text style={styles.tagline}>"{movie.tagline}"</Text>
          ) : null}

          {/* Meta Info Row */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Star
                size={16}
                color={colors.imdbYellow}
                fill={colors.imdbYellow}
              />
              <Text style={styles.metaText}>
                {movie.vote_average.toFixed(1)} (
                {movie.vote_count.toLocaleString()})
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Calendar size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{releaseYear}</Text>
            </View>

            <View style={styles.metaItem}>
              <Clock size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>
                {formatRuntime(movie.runtime)}
              </Text>
            </View>
          </View>

          {/* Genres */}
          <View style={styles.genresContainer}>
            {movie.genres.map((genre) => (
              <CategoryPill key={genre.id} label={genre.name} />
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            {trailerKey && (
              <Pressable
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => setShowTrailer(true)}
              >
                <Play
                  size={20}
                  color={colors.background}
                  fill={colors.background}
                />
                <Text style={styles.primaryButtonText}>Watch Trailer</Text>
              </Pressable>
            )}

            <Pressable
              style={[
                styles.actionButton,
                styles.secondaryButton,
                isFav && styles.activeButton,
              ]}
              onPress={handleToggleFavorite}
            >
              <Heart
                size={20}
                color={isFav ? colors.accent : colors.textPrimary}
                fill={isFav ? colors.accent : "transparent"}
              />
              <Text
                style={[
                  styles.secondaryButtonText,
                  isFav && styles.activeButtonText,
                ]}
              >
                {isFav ? "In My List" : "Add to List"}
              </Text>
            </Pressable>
          </View>

          {/* Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>
              {movie.overview || "No overview available."}
            </Text>
          </View>

          {/* Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={styles.detailValue}>{movie.status}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Original Language</Text>
              <Text style={styles.detailValue}>
                {movie.original_language.toUpperCase()}
              </Text>
            </View>

            {movie.budget > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Budget</Text>
                <Text style={styles.detailValue}>
                  ${movie.budget.toLocaleString()}
                </Text>
              </View>
            )}

            {movie.revenue > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Revenue</Text>
                <Text style={styles.detailValue}>
                  ${movie.revenue.toLocaleString()}
                </Text>
              </View>
            )}
          </View>

          <View style={{ height: 100 }} />
        </View>
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
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  backButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.background,
  },
  backdropContainer: {
    height: BACKDROP_HEIGHT,
    position: "relative",
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },
  playerContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.background,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: BACKDROP_HEIGHT * 0.5,
  },
  headerButtons: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  playTrailerButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -35 }, { translateY: -35 }],
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.textPrimary,
  },
  content: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.xxl,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: fontSize.md,
    fontStyle: "italic",
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    flexWrap: "wrap",
    gap: spacing.lg,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  metaText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.lg,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.background,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  activeButton: {
    borderColor: colors.accent,
  },
  activeButtonText: {
    color: colors.accent,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  overview: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
});
