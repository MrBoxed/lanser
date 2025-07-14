import path from "path";
import { UploadDirType } from "./types";

// :::: CUSTOM VARIABLES FOR SERVER :::: 
export const DATABASE_NAME = "LANSER.db";
export const SERVER_PORT = 27110;
export const ROOT_FOLDER = path.join(__dirname, "../../../"); // cause its in backend/build/src/config and i want it to be outside the project


// ::: UPLOAD DIRECTORIES :::
export const UPLOAD_DIR: Map<string, UploadDirType> = new Map();

UPLOAD_DIR.set("movies", {
    type: 'movies',
    folder: path.join(ROOT_FOLDER, 'movies'),
    thumbnail: path.join(ROOT_FOLDER, 'movies', 'thumbnails'),
});

UPLOAD_DIR.set("books", {
    type: 'books',
    folder: path.join(ROOT_FOLDER, 'books'),
    thumbnail: path.join(ROOT_FOLDER, 'books', 'thumbnails'),
});

UPLOAD_DIR.set("music", {
    type: 'music',
    folder: path.join(ROOT_FOLDER, 'music'),
    thumbnail: path.join(ROOT_FOLDER, 'music', 'thumbnails'),
});

// ::: END OF DIRECTORIES :::
