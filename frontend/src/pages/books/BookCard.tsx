import { BookOpen, MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

export type BookData = {
    id: string;
    title: string;
    author: string;
    fileId: string;
    genre: string;
    release_year: number;
    rating?: number;
};

type BookCardProps = {
    book: BookData;
};

export function BookCard({ book }: BookCardProps) {
    const SERVER = "http://localhost:27110/api/";
    const navigate = useNavigate();
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false); // New state for confirmation dialog

    let genre: string[] = book.genre?.split(',').map(item => item.trim()).slice(0, 2) || ["Unknown"];

    useEffect(() => {
        console.log("ShowInfo state:", showInfo);
    }, [showInfo]);

    /**
     * Initiates the download process after confirmation.
     * This function contains the actual file fetching and download logic.
     */
    async function confirmDownload() {
        try {
            const response = await fetch(`${SERVER}files/${book.fileId}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`File download failed: ${response.statusText} (${response.status})`);
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = book.title;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            setShowConfirmDialog(false); // Close dialog after successful download initiation
        } catch (err: any) {
            console.error("Download error:", err);
            // In a real application, replace this with a user-friendly message box or toast
            console.log(`Download failed for "${book.title}": ${err.message}`);
            setShowConfirmDialog(false); // Close dialog even if download fails
        }
    }

    /**
     * Opens the confirmation dialog when the download button is clicked.
     */
    function handleDownloadClick() {
        setShowConfirmDialog(true);
    }

    return (
        <div
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
            className="w-[250px] max-w-sm h-[300px] rounded-xl transition delay-150 ease-in-out bg-background hover:shadow-2xl overflow-hidden relative"
        >
            {/* Thumbnail */}
            <img
                src={`${SERVER}books/thumbnail/${book.id}`}
                alt={`Thumbnail for ${book.title}`}
                className="absolute h-full w-full object-cover rounded-2xl"
            />

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Info Overlay */}
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
                    <div className="absolute bottom-0 p-4 flex flex-col gap-2 w-full bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-sm">
                        <div className="text-xl text-white font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                            {book.title}
                        </div>
                        <div className="text-sm text-white font-semibold">
                            {genre.map((item, index) => (
                                <span key={index}>{item}{index < genre.length - 1 && " . "}</span>
                            ))}
                        </div>
                        <div className="text-sm text-white italic">{book.author}</div>
                        <div className="text-sm w-fit py-1 px-2 bg-black rounded-md text-white">
                            {book.release_year}
                        </div>
                        <div className="flex gap-2 mt-2">
                            {/* Download Button - now triggers confirmation dialog */}
                            <Button
                                onClick={handleDownloadClick} // Call the new handler
                                variant="default"
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
                            >
                                Download
                            </Button>
                            {/* Read Book Button */}
                            <Link to={`/books/read/${book.fileId}`} className="flex-1">
                                <Button
                                    variant="secondary"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
                                >
                                    <BookOpen className="mr-2" size={18} /> Read Book
                                </Button>
                            </Link>
                        </div>
                    </div>
                </AnimatedContent>
            )}

            {/* Confirmation Dialog */}
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                {/* AlertDialogTrigger is typically used to open the dialog, but we're controlling it with state */}
                {/* <AlertDialogTrigger asChild>
                    <Button variant="outline">Open</Button>
                </AlertDialogTrigger> */}
                <AlertDialogContent className="bg-gray-800 text-white border border-gray-700 rounded-lg shadow-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold">Confirm Download</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                            Are you sure you want to download "{book.title}"?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setShowConfirmDialog(false)}
                            className="bg-gray-600 hover:bg-gray-700 text-white border-none"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDownload} // This will execute the actual download logic
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
