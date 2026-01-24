import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Movie } from "../types/movie";

const FAVORITES_KEY = "@movie_app_favorites";

// Get all favorites
export const getFavorites = async (): Promise<Movie[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Error reading favorites:", error);
    return [];
  }
};

// Add movie to favorites
export const addFavorite = async (movie: Movie): Promise<void> => {
  try {
    const favorites = await getFavorites();

    // Check if already exists
    if (favorites.some((fav) => fav.id === movie.id)) {
      return;
    }

    const updatedFavorites = [movie, ...favorites];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error("Error adding favorite:", error);
    throw error;
  }
};

// Remove movie from favorites
export const removeFavorite = async (movieId: number): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter((fav) => fav.id !== movieId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
};

// Check if movie is favorite
export const isFavorite = async (movieId: number): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some((fav) => fav.id === movieId);
  } catch (error) {
    console.error("Error checking favorite:", error);
    return false;
  }
};

// Toggle favorite status
export const toggleFavorite = async (movie: Movie): Promise<boolean> => {
  const isCurrentlyFavorite = await isFavorite(movie.id);

  if (isCurrentlyFavorite) {
    await removeFavorite(movie.id);
    return false;
  } else {
    await addFavorite(movie);
    return true;
  }
};
