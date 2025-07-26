import { integer, int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

// :::::::::::::::::::::::::::::::::::::
// :::: TABLES FORMAT FOR DATABASE ::::

export const filesTable = sqliteTable("files", {
  id: text("id").primaryKey(), // Use custom UUID if your runtime supports it
  originalName: text("original_name").notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  category: text("category").notNull(), // e.g., video, audio, document
  size: integer("size").notNull(), // size in bytes
  extension: text("extension"),
  path: text("path").notNull(),
  url: text("url"),

  // user ID (if you have a user table)
  uploadedBy: integer("uploaded_by").references(() => usersTable.id),

  uploadDate: text("upload_date").notNull(),

  updatedAt: text("updated_at"),

  isPublic: integer("is_public", { mode: "boolean" }).default(false),
  // description: text("description"),
  // tags: text("tags"), // can store comma-separated tags or use a JSON string
  // durationSeconds: real("duration_seconds"),
  // width: integer("width"),
  // height: integer("height"),
  encoding: text("encoding"),
});

export const movieTable = sqliteTable("Movies", {
  id: int("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  release_year: int("release_year"),
  genre: text("genre").notNull(),
  director: text("director"),
  rating: real("rating"),
  thumbnail: text("thumbnail"),
  duration: int("duration"),
  description: text("description"),
  fileId: text("file_id")
    .notNull()
    .references(() => filesTable.id, {
      onDelete: "cascade",
    }),
});

export const musicTable = sqliteTable("Music", {
  id: int("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  album: text("album"),
  genre: text("genre"),
  thumbnail: text("thumbnail"),
  release_year: int("release_year"),
  fileId: text("file_id")
    .notNull()
    .references(() => filesTable.id, {
      onDelete: "cascade",
    }),
});


export const booksTable = sqliteTable("Books", {
  id: int("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  author: text("author"),
  Pages: int("Pages"),
  thumbnail: text("thumbnail"),
  Description: text("Description"),
  fileId: text("file_id")
    .notNull()
    .references(() => filesTable.id, {
      onDelete: "cascade",
    }),
});

export const usersTable = sqliteTable("Users", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  username: text("username"),
  password: text("password").notNull(),
  email: text("email"),
  profilePic: text("profilePic"),
  role: text("role").default("user"),
});

export const favoritesTable = sqliteTable("favorites", {
  id: int("id").primaryKey({ autoIncrement: true }),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  fileId: text("file_id")
    .notNull()
    .references(() => filesTable.id, { onDelete: "cascade" }),
  addedAt: text("added_at").notNull(),
});

export const activeSessionsTable = sqliteTable("active_sessions", {
  id: int("id").primaryKey({ autoIncrement: true }),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  fileId: text("file_id")
    .notNull()
    .references(() => filesTable.id, { onDelete: "cascade" }),
  startedAt: text("started_at").notNull(),
  lastAccessedAt: text("last_accessed_at"), // optional for tracking updates
});

// :::::::::::::::::::::::::::::::::::::
// :::: END OF TABLE FORMAT ::::
// :::::::::::::::::::::::::::::::::::::
