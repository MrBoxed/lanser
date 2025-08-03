import {
  Clapperboard,
  BookOpenText,
  Music,
  type LucideProps,
} from "lucide-react";

export const PRODUCT_NAME = "Lanser";

export type TabType = {
  name: string;
  image: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  path: string;
};

export type UserData = {
  id: number;
  email: string;
  name: string;
  profilePic: string;
  rold: string;
  username: string;
};

export const siteTabs: TabType[] = [
  {
    name: "Movies",
    image: Clapperboard,
    path: "/movies",
  },
  {
    name: "Books",
    image: BookOpenText,
    path: "/books",
  },
  {
    name: "Music",
    image: Music,
    path: "/music",
  },
];

export const uploadSteps = [
  { id: 1, name: "Upload File" },
  { id: 2, name: "File data" },
  { id: 3, name: "Success" },
];

// Video file extensions
export const VideoExtensions: string[] = [
  ".mp4",
  ".mov",
  ".avi",
  ".mkv",
  ".wmv",
  ".flv",
  ".webm",
  ".mpeg",
  ".mpg",
  ".3gp",
  ".m4v",
  ".ts",
  ".m2ts",
  ".ogv",
  ".f4v",
  ".rm",
  ".divx",
  ".vob",
  ".asf",
];

// Image file extensions
export const ImageExtensions: string[] = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".tiff",
  ".webp",
  ".svg",
  ".ico",
  ".heic",
  ".avif",
];

// Audio file extensions
export const AudioExtensions: string[] = [
  ".mp3",
  ".wav",
  ".aac",
  ".flac",
  ".ogg",
  ".m4a",
  ".wma",
  ".aiff",
  ".alac",
  ".opus",
  ".amr",
];

// Document file extensions
export const DocumentExtensions: string[] = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".txt",
  ".rtf",
  ".odt",
  ".csv",
  ".md",
  ".json",
  ".xml",
];

export const MovieGenre: Array<String> = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Fantasy",
  "Thriller",
  "Animation",
  "Documentary",
  "Mystery",
  "Musical",
  "Crime",
  "War",
];
