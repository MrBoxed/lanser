import React, { useEffect, useState, useCallback } from 'react';
import { MovieCard } from '../movies/MovieCard';
import { BookCard, type BookData } from '../books/BookCard';
import { MusicCard, type MusicData } from '../music/MusicCard';
import MusicPlayer from '../music/MusicPlayer';
import MovieCarousel from '../movies/MovieCarousel'; // Import MovieCarousel
// WatchPage is no longer imported here for modal use
import { instance } from '@/config/ApiService';
import { Loader2 } from 'lucide-react';
import type { MovieData } from '../movies/Movies';

// Define a type for a generic favorite item, which can be a Movie, Book, or Music
type FavoriteItem = (MovieData & { category: 'video' }) | (BookData & { category: 'document' }) | (MusicData & { category: 'audio' });

const SERVER = "http://localhost:27110/api/";

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [books, setBooks] = useState<BookData[]>([]);
  const [musicList, setMusicList] = useState<MusicData[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingMusic, setLoadingMusic] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  const [currentMusic, setCurrentMusic] = useState<MusicData | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Removed states for the movie player modal:
  // const [showMoviePlayerModal, setShowMoviePlayerModal] = useState(false);
  // const [selectedMovieForPlayer, setSelectedMovieForPlayer] = useState<MovieData | null>(null);

  // Fetch Recent Movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await instance.get(`${SERVER}movies/recent`);
        setMovies(response.data || []);
      } catch (error) {
        console.error("Failed to fetch recent movies:", error);
      } finally {
        setLoadingMovies(false);
      }
    };
    fetchMovies();
  }, []);

  // Fetch Recent Books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await instance.get(`${SERVER}books/recent`);
        setBooks(response.data || []);
      } catch (error) {
        console.error("Failed to fetch recent books:", error);
      } finally {
        setLoadingBooks(false);
      }
    };
    fetchBooks();
  }, []);

  // Fetch Recent Music
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await instance.get(`${SERVER}music/recent`);
        setMusicList(response.data || []);
      } catch (error) {
        console.error("Failed to fetch recent music:", error);
      } finally {
        setLoadingMusic(false);
      }
    };
    fetchMusic();
  }, []);

  // Fetch Favorite Items (requires user authentication)
  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = localStorage.getItem("user_id"); // Example: get from local storage or auth context
      if (!userId) {
        setLoadingFavorites(false);
        return;
      }
      try {
        const response = await instance.get(`${SERVER}favorites/${userId}`);
        setFavorites(response.data || []);
      } catch (error) {
        console.error("Failed to fetch favorite items:", error);
      } finally {
        setLoadingFavorites(false);
      }
    };
    fetchFavorites();
  }, []); // Add userId to dependency array if it's dynamic

  // Music Player Callbacks
  const handlePlayMusic = useCallback((music: MusicData) => {
    setCurrentMusic(music);
    setIsPlaying(true);
  }, []);

  const playNext = useCallback(() => {
    if (!currentMusic || musicList.length === 0) return;
    const currentIndex = musicList.findIndex(m => m.id === currentMusic.id);
    const nextIndex = (currentIndex + 1) % musicList.length;
    setCurrentMusic(musicList[nextIndex]);
    setIsPlaying(true);
  }, [currentMusic, musicList]);

  const playPrevious = useCallback(() => {
    if (!currentMusic || musicList.length === 0) return;
    const currentIndex = musicList.findIndex(m => m.id === currentMusic.id);
    const prevIndex = (currentIndex - 1 + musicList.length) % musicList.length;
    setCurrentMusic(musicList[prevIndex]);
    setIsPlaying(true);
  }, [currentMusic, musicList]);

  const handleCloseMusicPlayer = useCallback(() => {
    setCurrentMusic(null);
    setIsPlaying(false);
  }, []);

  // Removed Movie Player Modal Callbacks:
  // const handleOpenMoviePlayer = useCallback((movie: MovieData) => { ... });
  // const handleCloseMoviePlayer = useCallback(() => { ... });

  const renderLoading = () => (
    <div className="flex justify-center items-center h-24">
      <Loader2 className="animate-spin text-purple-400" size={32} />
    </div>
  );

  const renderNoContent = (type: string) => (
    <p className="text-gray-400 text-center py-4">No {type} available.</p>
  );

  return (
    <div className="w-full p-6 min-h-screen text-white pb-24">
      {/* Movies Carousel */}
      <section className="mb-10">
        {loadingMovies ? renderLoading() : movies.length === 0 ? renderNoContent("movies") : (
          <MovieCarousel latest={movies} />
        )}
      </section>

      {/* Latest Books */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-6">Latest Books</h2>
        {loadingBooks ? renderLoading() : books.length === 0 ? renderNoContent("books") : (
          <div className="flex flex-wrap">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* Latest Music */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-6">Latest Music</h2>
        {loadingMusic ? renderLoading() : musicList.length === 0 ? renderNoContent("music") : (
          <div className="flex flex-wrap">
            {musicList.map(music => (
              <MusicCard key={music.id} music={music} onPlay={handlePlayMusic} />
            ))}
          </div>
        )}
      </section>

      {/* Favorite Items */}
      {/* <section className="mb-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Your Favorites</h2>
        {loadingFavorites ? renderLoading() : favorites.length === 0 ? renderNoContent("favorites") : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
            {favorites.map(item => {
              if (item.category === 'video') {
                return <MovieCard key={item.id} movie={item as MovieData} />;
              } else if (item.category === 'document') {
                return <BookCard key={item.id} book={item as BookData} />;
              } else if (item.category === 'audio') {
                return <MusicCard key={item.id} music={item as MusicData} onPlay={handlePlayMusic} />;
              }
              return null;
            })}
          </div>
        )}
      </section> */}

      {/* Global Music Player */}
      {currentMusic && (
        <MusicPlayer
          music={currentMusic}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onNext={playNext}
          onPrev={playPrevious}
          onClose={handleCloseMusicPlayer}
          serverUrl={SERVER}
        />
      )}

      {/* Removed Movie Player Modal: */}
      {/* {showMoviePlayerModal && selectedMovieForPlayer && ( ... )} */}
    </div>
  );
};

export default HomePage;
