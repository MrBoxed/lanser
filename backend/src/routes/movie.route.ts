import express from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { db } from "../db/db";
import { filesTable, movieTable } from "../db/schema";
import { desc, eq } from "drizzle-orm";
import path from "path";
import fs from "fs";

const movieRouter = express.Router();

movieRouter.get("/", authenticateToken, async (req, res) => {
  try {
    const movies = await db.select().from(movieTable);
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch movies" });
  }
});

// Getting the latest included movies
movieRouter.get("/latest", authenticateToken, async (req, res) => {
  try {
    const movies = await db
      .select()
      .from(movieTable)
      .leftJoin(filesTable, eq(movieTable.fileId, filesTable.id))
      .orderBy(desc(filesTable.uploadDate))
      .limit(5);

    res.status(200).json({ message: "Latest movies fetched", data: movies });
  } catch (error) {
    console.error("Error fetching latest movies:", error);
    res.status(500).json({ error: "Failed to fetch latest movies" });
  }
});

// :: Streaming :: MOVIE:::
movieRouter.get("/watch/:id", async (req, res) => {
  const movieId = Number(req.params.id);
  if (isNaN(movieId)) {
    return res.status(400).json({ error: "Invalid movie ID" });
  }

  try {
    // Get movie by ID
    const [movie] = await db
      .select()
      .from(movieTable)
      .where(eq(movieTable.id, movieId));

    if (!movie) return res.status(404).json({ error: "Movie not found" });

    // Use fileId directly (string)
    if (!movie.fileId) {
      return res.status(400).json({ error: "File ID not set for this movie" });
    }

    // Fetch file entry
    const [file] = await db
      .select()
      .from(filesTable)
      .where(eq(filesTable.id, movie.fileId));

    if (!file || !file.path) {
      return res.status(404).json({ error: "Video file not found" });
    }

    const filePath = path.resolve(file.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File does not exist on disk" });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      });
      return fs.createReadStream(filePath).pipe(res);
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      return res.status(416).send("Requested range not satisfiable");
    }

    const chunkSize = end - start + 1;
    const stream = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });

    stream.pipe(res);
  } catch (error) {
    console.error("Stream error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

movieRouter.get("/thumbnail/:id", async (req, res) => {
  const movieId: number = Number(req.params.id);

  try {
    const [movie] = await db
      .select()
      .from(movieTable)
      .where(eq(movieTable.id, movieId));

    if (!movie || !movie.thumbnail) {
      return res.status(404).json({ error: "Thumbnail not found" });
    }

    const resolvedPath = path.resolve(movie.thumbnail);

    // console.log(resolvedPath);

    // (Optional) Ensure file is inside thumbnails folder
    // const basePath = path.resolve("G:/lanser/backend/thumbnails/");
    // if (!resolvedPath.startsWith(basePath)) {
    //   return res.status(403).json({ error: "Access denied" });
    // }

    // Check if file exists
    if (!fs.existsSync(resolvedPath)) {
      return res.status(404).json({ error: "File does not exist" });
    }

    res.sendFile(resolvedPath);
  } catch (error) {
    console.error("Thumbnail error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

movieRouter.get("/:id", authenticateToken, async (req, res) => {
  const movieId = Number(req.params.id);

  // Check if it's a valid number
  if (isNaN(movieId)) {
    return res.status(400).json({ error: "Invalid movie ID" });
  }

  try {
    const movies = await db
      .select()
      .from(movieTable)
      .where(eq(movieTable.id, movieId));

    if (movies.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(movies[0]);
  } catch (err) {
    console.error("Error fetching movie:", err);
    res.status(500).json({ error: "Could not fetch movie" });
  }
});

export default movieRouter;
