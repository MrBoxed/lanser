import express from "express";
import fs from "fs";
import path from "path";
import { movieTable } from "../db/schema";
import { db } from "../db/db";
import { eq } from "drizzle-orm";

const thumbnailRouter = express.Router();

//api/thumbnail?path=full_file_path
thumbnailRouter.get("/", (req, res) => {
  const filePath = req.query.path as string;

  if (!filePath) return res.status(400).json({ error: "Path required" });

  // Validate that the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  res.sendFile(path.resolve(filePath));
});

// ::: PRIVACY concern using movieID :::
thumbnailRouter.get("/:id", async (req, res) => {
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

export default thumbnailRouter;
