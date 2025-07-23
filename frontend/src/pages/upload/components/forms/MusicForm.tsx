import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export type MusicFormType = {
    title: string;
    artist: string;
    album?: string;
    genre?: string;
    releaseYear?: number;
    thumbnail: File;
};

interface MusicFormProps {
    setMusicFormData: React.Dispatch<React.SetStateAction<MusicFormType | null>>;
}

const genreOptions = [
    "Pop", "Rock", "Hip-Hop", "Jazz", "Classical", "Electronic",
    "Country", "Reggae", "Folk", "R&B", "Blues", "Indie", "Metal"
];

const MusicForm = ({ setMusicFormData }: MusicFormProps) => {
    const [title, setTitle] = useState<string>("");
    const [artist, setArtist] = useState<string>("");
    const [album, setAlbum] = useState<string>("");
    const [genre, setGenre] = useState<string>("");
    const [releaseYear, setReleaseYear] = useState<number>();
    const [thumbnail, setFile] = useState<File | null>(null);

    const [musicFormData, setLocalMusicFormData] = useState<MusicFormType | null>(null);

    useEffect(() => {
        if (!thumbnail) return;
        const data: MusicFormType = {
            title: title,
            artist: artist,
            album: album,
            genre: genre,
            releaseYear: releaseYear,
            thumbnail: thumbnail,
        };
        setLocalMusicFormData(data);
    }, [title, artist, album, genre, releaseYear, thumbnail]);

    useEffect(() => {
        if (musicFormData) {
            setMusicFormData(musicFormData);
        }
    }, [musicFormData]);

    return (
        <div className="flex flex-col gap-4 w-full">

            {/* Title */}
            <input
                type="text"
                placeholder="Track Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/50 rounded-md p-2 text-white"
                required
            />

            {/* Artist & Album */}
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Artist"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full bg-black/50 rounded-md p-2 text-white"
                    required
                />
                <input
                    type="text"
                    placeholder="Album"
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    className="w-full bg-black/50 rounded-md p-2 text-white"
                />
            </div>

            {/* Genre & Release Year */}
            <div className="flex gap-2">
                <select
                    name="genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-black/50 rounded-md p-2 text-white"
                >
                    <option value="">Select Genre</option>
                    {genreOptions.map((g, i) => (
                        <option key={i} value={g}>{g}</option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Release Year"
                    value={releaseYear || ""}
                    onChange={(e) => setReleaseYear(Number(e.target.value))}
                    className="w-full bg-black/50 rounded-md p-2 text-white"
                    min={1900}
                    max={2025}
                />
            </div>

            {/* Upload Thumbnail */}
            <Label className="w-full space-y-1 text-white">
                Choose Thumbnail
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile) {
                            setFile(selectedFile);
                        }
                    }}
                    className="w-full bg-black/50 rounded-md p-2 text-white"
                />
            </Label>

            {/* Show selected thumbnail */}
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

export default MusicForm;
