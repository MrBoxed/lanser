import React, { SetStateAction, useEffect, useState } from "react";
import { LoaderCircle, UploadIcon, X } from "lucide-react";

import { Label } from "../../../../components/ui/label";
import { error } from "console";



// Define the form data type
export type MovieFormType = {
    title: string;
    releaseYear?: number;
    genre: string[];
    director?: string;
    rating?: number;
    duration?: number;
    isPublic: boolean,
    description?: string;
    thumbnail: File; // New line
};

interface MovieFormProps {
    SetMovieFormData: React.Dispatch<SetStateAction<MovieFormType | null>>,
}

const GenreOptions = ["Action", "Adventure", "Animation", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller", "Western", "Documentary", "Musical", "Crime", "Family", "History", "War", "Sport"];


const MovieForm = ({ SetMovieFormData }: MovieFormProps) => {
    const [title, setTitle] = useState<string>("");
    const [releaseYear, setReleaseYear] = useState<number>();
    const [genre, setGenre] = useState<Array<string>>([]);
    const [director, setDirector] = useState<string>("");
    const [rating, setRating] = useState<number>();
    const [duration, setDuration] = useState<number>();
    const [description, setDescription] = useState<string>("");
    const [makePrivate, setMakePrivate] = useState<boolean>(false);
    const [thumbnail, setThumbnail] = useState<File | null>(null);


    const [movieFormData, setMovieFormData] = useState<MovieFormType | null>(null);

    useEffect(() => {
        if (!thumbnail) {
            console.log("Error: Thumbnail need to be uploaded");
            return;
        }
        const data: MovieFormType = {
            title,
            releaseYear,
            genre,
            director,
            rating,
            duration,
            isPublic: !makePrivate,
            description,
            thumbnail: thumbnail, // Add this line
        };

        setMovieFormData(data);
    }, [title, releaseYear, genre, director, rating, duration, description, makePrivate, thumbnail]);


    useEffect(() => {

        if (movieFormData != null) {
            // for parent 
            SetMovieFormData(movieFormData);
        }

    }, [movieFormData]);

    return (
        (
            <>
                {/* Title */}
                <input
                    type="text"
                    name="title"
                    placeholder="Movie Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full min-h-6 bg-black/50 rounded-md p-2"
                />

                {/* Director && Duration */}
                <div className="w-full flex gap-2">
                    <input
                        type="text"
                        name="director"
                        placeholder="Director"
                        value={director}
                        onChange={(e) => setDirector(e.target.value)}
                        className="w-full min-h-6 bg-black/50 rounded-md p-2"
                    />

                    {/* Duration */}
                    <input
                        type="number"
                        name="duration"
                        min={0}
                        step={1}
                        placeholder="Duration (minutes)"
                        value={duration === null ? "" : duration}
                        onChange={(e) => {
                            const v = e.target.value;
                            setDuration(v === "" ? 0 : Math.max(0, Math.floor(Number(v))));
                        }}
                        className="w-full min-h-6 bg-black/50 rounded-md p-2"
                    />
                </div>

                {/* Release Year && Rating */}
                <div className="w-full flex gap-2">
                    <input
                        type="number"
                        name="release_year"
                        placeholder="Release Year"
                        min={1900}
                        max={2025}
                        step={1} // Ensures only whole numbers can be entered
                        value={releaseYear === null ? "" : releaseYear}
                        onChange={(e) => {
                            const val = e.target.value;
                            setReleaseYear(val === "" ? 0 : Number(val));
                        }}
                        required
                        className="w-full min-h-6 bg-black/50 rounded-md p-2"
                    />
                    {/* Rating */}
                    <input
                        type="number"
                        name="rating"
                        min={0.0}
                        max={10.0}
                        step={0.1}
                        placeholder="Rating"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full min-h-6 bg-black/50 rounded-md p-2"
                    />
                </div>


                {/* Description */}
                <textarea
                    name="description"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-6 bg-black/50 rounded-md p-2"
                />

                {/* Thumbnail Upload */}
                <Label className="w-full space-y-1">
                    Thumbnail
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setThumbnail(file);
                            }
                        }}
                        className="w-full bg-black/50 rounded-md p-2 text-white"
                    />

                </Label>

                {/* Genre */}
                <Label htmlFor="genre-tags" className="flex">
                    Genre
                    <select
                        id="genre-tags"
                        name="genre"
                        value={genre[0]}
                        onChange={
                            (e) => {
                                setGenre([...genre, e.target.value]);
                                console.log(genre)
                            }
                        }
                        required
                        className="w-full min-h-6 bg-black/50 rounded-md p-2"
                    >
                        {GenreOptions.map((genreOption, index) => (
                            <option
                                key={index}
                                onClick={(e) => {
                                    setGenre([...genre, genreOption[index]]);
                                    console.log(genre)
                                }}
                                value={genreOption}>
                                {genreOption}
                            </option>
                        ))}
                    </select>

                </Label >

                <div className="bg-white/20 gap-2 flex flex-wrap w-full p-2 min-h-12 text-white rounded-xl">

                    {genre?.map((item, index) => {
                        return (
                            <div className="py-1 px-2 gap-2 flex items-center text-[11px]  rounded-full bg-black">
                                <text>{item}</text>
                                <X size={14} key={index} onClick={(e) => {
                                    setGenre(
                                        genre.filter(item => item !== genre[index]))
                                }} />
                            </div>
                        )
                    })}
                </div>


                {/* Checkbox */}
                < label
                    className="w-full min-h-6 text-lg flex items-center space-x-2 mt-2"
                >
                    <input
                        type="checkbox"
                        name="isPublic"
                        checked={makePrivate}
                        onChange={(e) => { setMakePrivate(e.target.checked) }}
                        className="w-5 h-5 checked:bg-blue-600 peer-checked:to-blue-600:"
                    />
                    <span>Make Private</span>
                </label >

            </>
        )
    );
};

export default MovieForm;
