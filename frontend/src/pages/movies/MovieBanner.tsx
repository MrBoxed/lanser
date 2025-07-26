import { useState } from 'react';
import type { MovieData } from './Movies';
import { Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedContent from '@/components/common/AnimatedContent';
import { useNavigate } from 'react-router-dom';
import { instance } from '@/config/ApiService';

interface MovieBannerProps {
    details: MovieData;
    // Removed onPlayMovie prop: onPlayMovie: (movie: MovieData) => void;
}

const MovieBanner = ({ details }: MovieBannerProps) => { // Removed onPlayMovie from destructuring
    const SERVER = "http://localhost:27110/api/";
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);

    let genre: string[] = details.genre?.split(',').map(item => item.trim()).slice(0, 2) || ["Unknown"];

    const handleFavoriteToggle = async () => {
        const userId = localStorage.getItem("user_id") || "1";
        if (!userId) {
            console.error("User not logged in to favorite items.");
            return;
        }

        try {
            const response = await instance.post(`${SERVER}favorites/toggle`, {
                userId: parseInt(userId),
                fileId: details.fileId,
                category: 'video'
            });

            if (response.data.status === 'added') {
                setIsFavorite(true);
                console.log(`Added ${details.title} to favorites.`);
            } else if (response.data.status === 'removed') {
                setIsFavorite(false);
                console.log(`Removed ${details.title} from favorites.`);
            }
        } catch (error) {
            console.error("Error toggling favorite status:", error);
        }
    };

    return (
        <div className="relative w-full h-[550px] rounded-2xl overflow-hidden group">
            <img
                src={`${SERVER}movies/thumbnail/${details.id}`}
                alt={`${details.title} poster`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/1280x720/2d3748/ffffff?text=No+Image`;
                    e.currentTarget.onerror = null;
                }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>

            <AnimatedContent
                distance={50}
                direction="horizontal"
                reverse={false}
                duration={0.5}
                ease="power.out"
                initialOpacity={0}
                animateOpacity
                scale={1}
                threshold={0.1}
                delay={0.2}
            >
                <div className="absolute bottom-0 left-0 p-8 pb-12 flex flex-col gap-4 max-w-4xl">
                    <h1 className="text-6xl md:text-7xl font-extrabold text-white leading-tight drop-shadow-lg">
                        {details.title}
                    </h1>

                    <div className="text-lg md:text-xl text-gray-300 font-medium flex flex-wrap gap-x-3">
                        {genre.map((item, index) => (
                            <span key={index}>{item}{index < genre.length - 1 && " • "}</span>
                        ))}
                    </div>

                    <div className="text-sm bg-white/20 px-3 py-1 rounded-full w-fit text-white font-semibold backdrop-blur-sm">
                        {details.release_year}
                    </div>

                    <Button
                        onClick={() => navigate(`/movies/watch/${details.id}`)} // Reverted to navigate directly
                        variant="default"
                        className="mt-6 w-fit p-8 text-xl font-bold rounded-full shadow-lg
                                   bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105"
                    >
                        PLAY NOW
                    </Button>
                </div>
            </AnimatedContent>

            {details.rating && (
                <div className="absolute top-8 left-8 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-lg font-semibold text-white shadow-md">
                    <Star size={20} color="gold" fill="gold" />
                    <p>{details.rating.toFixed(1)}</p>
                </div>
            )}

            <button
                onClick={handleFavoriteToggle}
                className={`absolute top-8 right-28 bg-white/20 backdrop-blur-sm rounded-full p-3 shadow-md
                            hover:bg-white/30 transition-colors duration-200 cursor-pointer
                            ${isFavorite ? 'text-red-500' : 'text-white'}`}
            >
                <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
            </button>
        </div>
    );
};

export default MovieBanner;
