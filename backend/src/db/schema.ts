import { integer, int, real, sqliteTable, text, check, } from "drizzle-orm/sqlite-core";

// :::::::::::::::::::::::::::::::::::::
// :::: TABLES FORMAT FOR DATABASE ::::


export const filesTable = sqliteTable('files', {
    id: text('id').primaryKey().default('uuid_generate_v4()'), // Use custom UUID if your runtime supports it
    originalName: text('original_name').notNull(),
    fileName: text('file_name').notNull(),
    fileType: text('file_type').notNull(),
    category: text('category').notNull(), // e.g., video, audio, document
    size: integer('size').notNull(), // size in bytes
    extension: text('extension'),
    path: text('path').notNull(),
    url: text('url'),
    uploadedBy: text('uploaded_by'), // user ID (if you have a user table)
    uploadDate: text('upload_date').default(new Date().toISOString()), // ISO string timestamp
    updatedAt: text('updated_at'),
    isPublic: integer('is_public', { mode: 'boolean' }).default(false),
    description: text('description'),
    tags: text('tags'), // can store comma-separated tags or use a JSON string
    durationSeconds: real('duration_seconds'),
    width: integer('width'),
    height: integer('height'),
    encoding: text('encoding')
});

export const movieTable = sqliteTable("Movies", {
    id: int('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    release_year: int('release_year'),
    genre: text('genre').notNull(),
    director: text('director'),
    rating: real('rating'),
    duration: int('duration'),
    description: text('description'),
});


export const musicTable = sqliteTable("Music", {
    id: int('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    artist: text('artist').notNull(),
    album: text('album'),
    genre: text('genre'),
    release_year: int('realease_year'),

});

export const booksTable = sqliteTable("Books", {
    id: int('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    author: text('author'),
    Pages: int('Pages'),
    Description: text('Description'),
});

export const usersTable = sqliteTable('Users', {
    id: int('id').primaryKey({ autoIncrement: true }),
    name: text('name'),
    username: text('username').notNull(),
    password: text('password').notNull(),
    email: text('email'),
    profilePic: text('profilePic'),
    role: text('role').default('user'),
});

// :::::::::::::::::::::::::::::::::::::
// :::: END OF TABLE FORMAT ::::
// :::::::::::::::::::::::::::::::::::::