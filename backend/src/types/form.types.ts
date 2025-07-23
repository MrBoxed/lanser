export type SignUpFormData = {
  name: string;
  email: string;
  password: string;
};

export enum CategoryType {
  VIDEO = "video",
  IMAGE = "image",
  MOVIE = "movie",
  MUSIC = "music",
  DOCUMENT = "document",
  BOOKS = "books",
  NONE = "none",
}

export type MovieFormType = {
  title: string;
  releaseYear?: number;
  genre: string[];
  director?: string;
  rating?: number;
  duration?: number;
  isPublic: boolean;
  description?: string;
  thumbnail: File; // New line
};

export type MusicFormType = {
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  releaseYear?: number;
  thumbnail: File;
};

export type BookFormType = {
  title: string;
  author?: string;
  pages?: number;
  description?: string;
  thumbnail: File;
};

export type UserFormDataType = {
  category: CategoryType | null;
  filesize: number;
  movieData: MovieFormType | null;
  musicData: MusicFormType | null;
  bookData: BookFormType | null;
};
