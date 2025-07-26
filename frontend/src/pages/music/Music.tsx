import { useEffect, useState, useCallback } from "react";
import { MusicCard, type MusicData } from "./MusicCard"; // Adjust path accordingly
import { instance } from "@/config/ApiService";
import MusicPlayer from "./MusicPlayer";
import { useLocation } from "react-router-dom"; // Import useLocation
import { Loader2 } from "lucide-react";

const SERVER = "http://localhost:27110/api/";

const MusicHome = () => {
    const [musicList, setMusicList] = useState<MusicData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMusic, setCurrentMusic] = useState<MusicData | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const location = useLocation(); // Get current location

    // Extract search query from URL
    const searchQuery = new URLSearchParams(location.search).get("query");

    useEffect(() => {
        const fetchMusic = async () => {
            setLoading(true);
            try {
                let url = `${SERVER}music/recent`; // Default to recent music
                if (searchQuery) {
                    url = `${SERVER}music/search?query=${encodeURIComponent(searchQuery)}`; // Use search endpoint if query exists
                }
                const res = await instance.get(url);
                setMusicList(res.data || []);
            } catch (err) {
                console.error("Error fetching music:", err);
                setMusicList([]); // Clear music on error
            } finally {
                setLoading(false);
            }
        };

        fetchMusic();
    }, [searchQuery, location.pathname]); // Re-fetch when query or path changes

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

    const handleClosePlayer = useCallback(() => {
        setCurrentMusic(null);
        setIsPlaying(false);
    }, []);

    return (
        <div className="w-full p-6 space-y-4 min-h-screen pb-24">
            <h1 className="text-3xl font-bold text-white mb-6">
                {searchQuery ? `Search Results for "${searchQuery}"` : "All Music"}
            </h1>

            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin text-white" size={48} />
                </div>
            ) : musicList.length === 0 ? (
                <p className="text-white text-center text-xl mt-10">
                    {searchQuery ? `No music found for "${searchQuery}".` : "No music available."}
                </p>
            ) : (
                <div className="flex items-center">
                    {musicList.map((music) => (
                        <MusicCard key={music.id} music={music} onPlay={handlePlayMusic} />
                    ))}
                </div>
            )}

            {currentMusic && (
                <MusicPlayer
                    music={currentMusic}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    onNext={playNext}
                    onPrev={playPrevious}
                    onClose={handleClosePlayer}
                    serverUrl={SERVER}
                />
            )}
        </div>
    );
};

export default MusicHome;
