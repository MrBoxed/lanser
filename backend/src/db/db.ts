import "dotenv/config";

import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import {
  movieTable,
  usersTable,
  booksTable,
  musicTable,
  filesTable,
} from "./schema";
import { FileSchema, UserFormData } from "../config/types";
import { File } from "buffer";

const db = drizzle(process.env.DB_FILE_NAME!);

export async function InsertFileIntoTable(
  uploadedFile: Express.Multer.File,
  formData: UserFormData
) {
  // TODO:
  // :: Identify the table Type::
  // :: Put it in general filesTables

  // :: FIND who uploaded this file ::
  // type of data to enter in which table we got

  // Basic file
  const [insertedItem] = await db
    .insert(filesTable)
    .values({
      id: uuidv4(),
      originalName: uploadedFile.filename,
      fileName: formData.name,
      fileType: uploadedFile.mimetype.split("/")[0],
      category: formData.category,
      size: uploadedFile.size,
      extension: uploadedFile.mimetype.split("/")[1],
      path: uploadedFile.path,
      url: "",
      uploadedBy: "", // Add login system later to include uploaded by,
      isPublic: formData.isPublic,
      description: formData.description,
      tags: formData.tags,
    })
    .returning();

  console.log("Result set:" + JSON.stringify(insertedItem));

  // ::: File into dedicated table :::
  let tableType;
  switch (formData.category) {
    case "movie":
      tableType = movieTable;
  }

  if (tableType) {
    const insertCategory = await db.insert(tableType).values({
      title: formData.name,
      fileId: insertedItem.id,
      genre: "entertainment",
    });
  }
}

export async function GetRecentMovies() {}
