import React from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Star } from "lucide-react-native";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../styles/theme";
import { getPosterURL } from "../services/tmdb";
import type { Movie } from "../types/movie";

const { width } = Dimensions.get("window");
const CARD_WIDTH_HORIZONTAL = 120;
const CARD_WIDTH_VERTICAL = (width - spacing.lg * 2 - spacing.md) / 2;

interface MovieCardProps {
  movie: Movie;
  variant?: "horizontal" | "vertical";
  onPress: (movie: Movie) => void;
  showRating?: boolean;
  index?: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  variant = "horizontal",
  onPress,
  showRating = true,
  index,
}) => {
  const isHorizontal = variant === "horizontal";
  const cardWidth = isHorizontal ? CARD_WIDTH_HORIZONTAL : CARD_WIDTH_VERTICAL;
  const cardHeight = isHorizontal ? 180 : 220;
  const releaseYear = movie.release_date?.split("-")[0] || "N/A";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { width: cardWidth },
        pressed && styles.pressed,
      ]}
      onPress={() => onPress(movie)}
    >
      <View style={[styles.imageContainer, { height: cardHeight }]}>
        <Image
          source={{ uri: getPosterURL(movie.poster_path) }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />

        {/* Ranking badge for Top 10 */}
        {index !== undefined && index < 10 && (
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>{index + 1}</Text>
          </View>
        )}

        {/* Rating badge */}
        {showRating && movie.vote_average > 0 && (
          <View style={styles.ratingBadge}>
            <View style={styles.imdbBadge}>
              <Text style={styles.imdbText}>IMDb</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Star
                size={10}
                color={colors.imdbYellow}
                fill={colors.imdbYellow}
              />
              <Text style={styles.ratingText}>
                {movie.vote_average.toFixed(1)}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Movie info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.year}>{releaseYear}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: spacing.md,
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    backgroundColor: colors.surface,
    ...shadows.md,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  rankBadge: {
    position: "absolute",
    bottom: -8,
    left: -4,
    backgroundColor: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rankText: {
    fontSize: 40,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  ratingBadge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 2,
  },
  imdbBadge: {
    backgroundColor: colors.imdbYellow,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  imdbText: {
    fontSize: 8,
    fontWeight: fontWeight.bold,
    color: colors.imdbBlack,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  ratingText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  info: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  year: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
