export const UploadTypes = {
    VIDEO: "VIDEO",
    AUDIO: "AUDIO",
    APPLICATION: "APPLICATION",
    TEXT: "TEXT"
}

export interface Movie {
    id: string;
    title: string;
    overview: string;
    posterUrl: string;
    backdropUrl: string;
    releaseDate: string;
    duration: number;
    rating: number;
    genres: string[];
    trailerUrl?: string;
    videoUrl?: string;
    cast: CastMember[];
    director: string;
    language: string;
    isPopular?: boolean;
    isTrending?: boolean;
    isFeatured?: boolean;
}

export interface CastMember {
    id: string;
    name: string;
    character: string;
    profileUrl?: string;
}

export interface Category {
    id: string;
    name: string;
    movies: Movie[];
}

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    watchlist: string[];
    favorites: string[];
    watchHistory: WatchHistoryItem[];
}

export interface WatchHistoryItem {
    movieId: string;
    watchedAt: string;
    progress: number;
}