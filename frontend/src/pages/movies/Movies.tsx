import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { instance } from "../../config/ApiService";
import MovieCarousel from "./MovieCarousel";
import { Input } from "../../components/ui/input"; // Assuming Input is used elsewhere or for future search bar on this page
import MovieBanner from "./MovieBanner"; // Assuming MovieBanner is used for a carousel on this page
import { Star, Loader2 } from "lucide-react"; // Import Loader2
import { MovieCard } from "./MovieCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export type MovieData = {
    id: string;
    title: string;
    genre: string;
    director: string;
    rating: number;
    duration: number;
    release_year: number;
    description: string;
    fileId: string;
    thumbnail: string;
};

const SERVER = "http://localhost:27110/api/";

export default function MoviePage() {
    const [movies, setMovies] = useState<MovieData[]>([]);
    // latestUploads state seems unused in the provided snippet, keeping for context if needed later
    // const [latestUploads, setLatestUploads] = useState<MovieData[]>([]);

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation(); // Get current location

    // Extract search query from URL
    const searchQuery = new URLSearchParams(location.search).get("query");

    // Favorites state is not directly used for display in this page's current structure,
    // but the handler is present if MovieCard needs it.
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const handleFavorite = (movieId: string, isFavorite: boolean) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            isFavorite ? newFavorites.add(movieId) : newFavorites.delete(movieId);
            return newFavorites;
        });
    };

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true); // Start loading when fetch initiates
            try {
                let url = `${SERVER}movies`; // Default to all movies (or your existing endpoint for all)
                if (searchQuery) {
                    // If a search query exists, use the search endpoint
                    url = `${SERVER}movies/search?query=${encodeURIComponent(searchQuery)}`;
                } else {
                    // If no search query, fetch recent movies for a general listing
                    // Assuming /movies/recent is the endpoint for general listing
                    url = `${SERVER}movies/recent`;
                }

                const response = await instance.get(url);
                const data: MovieData[] | null = response.data as MovieData[] || null;
                setMovies(data || []); // Ensure movies is an array even if null
                console.log("Fetched Movies:", data);
            } catch (error) {
                console.error("Error fetching movies:", error);
                setMovies([]); // Clear movies on error
                // navigate("/home"); // Consider if you want to navigate away on error
            } finally {
                setLoading(false); // End loading regardless of success or failure
            }
        };

        fetchMovies();
    }, [searchQuery, navigate, location.search]); // Re-run effect when search query or location changes

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-950 text-white">
                <Loader2 className="animate-spin mr-2 mb-4" size={48} />
                <p className="text-xl">Loading movies...</p>
            </div>
        );
    }

    return (
        <div className="w-full p-6 min-h-screen text-white"> {/* Added p-6 and bg-gray-950 for consistent styling */}
            <h1 className="text-3xl font-bold mb-6">
                {searchQuery ? `Search Results for "${searchQuery}"` : "All Movies"}
            </h1>

            <div>

                {movies.length === 0 ? (
                    <p className="text-white text-center text-xl mt-10">
                        {searchQuery ? `No movies found for "${searchQuery}".` : "No movies available."}
                    </p>
                ) : (
                    <div className="w-full flex-wrap flex gap-5 p-4 "> {/* Added justify-center for better grid alignment */}
                        {movies.map((movie, index) => {
                            return (
                                <MovieCard key={movie.id} movie={movie} /> // Use movie.id as key for better performance
                            )
                        })}
                    </div>
                )}
            </div>

        </div >
    );
}
