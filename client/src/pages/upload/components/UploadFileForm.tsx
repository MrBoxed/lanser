import { LoaderCircle, UploadIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormDataType } from "../Upload";
import MovieForm, { MovieFormType } from "./forms/MovieForm";
import MusicForm from "./forms/MusicForm";
import BookForm from "./forms/BookForm";


export interface UploadFileFormProps {
  file: File,
  filename: string,
  startUpload: boolean,
  formData: FormDataType,
  SubmitFunction: () => Promise<void>,
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>
}
// "video", "image", "document",
const FileCategory: string[] = ["none", "movie", "music", "books"];

export enum CategoryType {
  VIDEO = "video",
  IMAGE = "image",
  MOVIE = "movie",
  MUSIC = "music",
  DOCUMENT = "document",
  BOOKS = "books",
  NONE = "none"
}


function UploadFileForm({ file, startUpload, SubmitFunction, formData, setFormData }: UploadFileFormProps) {

  const [category, setCategory] = useState<CategoryType>(CategoryType.NONE);
  const [userFormData, setUserFormData] = useState<FormDataType | null>(null);
  const [movieFormData, setMovieFormData] = useState<MovieFormType | null>(null);

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    if (movieFormData != null) {
      console.log("the category form is not null");
      const data: FormDataType = {
        category: category,
        filesize: file.size,
        movieData: movieFormData,
        // musicData: null,
        // bookData: null,
      }

      setFormData(data);
      setUserFormData(data);
    }
    console.log("the category form is null");

  };

  useEffect(() => {

    if (!file?.type) return;

    // :: FUNCITON TO DETERMINE THE FILE TYPE
    const getFileCategory = (): CategoryType => {
      const guessing = file.type;

      if (guessing.startsWith('video/'))
        return CategoryType.VIDEO;

      if (guessing.startsWith('image/'))
        return CategoryType.IMAGE;

      if (guessing === 'application/pdf' || guessing.includes('msword') || guessing.includes('presentation') || guessing.includes('spreadsheet'))
        return CategoryType.DOCUMENT;

      if (guessing.startsWith('audio/'))
        return CategoryType.MUSIC;

      // // Custom logic for MOVIE vs VIDEO (if needed)
      // if (guessing === 'video/mp4' || guessing === 'video/quicktime')
      //   return CategoryType.MOVIE;

      // // Optional: check for eBook types for BOOKS
      // if (guessing === 'application/epub+zip' || guessing === 'application/x-mobipocket-ebook')
      //   return CategoryType.BOOKS;

      return CategoryType.NONE;
    };

    setCategory(getFileCategory())

  }, []);


  // :: For upldating form data ::
  useEffect(() => {
    if (userFormData != null)
      SubmitFunction();
  }, [userFormData]);


  // :: Funciton to show different form inputs based on fileCategory
  function HandleCatgoryForm() {

    switch (category) {
      case CategoryType.VIDEO:
        return <>VIdeo</>;
      case CategoryType.IMAGE:
        return <>Image</>;
      case CategoryType.MOVIE:
        return <MovieForm SetMovieFormData={setMovieFormData} />;
      case CategoryType.MUSIC:
        return <MusicForm />;
      case CategoryType.DOCUMENT:
        return <>DOCUMENT</>;
      case CategoryType.BOOKS:
        return <BookForm />;
      default:
        return null; // or a fallback component
    }

  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full justify-center flex flex-col gap-2 bg-white/10 rounded-2xl p-4" >

      <select
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value as CategoryType)}
        required
        defaultValue='movie'
        className="w-full min-h-6 bg-black/50  rounded-md p-2"
      >
        {
          FileCategory.map((category, key) => {
            return (
              <option key={key} value={category}>{category.toUpperCase()}</option>
            )
          })}
      </select>
      {/* Showing form data based on file category */}
      {HandleCatgoryForm()}

      <button
        type="submit"
        // disabled={startUpload}
        className="w-full flex gap-3 items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-slate-800/70 disabled:cursor-not-allowed">

        {
          !startUpload
            ? (<>
              <UploadIcon />
              <span>Uplaod</span>
            </>)
            : (<>
              <LoaderCircle size={32} className="animate-spin" />
            </>)
        }
      </button>
    </form >
  );
};

export default UploadFileForm;
