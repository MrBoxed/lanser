import express from "express";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs";
import { db } from "../db/db";
import { booksTable, filesTable } from "../db/schema";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

// ::: HOST:PORT:api/books
router.get("/", async (req, res) => {
  try {
    const books = await db.select().from(booksTable);
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

router.get("read/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch book
    const book = await db
      .select()
      .from(booksTable)
      .where(eq(booksTable.id, parseInt(id)))
      .get();

    if (!book) return res.status(404).send("Book not found");

    // Fetch the file from files table
    const file = await db
      .select()
      .from(filesTable)
      .where(eq(filesTable.id, book.fileId))
      .get();
    if (!file) return res.status(404).send("File not found");

    const filePath = path.join(process.cwd(), "uploads", file.fileName);
    if (!fs.existsSync(filePath))
      return res.status(404).send("Stored file missing");

    res.download(filePath, file.originalName);
  } catch (err) {
    console.error("Error downloading book:", err);
    res.status(500).send("Internal Server Error");
  }
});

// ::: HOST:PORT:api/books/thumbnail/:ID
router.get("/thumbnail/:id", async (req, res) => {
  const movieId: number = Number(req.params.id);

  try {
    const [book] = await db
      .select()
      .from(booksTable)
      .where(eq(booksTable.id, movieId));

    if (!book || !book.thumbnail) {
      return res.status(404).json({ error: "Thumbnail not found" });
    }

    const resolvedPath = path.resolve(book.thumbnail);

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
export default router;
