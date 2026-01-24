import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_URL } from "@env";
import type {
  TrendingResponse,
  SearchResponse,
  MovieDetails,
  VideosResponse,
} from "../types/movie";

const API_KEY = TMDB_API_KEY;
const BASE_URL = TMDB_BASE_URL || "https://api.themoviedb.org/3";
const IMAGE_URL = TMDB_IMAGE_URL || "https://image.tmdb.org/t/p";

// Image URL helpers
export const getPosterURL = (
  path: string | null,
  size: string = "w500",
): string => {
  if (!path) return "https://placehold.co/500x750/1A1A2E/8B8B8B?text=No+Poster";
  return `${IMAGE_URL}/${size}${path}`;
};

export const getBackdropURL = (
  path: string | null,
  size: string = "w1280",
): string => {
  if (!path) return "https://placehold.co/1280x720/1A1A2E/8B8B8B?text=No+Image";
  return `${IMAGE_URL}/${size}${path}`;
};

// API request helper
const fetchTMDB = async <T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T> => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append("api_key", API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(
      `TMDB API Error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
};

// Get trending movies
export const getTrendingMovies = async (
  timeWindow: "day" | "week" = "week",
): Promise<TrendingResponse> => {
  return fetchTMDB<TrendingResponse>(`/trending/movie/${timeWindow}`);
};

// Search movies
export const searchMovies = async (
  query: string,
  page: number = 1,
): Promise<SearchResponse> => {
  return fetchTMDB<SearchResponse>("/search/movie", {
    query,
    page: page.toString(),
    include_adult: "false",
  });
};

// Get movie details
export const getMovieDetails = async (
  movieId: number,
): Promise<MovieDetails> => {
  return fetchTMDB<MovieDetails>(`/movie/${movieId}`);
};

// Get movie videos (trailers)
export const getMovieVideos = async (
  movieId: number,
): Promise<VideosResponse> => {
  return fetchTMDB<VideosResponse>(`/movie/${movieId}/videos`);
};

// Get YouTube trailer key
export const getYouTubeTrailerKey = async (
  movieId: number,
): Promise<string | null> => {
  try {
    const videos = await getMovieVideos(movieId);
    const trailer = videos.results.find(
      (video) =>
        video.site === "YouTube" &&
        (video.type === "Trailer" || video.type === "Teaser"),
    );
    return trailer?.key || null;
  } catch {
    return null;
  }
};

// Genre mapping
export const genreMap: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export const getGenreNames = (genreIds: number[]): string[] => {
  return genreIds.map((id) => genreMap[id] || "Unknown").slice(0, 3);
};
