import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Label } from "../../../../components/ui/label";

export type BookFormType = {
    title: string;
    author?: string;
    pages?: number;
    description?: string;
    file: File;
};

interface BookFormProps {
    setBookFormData: React.Dispatch<React.SetStateAction<BookFormType | null>>;
}

const BookForm = ({ setBookFormData }: BookFormProps) => {
    const [title, setTitle] = useState<string>("");
    const [author, setAuthor] = useState<string>("");
    const [pages, setPages] = useState<number>();
    const [description, setDescription] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);

    const [bookFormData, setLocalBookFormData] = useState<BookFormType | null>(null);

    useEffect(() => {
        if (!file) return;
        const data: BookFormType = {
            title,
            author,
            pages,
            description,
            file,
        };
        setLocalBookFormData(data);
    }, [title, author, pages, description, file]);

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

            {/* File Upload */}
            <Label className="w-full space-y-1 text-white">
                Upload Book File
                <input
                    type="file"
                    accept=".pdf,.epub,.docx,.txt"
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
            {file && (
                <div className="bg-white/10 p-2 rounded flex justify-between items-center text-white text-sm">
                    <span>{file.name}</span>
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
