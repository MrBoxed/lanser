import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { eq, InferInsertModel, desc, sql, ilike } from "drizzle-orm"; // Import 'ilike' for case-insensitive search
import { v4 as uuidv4 } from "uuid";
import * as fs from "node:fs/promises";
import * as path from "node:path";

import {
  movieTable,
  usersTable,
  booksTable,
  musicTable,
  filesTable,
  favoritesTable,
} from "./schema";
import { CategoryType, UserFormDataType } from "../types/form.types";

export const db = drizzle(process.env.DB_FILE_NAME!);
db.run("PRAGMA foreign_keys = ON");

// --- Existing Functions (InsertFileIntoTable, InsertIntoCategoryTable, FindUserInDB, GetFileForServing, GetRecentMovies, GetRecentBooks, GetRecentMusic, GetFavoriteItems, ToggleFavorite) ---
// ... (Your existing code for these functions goes here) ...

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

    // Ensure path uses forward slashes for consistency: as window file paht is differnet
    const filePath = uploadedFile.path.replace(/\\/g, "/");

    const fileData: NewFile = {
      id: fileId,
      originalName: uploadedFile.filename,
      fileName: formData.movieData?.title || "Untitled", // Or appropriate name for other categories
      fileType: uploadedFile.mimetype.split("/")[0], // e.g., 'video', 'audio', 'application' for PDF
      category: formData.category ?? "none",
      size: uploadedFile.size,
      extension: uploadedFile.mimetype.split("/")[1],
      path: filePath, // Store the path
      url: null, // fill this later if needed
      uploadedBy: Number(userId),
      uploadDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: formData.movieData?.isPublic ?? false, // Or formData.bookData?.isPublic etc.
      encoding: uploadedFile.encoding || "",
    };

    await db.insert(filesTable).values(fileData);

    // ::: File into dedicated table :::
    await InsertIntoCategoryTable(formData, thumbnailFile, fileId);
  } catch (err) {
    console.error("ERROR inserting file into DB: ", err);
  }
  console.log("Inserted successfully\n");
  return;
}

async function InsertIntoCategoryTable(
  formData: UserFormDataType,
  thumbnailFile: Express.Multer.File,
  fileId: string
) {
  console.log("category:" + formData.category);

  // Ensure thumbnail path uses forward slashes
  const thumbnailPath = thumbnailFile.path.replace(/\\/g, "/");

  switch (formData.category) {
    case CategoryType.MOVIE:
      type MovieTable = InferInsertModel<typeof movieTable>;
      if (formData.movieData) {
        const file: MovieTable = {
          title: formData.movieData?.title,
          release_year: formData.movieData?.releaseYear,
          genre: Array.isArray(formData.movieData?.genre)
            ? formData.movieData.genre.join(",")
            : formData.movieData?.genre,
          director: formData.movieData?.director,
          rating: formData.movieData?.rating,
          duration: formData.movieData?.duration,
          description: formData.movieData?.description,
          thumbnail: thumbnailPath,
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
          thumbnail: thumbnailPath,
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
          thumbnail: thumbnailPath,
          Pages: formData.bookData?.pages,
          Description: formData.bookData?.description,
          fileId,
        };
        await db.insert(booksTable).values(file);
      }
      break;

    default:
      console.warn("Unknown category:", formData.category);
      break;
  }
}

export async function FindUserInDB(
  usernameOrId: string | number
): Promise<typeof usersTable.$inferSelect | undefined> {
  try {
    let user;
    if (typeof usernameOrId === "number") {
      user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, usernameOrId))
        .limit(1);
    } else {
      user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.username, usernameOrId))
        .limit(1);
    }

    if (user.length > 0) {
      console.log("User found:", user[0].username);
      return user[0];
    } else {
      console.log("User not found.");
      return undefined;
    }
  } catch (error) {
    console.error("Error finding user in DB:", error);
    return undefined;
  }
}

export async function CreateFavouriteMovies(
  userId: number,
  fileId: string
): Promise<typeof favoritesTable.$inferInsert | undefined> {
  if (!userId || !fileId) {
    console.error("User ID and File ID are required to add a favorite.");
    return undefined;
  }

  try {
    const existingFavorite = await db
      .select()
      .from(favoritesTable)
      .where(
        eq(favoritesTable.userId, userId) && eq(favoritesTable.fileId, fileId)
      )
      .limit(1);

    if (existingFavorite.length > 0) {
      console.log("File is already in favorites for this user.");
      return undefined;
    }

    type NewFavorite = InferInsertModel<typeof favoritesTable>;
    const newFavorite: NewFavorite = {
      userId: userId,
      fileId: fileId,
      addedAt: new Date().toISOString(),
    };

    await db.insert(favoritesTable).values(newFavorite);
    console.log("File added to favorites successfully.");
    return newFavorite;
  } catch (error) {
    console.error("Error adding file to favorites:", error);
    return undefined;
  }
}

