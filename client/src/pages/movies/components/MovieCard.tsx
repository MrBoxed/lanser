import { Heart, Play, Clock, Star, Eye } from 'lucide-react';
import { useState } from 'react';
import { MovieData } from '../Movies';

type MovieCardProps = {
    movie: MovieData;
    onPlay?: () => void;
    onFavorite?: (id: string, isFavorite: boolean) => void;
    isFavorite?: boolean;
};

export function MovieCard({ movie, onPlay, onFavorite, isFavorite = false }: MovieCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);

    const toggleFavorite = () => {
        setLocalIsFavorite(!localIsFavorite);
        if (onFavorite) {
            onFavorite(movie.id, !localIsFavorite);
        }
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <div
            className="relative group rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gray-900"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Movie Thumbnail */}
            <div className="relative aspect-video">
                <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    style={{ opacity: isHovered ? 0.7 : 1 }}
                />

                {/* Play Button */}
                {isHovered && (
                    <button
                        onClick={onPlay}
                        className="absolute inset-0 m-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-200 shadow-lg"
                        aria-label={`Play ${movie.title}`}
                    >
                        <Play className="text-white w-6 h-6 ml-1" fill="currentColor" />
                    </button>
                )}

                {/* Favorite Button */}
                <button
                    onClick={toggleFavorite}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${localIsFavorite ? 'bg-red-500/90' : 'bg-gray-800/70 hover:bg-gray-700/90'
                        }`}
                    aria-label={localIsFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <Heart
                        className={`w-5 h-5 ${localIsFavorite ? 'text-white fill-white' : 'text-gray-300'}`}
                    />
                </button>

                {/* Rating Badge */}
                <div className="absolute bottom-3 left-3 bg-yellow-500/90 text-gray-900 px-2 py-1 rounded-md flex items-center text-sm font-semibold">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {movie.rating.toFixed(1)}
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-gray-800/90 text-gray-200 px-2 py-1 rounded-md flex items-center text-sm font-medium">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(movie.duration)}
                </div>
            </div>

            {/* Movie Info */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white truncate">{movie.title}</h3>
                    <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded">
                        {movie.release_year}
                    </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-sm text-gray-300 bg-gray-800/50 px-2 py-1 rounded">
                        {movie.genre}
                    </span>
                    <span className="text-sm text-gray-300 bg-gray-800/50 px-2 py-1 rounded">
                        {movie.director}
                    </span>
                </div>

                <p className="text-gray-300 text-sm line-clamp-2">{movie.description}</p>

                {/* Hover Actions */}
                {isHovered && (
                    <div className="mt-3 flex justify-between items-center">
                        <button className="text-gray-300 hover:text-white text-sm flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                        </button>
                        <button className="text-gray-300 hover:text-white text-sm flex items-center">
                            <Play className="w-4 h-4 mr-1" />
                            Trailer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}