import express from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { db } from "../db/db";
import { musicTable } from "../db/schema";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs";

const audioRouter = express.Router();

audioRouter.get("/", authenticateToken, async (req, res) => {
  try {
    const music = await db.select().from(musicTable);
    res.json(music);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch music" });
  }
});

audioRouter.get("/thumbnail/:id", async (req, res) => {
  const movieId: number = Number(req.params.id);

  try {
    const [music] = await db
      .select()
      .from(musicTable)
      .where(eq(musicTable.id, movieId));

    if (!music || !music.thumbnail) {
      return res.status(404).json({ error: "Thumbnail not found" });
    }

    const resolvedPath = path.resolve(music.thumbnail);

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

export default audioRouter;