export async function GetFileForServing(
  fileId: string
): Promise<{ filePath: string; mimeType: string } | null> {
  if (!fileId) {
    console.error("File ID is required to retrieve a file.");
    return null;
  }

  try {
    const fileEntry = await db
      .select()
      .from(filesTable)
      .where(eq(filesTable.id, fileId))
      .limit(1);

    if (fileEntry.length === 0) {
      console.warn(`File with ID ${fileId} not found in database.`);
      return null;
    }

    const fileData = fileEntry[0];
    const fullFilePath = path.resolve(fileData.path);

    try {
      await fs.access(fullFilePath, fs.constants.R_OK);
    } catch (fsError) {
      console.error(`File not found on disk at path: ${fullFilePath}`, fsError);
      return null;
    }

    return {
      filePath: fullFilePath,
      mimeType: fileData.fileType + "/" + fileData.extension,
    };
  } catch (error) {
    console.error(
      `Error retrieving file ${fileId} from database or filesystem:`,
      error
    );
    return null;
  }
}

export async function GetRecentMovies(
  limit: number = 10
): Promise<(typeof movieTable.$inferSelect)[] | undefined> {
  try {
    const recentMovies = await db
      .select()
      .from(movieTable)
      .leftJoin(filesTable, eq(movieTable.fileId, filesTable.id))
      .orderBy(desc(filesTable.uploadDate))
      .limit(limit);

    const combinedMovies = recentMovies.map((row) => ({
      ...row.Movies,
      file: row.files,
    }));

    console.log(`Fetched ${combinedMovies.length} recent movies.`);
    return combinedMovies;
  } catch (error) {
    console.error("Error fetching recent movies:", error);
    return undefined;
  }
}

export async function GetRecentBooks(
  limit: number = 10
): Promise<(typeof booksTable.$inferSelect)[] | undefined> {
  try {
    const recentBooks = await db
      .select()
      .from(booksTable)
      .leftJoin(filesTable, eq(booksTable.fileId, filesTable.id))
      .orderBy(desc(filesTable.uploadDate))
      .limit(limit);

    const combinedBooks = recentBooks.map((row) => ({
      ...row.Books,
      file: row.files,
    }));

    console.log(`Fetched ${combinedBooks.length} recent books.`);
    return combinedBooks;
  } catch (error) {
    console.error("Error fetching recent books:", error);
    return undefined;
  }
}

export async function GetRecentMusic(
  limit: number = 10
): Promise<(typeof musicTable.$inferSelect)[] | undefined> {
  try {
    const recentMusic = await db
      .select()
      .from(musicTable)
      .leftJoin(filesTable, eq(musicTable.fileId, filesTable.id))
      .orderBy(desc(filesTable.uploadDate))
      .limit(limit);

    const combinedMusic = recentMusic.map((row) => ({
      ...row.Music,
      file: row.files,
    }));

    console.log(`Fetched ${combinedMusic.length} recent music tracks.`);
    return combinedMusic;
  } catch (error) {
    console.error("Error fetching recent music:", error);
    return undefined;
  }
}

export async function GetFavoriteItems(
  userId: number
): Promise<any[] | undefined> {
  if (!userId) {
    console.error("User ID is required to fetch favorite items.");
    return undefined;
  }

  try {
    const favoritesEntries = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId))
      .orderBy(desc(favoritesTable.addedAt));

    const favoriteItemsDetails: any[] = [];

    for (const favEntry of favoritesEntries) {
      const fileEntry = await db
        .select()
        .from(filesTable)
        .where(eq(filesTable.id, favEntry.fileId))
        .limit(1);

      if (fileEntry.length > 0) {
        const fileData = fileEntry[0];
        let itemDetail: any = { ...fileData };

        if (fileData.category === "video") {
          const movieDetail = await db
            .select()
            .from(movieTable)
            .where(eq(movieTable.fileId, fileData.id))
            .limit(1);
          if (movieDetail.length > 0) {
            itemDetail = { ...itemDetail, ...movieDetail[0] };
          }
        } else if (fileData.category === "audio") {
          const musicDetail = await db
            .select()
            .from(musicTable)
            .where(eq(musicTable.fileId, fileData.id))
            .limit(1);
          if (musicDetail.length > 0) {
            itemDetail = { ...itemDetail, ...musicDetail[0] };
          }
        } else if (fileData.category === "document") {
          const bookDetail = await db
            .select()
            .from(booksTable)
            .where(eq(booksTable.fileId, fileData.id))
            .limit(1);
          if (bookDetail.length > 0) {
            itemDetail = { ...itemDetail, ...bookDetail[0] };
          }
        }
        favoriteItemsDetails.push(itemDetail);
      }
    }

    console.log(
      `Fetched ${favoriteItemsDetails.length} favorite items for user ${userId}.`
    );
    return favoriteItemsDetails;
  } catch (error) {
    console.error(`Error fetching favorite items for user ${userId}:`, error);
    return undefined;
  }
}

