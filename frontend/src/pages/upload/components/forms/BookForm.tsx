import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export type BookFormType = {
    title: string;
    author?: string;
    pages?: number;
    description?: string;
    thumbnail: File;
};

interface BookFormProps {
    setBookFormData: React.Dispatch<React.SetStateAction<BookFormType | null>>;
}

const BookForm = ({ setBookFormData }: BookFormProps) => {
    const [title, setTitle] = useState<string>("");
    const [author, setAuthor] = useState<string>("");
    const [pages, setPages] = useState<number>();
    const [description, setDescription] = useState<string>("");
    const [thumbnail, setFile] = useState<File | null>(null);

    const [bookFormData, setLocalBookFormData] = useState<BookFormType | null>(null);

    useEffect(() => {
        if (!thumbnail) return;
        const data: BookFormType = {
            title: title,
            author: author,
            pages: pages,
            description: description,
            thumbnail: thumbnail,
        };
        setLocalBookFormData(data);
    }, [title, author, pages, description, thumbnail]);

    useEffect(() => {
        if (bookFormData) {
            setBookFormData(bookFormData);
        }
    }, [bookFormData]);

    return (
        <div className="flex flex-col gap-4 w-full">

            {/* Title */}
            <input
                type="text"
                placeholder="Book Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/50 rounded-md p-2 text-white"
                required
            />

            {/* Author & Pages */}
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-black/50 rounded-md p-2 text-white"
                />
                <input
                    type="number"
                    placeholder="Pages"
                    value={pages || ""}
                    min={1}
                    onChange={(e) => setPages(Number(e.target.value))}
                    className="w-full bg-black/50 rounded-md p-2 text-white"
                />
            </div>

            {/* Description */}
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-black/50 rounded-md p-2 text-white"
            />

            {/* Thumbail Upload */}
            <Label className="w-full space-y-1 text-white">
                Choose Thumbnail
                <input
                    type="file"
                    accept="image/"
                    onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile) {
                            setFile(selectedFile);
                        }
                    }}
                    className="w-full bg-black/50 rounded-md p-2 text-white"
                />
            </Label>

            {/* Show selected file */}
            {thumbnail && (
                <div className="bg-white/10 p-2 rounded flex justify-between items-center text-white text-sm">
                    <span>{thumbnail.name}</span>
                    <X
                        className="cursor-pointer"
                        onClick={() => setFile(null)}
                        size={18}
                    />
                </div>
            )}
        </div>
    );
};

export default BookForm;
