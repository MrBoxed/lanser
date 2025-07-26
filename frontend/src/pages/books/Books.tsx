import { useEffect, useState } from "react";
import { BookCard, type BookData } from "./BookCard";
import { instance } from "@/config/ApiService";
import { useLocation } from "react-router-dom"; // Import useLocation
import { Loader2 } from "lucide-react";

const SERVER = "http://localhost:27110/api/";

const BookHome = () => {
    const [books, setBooks] = useState<BookData[]>([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation(); // Get current location

    // Extract search query from URL
    const searchQuery = new URLSearchParams(location.search).get("query");

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                let url = `${SERVER}books/`; // Default to recent books
                if (searchQuery) {
                    url = `${SERVER}books/search?query=${encodeURIComponent(searchQuery)}`; // Use search endpoint if query exists
                }
                const response = await instance.get(url);
                setBooks(response.data || []);
            } catch (error) {
                console.error("Failed to fetch books:", error);
                setBooks([]); // Clear books on error
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [searchQuery, location.pathname]); // Re-fetch when query or path changes

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-950 text-white">
                <Loader2 className="animate-spin mr-2 mb-4" size={48} />
                <p className="text-xl">Loading books...</p>
            </div>
        );
    }

    return (
        <div className="w-full p-4 min-h-screen">
            <h1 className="text-3xl font-bold text-white mb-6 text-center">
                {searchQuery ? `Search Results for "${searchQuery}"` : "Explore Books"}
            </h1>

            {books.length === 0 ? (
                <p className="text-white text-center text-xl mt-10">
                    {searchQuery ? `No books found for "${searchQuery}".` : "No books available."}
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4 justify-items-center">
                    {books.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookHome;
