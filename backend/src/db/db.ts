import "dotenv/config";

import { drizzle } from "drizzle-orm/libsql";
import { DrizzleError, eq, InferInsertModel } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import {
  movieTable,
  usersTable,
  booksTable,
  musicTable,
  filesTable,
} from "./schema";
import { CategoryType, UserFormDataType } from "../types/form.types";

export const db = drizzle(process.env.DB_FILE_NAME!);
db.run("PRAGMA foreign_keys = ON");

export async function InsertFileIntoTable(
  uploadedFile: Express.Multer.File,
  thumbnailFile: Express.Multer.File,
  formData: UserFormDataType,
  userId: number
) {
  // Basic file

  if (!userId) {
    console.error("UserId null");
    return;
  }
  if (!uploadedFile) {
    console.error("uploadedFile null");
    return;
  }
  if (!thumbnailFile) {
    console.error("thumbnailFile null");
    return;
  }

  console.log("uploading with userId:", userId, typeof userId);

  try {
    type NewFile = InferInsertModel<typeof filesTable>;
    const fileId: string = uuidv4();

    const fileData: NewFile = {
      id: fileId,
      originalName: uploadedFile.filename,
      fileName: formData.movieData?.title || "Untitled",
      fileType: uploadedFile.mimetype.split("/")[0], // e.g., 'video', 'audio'
      category: formData.category ?? "none",
      size: uploadedFile.size,
      extension: uploadedFile.mimetype.split("/")[1],
      path: uploadedFile.path.replace(/\\/g, "/"),
      url: null, // fill this later if needed
      // Must be a number (referencing `usersTable.id`)
      uploadedBy: Number(userId),
      uploadDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: formData.movieData?.isPublic ?? false,
      encoding: uploadedFile.encoding || "",
    };

    await db.insert(filesTable).values(fileData);

    // ::: File into dedicated table :::
    await InsertIntoCategoryTable(formData, thumbnailFile, fileId);
  } catch (err) {
    console.log("ERROR: " + err);
  }
  console.log("Inserted successfully\n");
  return;
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::: Function to insert in table based on the file category :::
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

async function InsertIntoCategoryTable(
  formData: UserFormDataType,
  thumbnailFile: Express.Multer.File,
  fileId: string
) {
  console.log("catgory:" + formData.category);

  switch (formData.category) {
    case CategoryType.MOVIE:
      type MovieTable = InferInsertModel<typeof movieTable>;
      if (formData.movieData) {
        const file: MovieTable = {
          title: formData.movieData?.title,
          release_year: formData.movieData?.releaseYear,

          // Array of genre to string with CSV (",") seperated
          genre: Array.isArray(formData.movieData?.genre)
            ? formData.movieData.genre.join(",")
            : formData.movieData?.genre,

          director: formData.movieData?.director,
          rating: formData.movieData?.rating,
          duration: formData.movieData?.duration,
          description: formData.movieData?.description,
          thumbnail: thumbnailFile.path,
          fileId: fileId,
        };

        await db.insert(movieTable).values(file);
      }
      break;

    case CategoryType.MUSIC:
      type MusicNewFile = InferInsertModel<typeof musicTable>;
      if (formData.musicData) {
        const file: MusicNewFile = {
          title: formData.musicData?.title,
          artist: formData.musicData?.artist,
          album: formData.musicData?.album,
          thumbnail: thumbnailFile.path,
          genre: formData.musicData?.genre,
          release_year: formData.musicData?.releaseYear,
          fileId,
        };
        await db.insert(musicTable).values(file);
      }
      break;

    case CategoryType.BOOKS:
      type BookNewFile = InferInsertModel<typeof booksTable>;
      if (formData.bookData) {
        const file: BookNewFile = {
          title: formData.bookData?.title,
          author: formData.bookData?.author,
          thumbnail: thumbnailFile.path,
          Pages: formData.bookData?.pages,
          Description: formData.bookData?.description,
          fileId,
        };

        await db.insert(booksTable).values(file);
      }
      break;

    default:
      return null; // or a fallback component
  }
}

// :::::::::::::::::::::::::::::::::::::::: //
// :::: FUNCTION FOR AUTH USING DB :::::::: //
// :::::::::::::::::::::::::::::::::::::::: //

export function FindUserInDB() {}

export async function GetRecentMovies() {}
