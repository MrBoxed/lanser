import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

import worker from 'pdfjs-dist/build/pdf.worker?worker';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     'pdfjs-dist/build/pdf.worker.min.mjs',
//     import.meta.url,
// ).toString();

// IMPORTANT: Set up the worker for react-pdf.
// For local development or production, it's often better to host this file yourself.
// Copy 'node_modules/pdfjs-dist/build/pdf.worker.min.js' to your public directory (e.g., /public/pdf-worker.min.js)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// If you've copied it to your public folder, use:
// pdfjs.GlobalWorkerOptions.workerSrc = `/pdf-worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = worker;


const SERVER = "http://localhost:27110/api/"; // Your backend server URL

/**
 * BookReaderPage Component
 * Displays a PDF book using react-pdf.
 * Fetches the PDF based on a fileId from the URL parameters.
 */
const BookReaderPage = () => {
    const { fileId } = useParams<{ fileId: string }>();

    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pdfFile, setPdfFile] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Use a ref to store the object URL so it can be accessed in cleanup without being a dependency
    const objectUrlRef = useRef<string | null>(null);

    useEffect(() => {
        if (!fileId) {
            setError("No file ID provided to read the book.");
            setLoading(false);
            return;
        }

        const fetchPdf = async () => {
            setLoading(true);
            setError(null);
            // Clear previous URL if any before fetching new one
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
            setPdfFile(null); // Clear pdfFile state to ensure re-render if needed

            try {
                const response = await fetch(`${SERVER}files/${fileId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch PDF: ${response.statusText} (${response.status})`);
                }
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                objectUrlRef.current = url; // Store URL in ref
                setPdfFile(url); // Update state
            } catch (err: any) {
                console.error("Error fetching PDF:", err);
                setError(`Could not load the PDF file: ${err.message}. Please ensure the file exists and the server is running.`);
            } finally {
                setLoading(false);
            }
        };

        fetchPdf();

        // Cleanup function: Revoke the object URL when the component unmounts or effect re-runs
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
        };
    }, [fileId, SERVER]); // Dependency array: only re-run if fileId or SERVER changes

    /**
     * Callback function called when the PDF document successfully loads.
     * It receives an object containing the number of pages.
     */
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1); // Always start on the first page when a new document loads
    };

    /**
     * Navigates to the previous page, ensuring the page number doesn't go below 1.
     */
    const goToPrevPage = () => {
        setPageNumber((prevPageNumber) => Math.max(1, prevPageNumber - 1));
    };

    /**
     * Navigates to the next page, ensuring the page number doesn't exceed the total number of pages.
     */
    const goToNextPage = () => {
        setPageNumber((prevPageNumber) => Math.min(numPages || 1, prevPageNumber + 1));
    };

    // --- Render Loading, Error, or Content ---

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-950 text-white">
                <Loader2 className="animate-spin mr-2 mb-4" size={48} />
                <p className="text-xl">Loading PDF...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-red-900 text-white text-lg p-4 text-center">
                <p className="text-2xl font-bold mb-4">Error Loading Book</p>
                <p>{error}</p>
                <p className="mt-4 text-sm text-red-200">Please check your network connection or if the file exists on the server.</p>
            </div>
        );
    }

    if (!pdfFile) {
        // This case should ideally be covered by loading/error, but as a fallback
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-950 text-white text-lg">
                <p className="text-2xl font-bold mb-4">No PDF Available</p>
                <p>The book could not be loaded or no file ID was provided.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center p-4 bg-gray-950 min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-6 text-center text-white">Book Reader</h1>

            {/* Navigation Controls (Top) */}
            <div className="mb-6 flex items-center space-x-4 bg-gray-800 p-3 rounded-lg shadow-md">
                <Button
                    onClick={goToPrevPage}
                    disabled={pageNumber <= 1}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 transition-colors duration-200"
                >
                    <ChevronLeft className="mr-2" size={18} /> Previous
                </Button>
                <span className="text-lg font-medium text-white">
                    Page {pageNumber} of {numPages || '...'}
                </span>
                <Button
                    onClick={goToNextPage}
                    disabled={pageNumber >= (numPages || 1)}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 transition-colors duration-200"
                >
                    Next <ChevronRight className="ml-2" size={18} />
                </Button>
            </div>

            {/* PDF Document Viewer */}
            <div className="bg-gray-800 p-2 rounded-lg shadow-lg overflow-auto max-w-full">
                <Document
                    file={pdfFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(err) => {
                        console.error("Error loading PDF document:", err);
                        setError("Failed to load PDF document. It might be corrupted or in an unsupported format.");
                    }}
                    className="flex justify-center"
                >
                    <Page
                        pageNumber={pageNumber}
                        renderAnnotationLayer={true}
                        renderTextLayer={true}
                        className="border border-gray-700 rounded-md shadow-md"
                    />
                </Document>
            </div>

            {/* Navigation Controls (Bottom - optional, but good for UX) */}
            <div className="mt-6 flex items-center space-x-4 bg-gray-800 p-3 rounded-lg shadow-md">
                <Button
                    onClick={goToPrevPage}
                    disabled={pageNumber <= 1}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 transition-colors duration-200"
                >
                    <ChevronLeft className="mr-2" size={18} /> Previous
                </Button>
                <span className="text-lg font-medium text-white">
                    Page {pageNumber} of {numPages || '...'}
                </span>
                <Button
                    onClick={goToNextPage}
                    disabled={pageNumber >= (numPages || 1)}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 transition-colors duration-200"
                >
                    Next <ChevronRight className="ml-2" size={18} />
                </Button>
            </div>
        </div>
    );
};

export default BookReaderPage;
