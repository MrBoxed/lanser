import express from "express";
import videoRouter from "./videos.route";
import movieRouter from "./movie.route";
import audioRouter from "./music.route";
import docRouter from "./docs.route";
import uploadRouter from "./upload.route";
import authRouter from "./auth.route";
import thumbnailRouter from "./thumbnail.route";
import {
  db,
  GetFavoriteItems,
  GetFileForServing,
  ToggleFavorite,
} from "../db/db";
import { filesTable } from "../db/schema";
import { eq } from "drizzle-orm";

const apiRoute = express.Router();

// ::: IP:PORT/api/home :::
apiRoute.get("/home", (req, res) => {
  res.status(200).json({
    success: true,
    data: "ALL SET :)",
  });
});

// ::: IP:PORT/api/auth :::
apiRoute.use("/auth", authRouter);

// ::: IP:PORT/api/movies :::
apiRoute.use("/movies", movieRouter);

// ::: IP:PORT/api/music :::
apiRoute.use("/music", audioRouter);

// ::: IP:PORT/api/books :::
apiRoute.use("/books", docRouter);

// :: IP:PORT/api/upload :::
apiRoute.use("/upload", uploadRouter);

// ::: IP:PORT/api/thumbnail :::
apiRoute.use("/thumbnail", thumbnailRouter);

// ::: IP:PORT/api/download/:id :::
apiRoute.get("/download/:id", async (req, res) => {
  const fileId = req.params.id;

  // fetch file path from DB using fileId
  const file = await db
    .select()
    .from(filesTable)
    .where(eq(filesTable.id, fileId))
    .get();

  if (!file) {
    return res.status(404).send("File not found");
  }

  res.download(file.path, file.originalName); // will trigger download
});

// ::: IP:PORT/api/files/:id :::
apiRoute.get("/files/:fileId", async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const fileInfo = await GetFileForServing(fileId);

    if (!fileInfo) {
      return res.status(404).send("File not found.");
    }

    // Set the Content-Type header based on the file's MIME type
    res.setHeader("Content-Type", fileInfo.mimeType);
    // Send the file
    res.sendFile(fileInfo.filePath);
  } catch (error) {
    console.error("Error serving file:", error);
    res.status(500).send("Internal server error.");
  }
});

// ::: IP:PORT/api/favourties/:userId
apiRoute.get("/favorites/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId); // Ensure userId is parsed as number
    if (isNaN(userId)) {
      return res.status(400).send("Invalid User ID.");
    }
    const favorites = await GetFavoriteItems(userId);
    res.json(favorites);
  } catch (error) {
    console.error("API Error: GetFavoriteItems", error);
    res.status(500).send("Internal server error.");
  }
});

apiRoute.post("/favorites/toggle", async (req, res) => {
  try {
    const { userId, fileId } = req.body;
    if (!userId || !fileId) {
      return res.status(400).send("User ID and File ID are required.");
    }
    const result = await ToggleFavorite(userId, fileId);
    if (result) {
      res.json(result);
    } else {
      res.status(500).send("Failed to toggle favorite status.");
    }
  } catch (error) {
    console.error("API Error: ToggleFavorite", error);
    res.status(500).send("Internal server error.");
  }
});

export default apiRoute;
