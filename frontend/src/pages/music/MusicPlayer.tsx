import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Play, Pause, SkipForward, SkipBack, VolumeX, Volume2, ChevronUp, ChevronDown, X,
    Loader2, Airplay, // Import Airplay icon
    Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider'; // Assuming shadcn/ui Slider
import type { MusicData } from './MusicCard';

interface MusicPlayerProps {
    music: MusicData; // The current music track to play
    isPlaying: boolean; // Controls whether music should be playing
    setIsPlaying: (playing: boolean) => void; // Callback to update playing state in parent
    onNext: () => void; // Callback to play next track
    onPrev: () => void; // Callback to play previous track
    onClose: () => void; // Callback to close the player
    serverUrl: string; // Base URL for file serving
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
    music,
    isPlaying,
    setIsPlaying,
    onNext,
    onPrev,
    onClose,
    serverUrl,
}) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7); // Default volume
    const [isExpanded, setIsExpanded] = useState(false); // State for expanded player view
    const [isBuffering, setIsBuffering] = useState(false); // State for buffering indicator
    const [showVolume, setShowVolume] = useState<boolean>(true); // State for buffering indicator

    // Effect to handle playing/pausing when `isPlaying` prop changes
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Error playing audio:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    // Effect to load new music when `music` prop changes
    useEffect(() => {
        if (audioRef.current && music) {
            audioRef.current.src = `${serverUrl}files/${music.fileId}`;
            audioRef.current.load(); // Load the new source
            setIsBuffering(true); // Assume buffering until canPlayThrough
            audioRef.current.play().then(() => {
                setIsPlaying(true); // Start playing automatically
            }).catch(e => {
                console.error("Error playing new track:", e);
                setIsPlaying(false);
            });
        }
    }, [music, serverUrl, setIsPlaying]); // Depend on music and serverUrl

    // Effect to load and play new music when `music` prop changes
    useEffect(() => {
        if (audioRef.current && music) {
            // Set the new source
            audioRef.current.src = `${serverUrl}files/${music.fileId}`;
            // No need for explicit audioRef.current.load() here, play() will handle it.
            setIsBuffering(true); // Assume buffering until canPlayThrough or playing event

            // Attempt to play the new track
            audioRef.current.play().then(() => {
                setIsPlaying(true); // Successfully started playing
            }).catch(e => {
                // Catch errors during play, especially AbortError
                if (e.name === "AbortError") {
                    // This is often expected if a new play() call interrupts a previous one.
                    // Do not set isPlaying to false here, as the new play() might succeed.
                    console.warn("Playback interrupted (AbortError). New track might be loading.");
                } else {
                    console.error("Error playing new track:", e);
                    setIsPlaying(false); // Only set to false for other, unrecoverable errors
                }
            });
        }
    }, [music, serverUrl, setIsPlaying]); // Depend on music and serverUrl

    // Effect to set initial volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Event Handlers for Audio Element
    const handleTimeUpdate = useCallback(() => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    }, []);

    const handleLoadedMetadata = useCallback(() => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
            setIsBuffering(false); // Metadata loaded, likely not buffering anymore
        }
    }, []);

    const handleEnded = useCallback(() => {
        setIsPlaying(false);
        setCurrentTime(0);
        onNext(); // Play next song when current one ends
    }, [setIsPlaying, onNext]);

    const handlePlaying = useCallback(() => {
        setIsBuffering(false); // Audio is playing, not buffering
    }, []);

    const handleWaiting = useCallback(() => {
        setIsBuffering(true); // Audio is waiting (buffering)
    }, []);

    // Playback Controls
    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (value: number[]) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value[0];
            setCurrentTime(value[0]);
        }
    };

    const handleVolumeChange = (value: number[]) => {
        if (audioRef.current) {
            audioRef.current.volume = value[0] / 100; // Slider value is 0-100, volume is 0-1
            setVolume(value[0] / 100);
        }
    };

    // Format time for display (MM:SS)
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Calculate remaining time
    const remainingTime = duration - currentTime;

    if (!music) {
        return null; // Don't render player if no music is selected
    }

    return (
        // Main player container - positioned bottom-right, fixed size, rounded corners, brown background
        <div className={`fixed bottom-4 right-4 bg-[#6F5B4E] text-white shadow-2xl transition-all duration-300 ease-in-out z-50 rounded-2xl
                        ${isExpanded ? 'h-56 p-4 w-full max-w-lg' : 'h-fit px-4 py-3 w-full max-w-md'}`}> {/* Adjusted height, padding, and width for compact view */}

            {/* Audio Element (hidden) */}
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                onPlaying={handlePlaying}
                onWaiting={handleWaiting}
                preload="metadata" // Preload metadata for faster access to duration
            >
                <source src={`${serverUrl}files/${music.fileId}`} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>

            {/* Player Content */}
            <div className="flex flex-col h-full"> {/* Changed to flex-col for vertical layout */}
                {/* Top Row: Thumbnail, Song Info, Airplay/Close button */}
                <div className="flex items-center w-full mb-2"> {/* Added mb-2 for spacing */}
                    {/* Thumbnail */}
                    <div className={`flex-shrink-0 mr-3 ${isExpanded ? 'w-24 h-24' : 'w-16 h-16'} rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center transition-all duration-300`}>
                        {music.thumbnail ? (
                            <img src={`${serverUrl}music/thumbnail/${music.id}`} alt="Album Art" className="w-full h-full object-cover" />
                        ) : (
                            <Music size={isExpanded ? 48 : 32} className="text-gray-400" />
                        )}
                    </div>

                    {/* Song Info */}
                    <div className="flex-grow overflow-hidden">
                        <div className={`font-semibold ${isExpanded ? 'text-xl' : 'text-lg'} truncate`}>{music.title}</div>
                        <div className={`text-gray-200 ${isExpanded ? 'text-md' : 'text-sm'} truncate`}>{music.artist}</div>
                        {isExpanded && (
                            <div className="text-gray-300 text-sm mt-1">
                                {music.album && <span>{music.album} • </span>}
                                {music.genre && <span>{music.genre} • </span>}
                                {music.release_year && <span>{music.release_year}</span>}
                            </div>
                        )}
                    </div>

                    {/* Volume */}
                    {!isExpanded && (
                        <div
                            onClick={() => setShowVolume(!showVolume)}
                            className="relative p-2 rounded-full bg-white/10 flex items-center gap-2 m-4">
                            {volume === 0 ? <VolumeX size={20} className="text-gray-400" /> : <Volume2 size={20} className="text-gray-400" />}
                            <Slider
                                value={[volume * 100]} // Convert 0-1 to 0-100 for slider
                                max={100}
                                hidden={showVolume}
                                step={1}
                                onValueChange={handleVolumeChange}
                                className="w-[80px] absolute  -rotate-90"
                                thumbClassName="bg-white border-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#6F5B4E]"
                                trackClassName="bg-white"
                                rangeClassName="bg-[#A08B7F]"
                            />
                        </div>
                    )}

                    {/* Close Button (visible in compact view, top right, next to Airplay) */}
                    {!isExpanded && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-gray-200 hover:text-white hover:bg-red-700 rounded-full ml-2"
                        >
                            <X size={20} />
                        </Button>
                    )}
                </div>

                {/* Progress Bar & Times */}
                <div className="flex items-center w-full my-1"> {/* Increased vertical margin */}
                    <span className="text-xs text-gray-100 mr-2">{formatTime(currentTime)}</span>
                    <Slider
                        value={[currentTime]}
                        max={duration || 0}
                        step={1}
                        onValueChange={handleSeek}
                        className="flex-grow mx-1"
                        thumbClassName="bg-white border-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#6F5B4E]"
                        trackClassName="bg-[#A08B7F] h-1 rounded-full" // Lighter brown for track
                        rangeClassName="bg-white h-1 rounded-full" // White for progress
                    />
                    <span className="text-xs text-gray-100 ml-2">{formatTime(remainingTime)}</span>
                </div>

                {/* Playback Controls (Bottom Row) */}
                <div className="flex items-center justify-center w-full mt-2"> {/* Added mt-2 for spacing */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onPrev}
                        className="text-white hover:bg-[#8D7A6F] rounded-full mx-2"
                    >
                        <SkipBack size={28} fill="currentColor" /> {/* Filled icon */}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePlayPause}
                        className="text-white hover:bg-[#8D7A6F] rounded-full mx-2"
                    >
                        {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" />} {/* Filled icon */}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onNext}
                        className="text-white hover:bg-[#8D7A6F] rounded-full mx-2"
                    >
                        <SkipForward size={28} fill="currentColor" /> {/* Filled icon */}
                    </Button>
                </div>

                {/* Volume Control (only in expanded view - removed from compact) */}
                {/* {isExpanded && (
                    <div className="w-full flex items-center gap-2 mt-4">
                        {volume === 0 ? <VolumeX size={20} className="text-gray-400" /> : <Volume2 size={20} className="text-gray-400" />}
                        <Slider
                            value={[volume * 100]} // Convert 0-1 to 0-100 for slider
                            max={100}
                            step={1}
                            onValueChange={handleVolumeChange}
                            className="flex-grow"
                            thumbClassName="bg-white border-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#6F5B4E]"
                            trackClassName="bg-[#A08B7F]"
                            rangeClassName="bg-white"
                        />
                    </div>
                )} */}

                {/* Expand/Collapse Button (positioned differently) */}
                {/* This button is now hidden in the compact view, as per the image.
                    If you want to re-introduce expand functionality, you'll need to decide its placement.
                    For now, the player is primarily designed as a fixed compact player. */}
                {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="absolute top-2 right-12 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full"
                >
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                </Button> */}

                {/* Close button is now always visible in the compact view, top right */}
            </div>
        </div>
    );
};

export default MusicPlayer;
