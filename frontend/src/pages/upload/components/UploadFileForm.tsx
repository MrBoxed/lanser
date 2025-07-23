import { LoaderCircle, UploadIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { type FormDataType } from "../Upload";
import MovieForm, { type MovieFormType } from "./forms/MovieForm";
import MusicForm, { type MusicFormType } from "./forms/MusicForm";
import BookForm, { type BookFormType } from "./forms/BookForm";
import { CategoryType } from "@/utils/enum.types";

export interface UploadFileFormProps {
  file: File,
  filename: string,
  startUpload: boolean,
  SubmitFunction: () => Promise<void>,
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>
}

const FileCategory: string[] = ["none", "movie", "music", "books"];

function UploadFileForm({ file, startUpload, SubmitFunction, setFormData }: UploadFileFormProps) {
  const [category, setCategory] = useState<CategoryType>(CategoryType.NONE);
  const [userFormData, setUserFormData] = useState<FormDataType | null>(null);
  const [movieFormData, setMovieFormData] = useState<MovieFormType | null>(null);
  const [musicFormData, setMusicFormData] = useState<MusicFormType | null>(null);
  const [bookFormData, setBookFormData] = useState<BookFormType | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: FormDataType = {
      category: category,
      filesize: file.size,
      movieData: movieFormData,
      musicData: musicFormData,
      bookData: bookFormData,
    };

    setUserFormData(data);
    setFormData(data);
  };

  useEffect(() => {

    if (!file?.type) return;

    const getFileCategory = (): CategoryType => {
      const guessing = file.type;

      if (guessing.startsWith("video/")) return CategoryType.VIDEO;
      if (guessing.startsWith("image/")) return CategoryType.IMAGE;
      if (
        guessing === "application/pdf" ||
        guessing.includes("msword") ||
        guessing.includes("presentation") ||
        guessing.includes("spreadsheet")
      )
        return CategoryType.DOCUMENT;
      if (guessing.startsWith("audio/")) return CategoryType.MUSIC;

      return CategoryType.NONE;
    };

    setCategory(getFileCategory());
  }, []);

  useEffect(() => {
    if (userFormData != null) {
      console.log("userFormData" + JSON.stringify(userFormData));
      SubmitFunction();
    }

  }, [userFormData]);

  function HandleCatgoryForm() {
    switch (category) {
      case CategoryType.MOVIE:
        return <MovieForm SetMovieFormData={setMovieFormData} />;
      case CategoryType.MUSIC:
        return <MusicForm setMusicFormData={setMusicFormData} />;
      case CategoryType.BOOKS:
        return <BookForm setBookFormData={setBookFormData} />;
      case CategoryType.VIDEO:
        return <>Video</>;
      case CategoryType.IMAGE:
        return <>Image</>;
      case CategoryType.DOCUMENT:
        return <>Document</>;
      default:
        return null;
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full justify-center flex flex-col gap-2 bg-white/10 rounded-2xl p-4"
    >
      <select
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value as CategoryType)}
        required
        className="w-full min-h-6 bg-black/50 rounded-md p-2"
      >
        {FileCategory.map((cat, key) => (
          <option key={key} value={cat}>
            {cat.toUpperCase()}
          </option>
        ))}
      </select>

      {HandleCatgoryForm()}

      <button
        type="submit"
        disabled={startUpload}
        className="w-full flex gap-3 items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-slate-800/70 disabled:cursor-not-allowed"
      >
        {!startUpload ? (
          <>
            <UploadIcon />
            <span>Upload</span>
          </>
        ) : (
          <>
            <LoaderCircle size={32} className="animate-spin" />
          </>
        )}
      </button>
    </form>
  );
}

export default UploadFileForm;
