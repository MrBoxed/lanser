import express from "express";
import videoRouter from "./videos.route";
import movieRouter from "./movie.route";
import audioRouter from "./music.route";
import docRouter from "./docs.route";
import uploadRouter from "./upload.route";
import authRouter from "./auth.route";
import thumbnailRouter from "./thumbnail.route";
import { db } from "../db/db";
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

// ::: IP:PORT/api/files/:id :::
apiRoute.get("/files/:id", async (req, res) => {
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

export default apiRoute;
