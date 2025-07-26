import { DownloadIcon, Music, Play } from 'lucide-react'; // Added Play icon
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedContent from '@/components/common/AnimatedContent';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components

export interface MusicData {
    id: number;
    title: string;
    artist: string;
    album?: string;
    genre?: string;
    release_year?: number;
    fileId: string;
    thumbnail?: string; // Added thumbnail to MusicData
}

type MusicCardProps = {
    music: MusicData;
    onPlay: (music: MusicData) => void; // Callback to play music in the parent
};

export function MusicCard({ music, onPlay }: MusicCardProps) {
    const SERVER = "http://localhost:27110/api/";
    const navigate = useNavigate();
    const [showInfo, setShowInfo] = useState(false);
    const [showDownloadConfirm, setShowDownloadConfirm] = useState(false); // State for download confirmation

    useEffect(() => {
        console.log("Hovering:", showInfo);
    }, [showInfo]);

    const handleDownloadClick = () => {
        setShowDownloadConfirm(true);
    };

    const confirmDownload = async () => {
        try {
            const response = await fetch(`${SERVER}files/${music.fileId}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`File download failed: ${response.statusText} (${response.status})`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = music.title + (music.album ? ` - ${music.album}` : ''); // Better filename
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            setShowDownloadConfirm(false);
        } catch (err: any) {
            console.error("Download error:", err);
            console.log(`Download failed for "${music.title}": ${err.message}`);
            setShowDownloadConfirm(false);
        }
    };

    return (
        <div
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
            // Added 'group' for hover effects on children
            // Increased transition duration for a smoother feel
            // Added subtle ring on hover
            className="group w-[250px] max-w-sm h-[250px] rounded-xl transition-all duration-300 ease-in-out bg-background hover:shadow-2xl hover:shadow-purple-800/50 overflow-hidden relative
                       hover:ring-2 hover:ring-purple-600"
        >
            {/* Thumbnail */}
            {music.thumbnail ? (
                <img
                    src={`${SERVER}music/thumbnail/${music.id}`}
                    alt={`Thumbnail for ${music.title}`}
                    className="absolute h-full w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                />
            ) : (
                // Fallback if no thumbnail is available, similar to your commented out section
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-800 text-white rounded-xl transition-transform duration-300 group-hover:scale-105">
                    <Music size={64} />
                    <h2 className="text-lg font-semibold mt-2 text-center px-2">{music.title}</h2>
                    <p className="text-sm text-center px-2">{music.artist}</p>
                </div>
            )}


            {/* Overlay for better text readability and subtle initial darkening */}
            <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:opacity-0" />

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
                    <div
                        // Enhanced background with more blur and a slightly darker gradient
                        className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2 w-full
                                   bg-gradient-to-t from-black/95 via-black/80 to-transparent
                                   backdrop-filter backdrop-blur-sm rounded-b-xl" // Rolled back blur from 'md' to 'sm'
                    >
                        <div className="text-xl text-white font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                            {music.title}
                        </div>
                        <div className="text-sm text-gray-200 font-medium truncate">
                            {music.artist} {music.album && `• ${music.album}`}
                        </div>
                        <div className="text-xs text-gray-300">
                            {music.genre || "Genre"} • {music.release_year || "Year"}
                        </div>

                        <div className="flex gap-2 mt-3">
                            <Button
                                onClick={handleDownloadClick}
                                variant="default"
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 shadow-lg flex items-center justify-center"
                            >
                                <DownloadIcon size={16} className="mr-1" /> Download
                            </Button>

                            <Button
                                variant="secondary"
                                onClick={() => onPlay(music)} // Call onPlay prop
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-200 shadow-lg flex items-center justify-center"
                            >
                                <Play size={16} className="mr-1" /> Listen
                            </Button>
                        </div>
                    </div>
                </AnimatedContent>
            )}

            {/* Download Confirmation Dialog */}
            <AlertDialog open={showDownloadConfirm} onOpenChange={setShowDownloadConfirm}>
                <AlertDialogContent className="bg-gray-800 text-white border border-gray-700 rounded-lg shadow-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold">Confirm Download</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                            Are you sure you want to download "{music.title}" by {music.artist}?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setShowDownloadConfirm(false)}
                            className="bg-gray-600 hover:bg-gray-700 text-white border-none"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDownload}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Yes, Download
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
