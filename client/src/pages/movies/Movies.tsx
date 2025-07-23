import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { instance } from "../../config/ApiService";
import MovieCarousel from "./components/MovieCarousel";
import { Input } from "../../components/ui/input";
import { MovieCard } from "./components/MovieCard";

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

// :::::::::::: FOR TEST ONLY ::::::::::::::::::

const dummyMovies: Movie[] = [
    {
        id: "1",
        title: "Inception",
        genre: "Sci-Fi",
        director: "Christopher Nolan",
        rating: 8.8,
        duration: 148,
        release_year: 2010,
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        fileId: "file1",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg"
    },
    {
        id: "2",
        title: "The Shawshank Redemption",
        genre: "Drama",
        director: "Frank Darabont",
        rating: 9.3,
        duration: 142,
        release_year: 1994,
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        fileId: "file2",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1000_.jpg"
    },
    {
        id: "3",
        title: "The Dark Knight",
        genre: "Action",
        director: "Christopher Nolan",
        rating: 9.0,
        duration: 152,
        release_year: 2008,
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        fileId: "file3",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg"
    },
    {
        id: "4",
        title: "Pulp Fiction",
        genre: "Crime",
        director: "Quentin Tarantino",
        rating: 8.9,
        duration: 154,
        release_year: 1994,
        description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        fileId: "file4",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg"
    },
    {
        id: "5",
        title: "The Godfather",
        genre: "Crime",
        director: "Francis Ford Coppola",
        rating: 9.2,
        duration: 175,
        release_year: 1972,
        description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        fileId: "file5",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg"
    },
    {
        id: "6",
        title: "Parasite",
        genre: "Thriller",
        director: "Bong Joon Ho",
        rating: 8.6,
        duration: 132,
        release_year: 2019,
        description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
        fileId: "file6",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_FMjpg_UX1000_.jpg"
    }
];

// const SERVER = "localhost:27110/api/thumbnail?path=";
const SERVER = "http://localhost:27110/api/thumbnail/";

export default function MoviePage() {
    const [movies, setMovies] = useState<MovieData[]>([]);
    const [latestUploads, setLatestUploads] = useState<MovieData[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
            try {
                const response = await instance.get("/movies");
                const data: MovieData[] | null = response.data as MovieData[] || null;
                setMovies(data);
                // console.log(response.data);
            } catch (error) {
                console.error("Error fetching movies:", error);
                navigate("/home");
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [navigate]);

    if (loading) {
        return <div className="p-4 text-center">Loading movies...</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">

            {dummyMovies.map((movie) => (
                <MovieCard
                    key={movie.id}
                    movie={movie}
                    onPlay={() => console.log(`Playing ${movie.title}`)}
                    onFavorite={handleFavorite}
                    isFavorite={favorites.has(movie.id)}
                />
            ))}

            {/* <div className="[width:150px] h-[300px]! bg-white/20 rounded-xl overflow-hidden relative">
                <div className="w-[150px] h-[300px] bg-red-500">
                    <img
                        src={`${SERVER}${movies[2].id}`}
                        className="w-full h-full object-cover"
                        alt="Movie thumbnail"
                        loading="lazy"
                    />
                </div>
                <p className="absolute bottom-2 left-2 text-xl font-bold text-white z-10">
                    Shutter Island
                </p>
            </div> */}


            {/* <h1 className="text-2xl font-bold mb-4">Movie Library</h1>
            <div className="grid gap-4 md:grid-cols-2">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="p-4 rounded-lg shadow border border-gray-200 bg-white"
                    >
                        <img src={`${SERVER}${encodeURIComponent(movie.thumbnail)}`} height={100} />
                        <img src={`${SERVER}${movie.id}`} className="w-[100px] h-[200px]" alt="Movie thumbnail" loading="lazy" />
                        <h2 className="text-xl font-semibold">{movie.title}</h2>
                        <p className="text-sm text-gray-600 mb-2">
                            {movie.genre} • {movie.release_year} • {movie.duration} mins
                        </p>
                        <p className="text-sm mb-2">Directed by {movie.director}</p>
                        <p className="text-sm text-gray-700">{movie.description}</p>
                        <p className="mt-2 text-sm">⭐ Rating: {movie.rating}/10</p>
                    </div>
                ))}
            </div> */}
        </div>
    );
}
