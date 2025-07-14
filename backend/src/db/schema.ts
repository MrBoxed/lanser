import { int, real, sqliteTable, text, check, } from "drizzle-orm/sqlite-core";
// import { v4 as uuid } from "uuid";

// :::::::::::::::::::::::::::::::::::::
// :::: TABLES FORMAT FOR DATABASE ::::


// :::::::::::::::::::::::::::::::::::::
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