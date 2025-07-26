import { useEffect, useState } from "react";
import { MovieCard } from "./MovieCard"; // Adjust path accordingly
import { instance } from "@/config/ApiService";
import { useLocation } from "react-router-dom"; // Import useLocation
import { Loader2 } from "lucide-react";
import type { MovieData } from "./Movies";

const SERVER = "http://localhost:27110/api/";

const MoviesHome = () => {
    const [movies, setMovies] = useState<MovieData[]>([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation(); // Get current location

    // Extract search query from URL
    const searchQuery = new URLSearchParams(location.search).get("query");

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                let url = `${SERVER}movies/recent`; // Default to recent movies
                if (searchQuery) {
                    url = `${SERVER}movies/search?query=${encodeURIComponent(searchQuery)}`; // Use search endpoint if query exists
                }
                const response = await instance.get(url);
                setMovies(response.data || []);
            } catch (error) {
                console.error("Failed to fetch movies:", error);
                setMovies([]); // Clear movies on error
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [searchQuery, location.pathname]); // Re-fetch when query or path changes

    return (
        <div className="w-full p-6 bg-gray-950 min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-6 text-center">
                {searchQuery ? `Search Results for "${searchQuery}"` : "All Movies"}
            </h1>

            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin text-white" size={48} />
                </div>
            ) : movies.length === 0 ? (
                <p className="text-white text-center text-xl mt-10">
                    {searchQuery ? `No movies found for "${searchQuery}".` : "No movies available."}
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MoviesHome;