export async function ToggleFavorite(
  userId: number,
  fileId: string
): Promise<{ status: "added" | "removed" } | null> {
  if (!userId || !fileId) {
    console.error("User ID and File ID are required to toggle favorite.");
    return null;
  }

  try {
    const existingFavorite = await db
      .select()
      .from(favoritesTable)
      .where(
        eq(favoritesTable.userId, userId) && eq(favoritesTable.fileId, fileId)
      )
      .limit(1);

    if (existingFavorite.length > 0) {
      await db
        .delete(favoritesTable)
        .where(eq(favoritesTable.id, existingFavorite[0].id));
      console.log(`Removed favorite: userId=${userId}, fileId=${fileId}`);
      return { status: "removed" };
    } else {
      type NewFavorite = InferInsertModel<typeof favoritesTable>;
      const newFavorite: NewFavorite = {
        userId: userId,
        fileId: fileId,
        addedAt: new Date().toISOString(),
      };
      await db.insert(favoritesTable).values(newFavorite);
      console.log(`Added favorite: userId=${userId}, fileId=${fileId}`);
      return { status: "added" };
    }
  } catch (error) {
    console.error(
      `Error toggling favorite for userId=${userId}, fileId=${fileId}:`,
      error
    );
    return null;
  }
}

// --- NEW SEARCH FUNCTIONS ---

/**
 * Searches for movies by title, description, director, or genre.
 * @param query The search string.
 * @param limit The maximum number of results to return.
 */
export async function SearchMovies(
  query: string,
  limit: number = 20
): Promise<(typeof movieTable.$inferSelect)[] | undefined> {
  try {
    const searchTerm = `%${query.toLowerCase()}%`; // Case-insensitive search term

    const results = await db
      .select()
      .from(movieTable)
      .leftJoin(filesTable, eq(movieTable.fileId, filesTable.id))
      .where(
        sql`lower(${movieTable.title}) like ${searchTerm} OR
            lower(${movieTable.description}) like ${searchTerm} OR
            lower(${movieTable.director}) like ${searchTerm} OR
            lower(${movieTable.genre}) like ${searchTerm}`
      )
      .limit(limit);

    const combinedResults = results.map((row) => ({
      ...row.Movies,
      file: row.files,
    }));

    console.log(`Found ${combinedResults.length} movies for query: "${query}"`);
    return combinedResults;
  } catch (error) {
    console.error(`Error searching movies for query "${query}":`, error);
    return undefined;
  }
}

/**
 * Searches for music by title, artist, album, or genre.
 * @param query The search string.
 * @param limit The maximum number of results to return.
 */
export async function SearchMusic(
  query: string,
  limit: number = 20
): Promise<(typeof musicTable.$inferSelect)[] | undefined> {
  try {
    const searchTerm = `%${query.toLowerCase()}%`;

    const results = await db
      .select()
      .from(musicTable)
      .leftJoin(filesTable, eq(musicTable.fileId, filesTable.id))
      .where(
        sql`lower(${musicTable.title}) like ${searchTerm} OR
            lower(${musicTable.artist}) like ${searchTerm} OR
            lower(${musicTable.album}) like ${searchTerm} OR
            lower(${musicTable.genre}) like ${searchTerm}`
      )
      .limit(limit);

    const combinedResults = results.map((row) => ({
      ...row.Music,
      file: row.files,
    }));

    console.log(
      `Found ${combinedResults.length} music tracks for query: "${query}"`
    );
    return combinedResults;
  } catch (error) {
    console.error(`Error searching music for query "${query}":`, error);
    return undefined;
  }
}

/**
 * Searches for books by title, author, or description.
 * @param query The search string.
 * @param limit The maximum number of results to return.
 */
export async function SearchBooks(
  query: string,
  limit: number = 20
): Promise<(typeof booksTable.$inferSelect)[] | undefined> {
  try {
    const searchTerm = `%${query.toLowerCase()}%`;

    const results = await db
      .select()
      .from(booksTable)
      .leftJoin(filesTable, eq(booksTable.fileId, filesTable.id))
      .where(
        sql`lower(${booksTable.title}) like ${searchTerm} OR
            lower(${booksTable.author}) like ${searchTerm} OR
            lower(${booksTable.Description}) like ${searchTerm}`
      )
      .limit(limit);

    const combinedResults = results.map((row) => ({
      ...row.Books,
      file: row.files,
    }));

    console.log(`Found ${combinedResults.length} books for query: "${query}"`);
    return combinedResults;
  } catch (error) {
    console.error(`Error searching books for query "${query}":`, error);
    return undefined;
  }
}
