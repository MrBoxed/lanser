import { Heart, Play, Star, MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { MovieData } from './Movies';
import { useNavigate } from 'react-router-dom';
import AnimatedContent from '@/components/common/AnimatedContent';
import { Button } from '@/components/ui/button';
import { instance } from '@/config/ApiService'; // Import instance for API calls

type MovieCardProps = {
    movie: MovieData;
};

export function MovieCard({ movie }: MovieCardProps) {
    const SERVER = "http://localhost:27110/api/";
    const navigate = useNavigate();

    // State to toggle info visibility on hover
    const [showInfo, setShowInfo] = useState<boolean>(false);
    // State for favorite status, initialized to false.
    // In a real application, this should be fetched from the user's favorites data
    // passed down from a parent component (e.g., HomePage) or a global state.
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    // Split genre into an array of strings and limit to 2
    let genre: string[] = movie.genre?.split(',').map(item => item.trim()).slice(0, 2) || ["Unknown Genre"];

    useEffect(() => {
        console.log("ShowInfo:", showInfo);
        // Optional: In a real app, you might check if this specific movie is favorited by the current user
        // when the component mounts or when user data changes.
        // For now, we'll assume the initial state is false and rely on the toggle.
    }, [showInfo]);

    /**
     * Handles toggling the favorite status of the movie.
     * Calls the backend API to add or remove the movie from favorites.
     */
    const handleFavoriteToggle = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent click from propagating to the card's main toggle/navigation

        // In a real application, retrieve the actual user ID from your authentication context/store.
        // For this example, we'll use a placeholder.
        const userId = localStorage.getItem("user_id") || "1"; // Replace with actual userId
        if (!userId) {
            console.error("User not logged in. Cannot toggle favorite.");
            // Optionally, show a message to the user to log in
            return;
        }

        try {
            const response = await instance.post(`${SERVER}favorites/toggle`, {
                userId: parseInt(userId),
                fileId: movie.fileId, // Use the fileId to identify the item for favoriting
            });

            if (response.data.status === 'added') {
                setIsFavorite(true);
                console.log(`Movie "${movie.title}" added to favorites.`);
            } else if (response.data.status === 'removed') {
                setIsFavorite(false);
                console.log(`Movie "${movie.title}" removed from favorites.`);
            }
            // After successful toggle, you might want to trigger a re-fetch of favorites
            // in the parent (HomePage) to update the "Your Favorites" section.
        } catch (error) {
            console.error(`Error toggling favorite for movie "${movie.title}":`, error);
            // Handle error (e.g., show a toast notification)
        }
    };

    return (
        <div
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
            className="relative w-[200px] h-[300px] bg-gray-900 text-white rounded-2xl overflow-hidden cursor-pointer
                       group transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-red-800/50"
        >
            {/* Background Image */}
            <img
                src={`${SERVER}movies/thumbnail/${movie.id}`} // Assuming this endpoint serves movie thumbnails
                alt={`${movie.title} Thumbnail`}
                className="absolute inset-0 w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/200x300/2d3748/ffffff?text=No+Image`; // Placeholder on error
                    e.currentTarget.onerror = null; // Prevent infinite loop
                }}
            />

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:opacity-0" />

            {/* Rating card */}
            {movie.rating && (
                <div className="absolute top-4 left-4 p-2 gap-2 flex items-center rounded-md bg-black/20 backdrop-blur-sm text-white text-sm font-semibold shadow-md">
                    <Star size={16} color="gold" fill="gold" />
                    <p>{movie.rating.toFixed(1)}</p>
                </div>
            )}

            {/* Favorite Button */}
            <button
                onClick={handleFavoriteToggle}
                className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition-colors duration-200
                            ${isFavorite ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm'}`}
            >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>

            {/* Info card with animation */}
            {showInfo && (
                <AnimatedContent
                    distance={200}
                    direction="vertical"
                    reverse={false}
                    duration={0.3}
                    ease="power.out"
                    initialOpacity={0.2}
                    animateOpacity
                    scale={1}
                    threshold={0.2}
                    delay={0.1}
                >
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2
                                   bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-sm rounded-b-2xl">
                        <div className="text-xl text-white font-semibold line-clamp-2">
                            {movie.title}
                        </div>
                        <div className="text-sm text-white/90 font-medium">
                            {genre.map((item, index) => (
                                <span key={index}>{item}{index < genre.length - 1 ? ' • ' : ''}</span>
                            ))}
                        </div>
                        <div className="text-sm w-fit py-1 px-2 bg-white/20 rounded-md text-white backdrop-blur-sm">
                            {movie.release_year}
                        </div>
                        <Button
                            onClick={(e) => { e.stopPropagation(); navigate(`./watch/${movie.id}`); }} // Stop propagation
                            variant="default"
                            className="bg-red-600 hover:bg-red-700 mt-2 w-full flex items-center justify-center gap-2"
                        >
                            <Play size={18} /> PLAY
                        </Button>
                    </div>
                </AnimatedContent>
            )}
        </div>
    );
}
