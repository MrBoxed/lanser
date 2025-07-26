import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Slider } from '../../components/ui/slider';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, ArrowLeft, SkipBack, FastForward, Rewind, Loader2, Settings, Subtitles } from 'lucide-react'; // Removed X icon
import { instance } from '@/config/ApiService';
import type { MovieData } from './Movies';

const SERVER = "http://localhost:27110/api/";

const WatchPage = () => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);

    // Extract movieId from the URL parameters
    const { movieId } = useParams<{ movieId: string }>();
    const id = movieId ? parseInt(movieId, 10) : null;

    const [movie, setMovie] = useState<MovieData | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [controlTimeout, setControlTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isBuffering, setIsBuffering] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);

    // Fetch movie data based on the ID from URL
    useEffect(() => {
        if (!id || isNaN(id)) {
            console.error("Invalid Movie ID, redirecting to home.");
            navigate('/'); // Redirect to home if ID is invalid
            return;
        }

        const fetchMovieData = async () => {
            try {
                const res = await instance.get(`${SERVER}movies/${id}`);
                if (res.data) {
                    const movieData: MovieData = Array.isArray(res.data) ? res.data[0] : res.data;
                    setMovie(movieData);
                }
            } catch (error) {
                console.error('Error fetching movie data:', error);
                navigate('/'); // Redirect on error fetching data
            }
        };

        fetchMovieData();
    }, [id, navigate]); // Re-run this effect when the ID changes

    // Video event listeners
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleTimeUpdate = () => setCurrentTime(video.currentTime);
        const handleLoadedMetadata = () => {
            setDuration(video.duration);
            setIsBuffering(false);
        };
        const handleWaiting = () => setIsBuffering(true);
        const handlePlaying = () => setIsBuffering(false);
        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            // Optionally navigate to next episode or show recommendations
        };

        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('waiting', handleWaiting);
        video.addEventListener('playing', handlePlaying);
        video.addEventListener('ended', handleEnded);

        // Fullscreen change listener
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('waiting', handleWaiting);
            video.removeEventListener('playing', handlePlaying);
            video.removeEventListener('ended', handleEnded);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [movie]); // Re-run if movie data changes to re-attach listeners

    // Control visibility timeout
    useEffect(() => {
        if (showControls && isPlaying && !isBuffering) {
            if (controlTimeout) clearTimeout(controlTimeout);
            const timeout = setTimeout(() => {
                setShowControls(false);
            }, 3000);
            setControlTimeout(timeout);
        }
        return () => {
            if (controlTimeout) clearTimeout(controlTimeout);
        };
    }, [showControls, isPlaying, isBuffering]);

    // Mouse move to show controls
    const handleMouseMove = useCallback(() => {
        setShowControls(true);
        if (controlTimeout) clearTimeout(controlTimeout);
        const timeout = setTimeout(() => {
            if (isPlaying && !isBuffering) {
                setShowControls(false);
            }
        }, 3000);
        setControlTimeout(timeout);
    }, [isPlaying, isBuffering, controlTimeout]);

    // Toggle play/pause
    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;
        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
    };

    // Seek functionality
    const handleSeek = (value: number[]) => {
        const video = videoRef.current;
        if (video) {
            video.currentTime = value[0];
            setCurrentTime(value[0]);
        }
    };

    // Volume control
    const handleVolumeChange = (newVolume: number[]) => {
        const vol = newVolume[0];
        setVolume(vol);
        setIsMuted(vol === 0);
        if (videoRef.current) {
            videoRef.current.volume = vol;
        }
    };

    // Mute/unmute toggle
    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
        setVolume(video.muted ? 0 : 1);
    };

    // Fullscreen toggle
    const toggleFullscreen = () => {
        if (playerContainerRef.current) {
            if (!document.fullscreenElement) {
                playerContainerRef.current.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    };

    // Format time (HH:MM:SS or MM:SS)
    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);

        const paddedSeconds = seconds.toString().padStart(2, '0');
        const paddedMinutes = minutes.toString().padStart(2, '0');

        if (hours > 0) {
            return `${hours}:${paddedMinutes}:${paddedSeconds}`;
        }
        return `${minutes}:${paddedSeconds}`;
    };

    // Skip forward/backward
    const skip = (seconds: number) => {
        const video = videoRef.current;
        if (video) {
            video.currentTime += seconds;
        }
    };

    // Change playback rate
    const changePlaybackRate = (rate: number) => {
        const video = videoRef.current;
        if (video) {
            video.playbackRate = rate;
            setPlaybackRate(rate);
            setShowSettings(false);
        }
    };

    if (!movie) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-950 text-white">
                <Loader2 className="animate-spin mr-2 mb-4" size={48} />
                <p className="text-xl">Loading movie...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-950 text-white flex flex-col items-center p-4 sm:p-8">
            {/* Back Button (always visible, top left) */}
            <div className="w-full flex justify-start mb-4">
                <Button
                    onClick={() => navigate(-1)} // Navigate back to previous page
                    variant="ghost"
                    className="text-white hover:bg-gray-800 rounded-full px-4 py-2 flex items-center gap-2"
                >
                    <ArrowLeft size={20} /> Back to Home
                </Button>
            </div>

            {/* Movie Info Section (Optional - can be moved below player if preferred) */}
            <div className="w-full max-w-7xl bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                <h1 className="text-4xl font-extrabold text-white mb-3">{movie?.title}</h1>
                <p className="text-gray-300 text-lg mb-4 leading-relaxed">{movie?.description}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-md text-gray-400 font-medium">
                    {movie?.director && <span>Director: <span className="text-white">{movie.director}</span></span>}
                    {movie?.rating && <span>Rating: <span className="text-white">★ {movie.rating}</span></span>}
                    {movie?.release_year && <span>Year: <span className="text-white">{movie.release_year}</span></span>}
                    {movie?.duration && <span>Duration: <span className="text-white">{`${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m`}</span></span>}
                    {movie?.genre && <span>Genre: <span className="text-white">{movie.genre.split(',').map(g => g.trim()).join(', ')}</span></span>}
                </div>
            </div>

            {/* Video Player Container */}
            <div
                ref={playerContainerRef}
                className="relative w-full max-w-7xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group cursor-default"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => {
                    if (isPlaying && !isBuffering) {
                        setShowControls(false);
                    }
                }}
                onClick={togglePlay}
            >
                <video
                    ref={videoRef}
                    src={movie?.fileId ? `${SERVER}files/${movie.fileId}` : ''}
                    className="w-full h-full object-contain"
                    autoPlay={true}
                    onDoubleClick={toggleFullscreen}
                />

                {/* Buffering Overlay */}
                {isBuffering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
                        <Loader2 className="animate-spin text-white" size={64} />
                    </div>
                )}

                {/* Custom Controls Overlay */}
                <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30
                                flex flex-col justify-between opacity-0 transition-opacity duration-300 z-10
                                ${showControls ? 'opacity-100' : 'opacity-0'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Top Controls (Back, Title) */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
                        <Button
                            onClick={() => navigate(-1)} // Navigate back to previous page
                            variant="ghost"
                            className="text-white hover:bg-gray-700 rounded-full p-2"
                        >
                            <ArrowLeft size={24} />
                        </Button>
                        <h3 className="text-xl font-semibold text-white truncate mx-4">{movie?.title}</h3>
                        <div className="w-8"></div> {/* Spacer for alignment */}
                    </div>

                    {/* Middle Controls (Skip Back/Forward, Play/Pause) */}
                    <div className="flex items-center justify-center flex-grow gap-8">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); skip(-10); }}
                            className="text-white hover:bg-white/20 p-3 rounded-full transition-all duration-200"
                        >
                            <Rewind size={40} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                            className="text-white hover:bg-white/20 p-4 rounded-full transition-all duration-200"
                        >
                            {isPlaying ? <Pause size={56} fill="currentColor" /> : <Play size={56} fill="currentColor" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); skip(10); }}
                            className="text-white hover:bg-white/20 p-3 rounded-full transition-all duration-200"
                        >
                            <FastForward size={40} />
                        </Button>
                    </div>

                    {/* Bottom Controls (Progress, Time, Volume, Settings, Fullscreen) */}
                    <div className="p-4 bg-gradient-to-t from-black/70 to-transparent">
                        {/* Progress Bar */}
                        <div className="flex items-center gap-4 mb-3">
                            <span className="text-sm text-gray-300">{formatTime(currentTime)}</span>
                            <Slider
                                value={[currentTime]}
                                max={duration}
                                step={0.1}
                                onValueChange={handleSeek}
                                className="flex-grow"
                                thumbClassName="bg-white border-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                                trackClassName="bg-gray-600 h-1.5 rounded-full"
                                rangeClassName="bg-red-600 h-1.5 rounded-full"
                            />
                            <span className="text-sm text-gray-300">{formatTime(duration)}</span>
                        </div>

                        {/* Control Buttons */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                    className="text-white hover:bg-gray-700 rounded-full p-2"
                                >
                                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                                    className="text-white hover:bg-gray-700 rounded-full p-2"
                                >
                                    {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                </Button>
                                <Slider
                                    value={[volume]}
                                    max={1}
                                    step={0.01}
                                    onValueChange={handleVolumeChange}
                                    className="w-24"
                                    thumbClassName="bg-white border-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                                    trackClassName="bg-red-600 h-1 rounded-full"
                                    rangeClassName="bg-white h-1 rounded-full"
                                />
                            </div>

                            <div className="flex items-center gap-3 relative">
                                {/* Settings Button (removed as per previous request) */}
                                {/* Fullscreen Button */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                                    className="text-white hover:bg-gray-700 rounded-full p-2"
                                >
                                    {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchPage;
