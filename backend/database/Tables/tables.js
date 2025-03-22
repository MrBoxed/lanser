// :::::::::::::::::::::::::::::::::::::
// :::: TABLES FORMAT FOR DATABASE ::::
// :::::::::::::::::::::::::::::::::::::
export const movieTable = {
    name: "Movies",
    strQuery:
        `CREATE TABLE Movies (
            MovieID INTEGER PRIMARY KEY AUTOINCREMENT,  -- Auto-incrementing ID for each movie
            Title TEXT NOT NULL,                        -- Movie title
            ReleaseYear INTEGER,                        -- Year the movie was released
            Genre TEXT,                                 -- Genre of the movie (e.g., Action, Drama)
            Director TEXT,                              -- Director's name
            Rating REAL,                                -- Movie rating (e.g., 7.8 out of 10)
            Duration INTEGER,                           -- Duration of the movie in minutes
            Description TEXT                            -- Short description or plot summary
);`
}

export const musicTable = {
    name: "Music",
    strQuery:
        `CREATE TABLE Music (
            MusicID INTEGER PRIMARY KEY AUTOINCREMENT,  -- Auto-incrementing ID for each music entry
            Title TEXT NOT NULL,                        -- Title of the song or music piece
            Artist TEXT NOT NULL,                       -- Artist or band name
            Album TEXT,                                 -- Album name
            Genre TEXT,                                 -- Genre of the music (e.g., Rock, Pop, Jazz)
            ReleaseYear INTEGER,                        -- Year the music was released
            Duration REAL,                              -- Duration of the track in minutes (e.g., 4.5)
            Rating REAL,                                -- Rating of the track (e.g., 4.5 out of 5)
            TrackNumber INTEGER,                        -- Track number if it's part of an album
            Description TEXT                            -- Short description or additional details about the music
);`
};

export const bookTable = {
    name: "Books",
    strQuery:
        `CREATE TABLE Books (
            BookID INTEGER PRIMARY KEY AUTOINCREMENT,   -- Auto-incrementing ID for each book
            Title TEXT NOT NULL,                        -- Title of the book
            Author TEXT NOT NULL,                       -- Author of the book
            Genre TEXT,                                 -- Genre of the book (e.g., Fiction, Non-fiction)
            ReleaseYear INTEGER,                        -- Year the book was published
            Rating REAL,                                -- Rating of the book (e.g., 4.5 out of 5)
            Pages INTEGER,                              -- Number of pages in the book
            Description TEXT                            -- Short description or summary of the book
);`
};

export const userTable = {
    name: "Users",
    strQuery:
        `CREATE TABLE Users (
            UserID INTEGER PRIMARY KEY AUTOINCREMENT,   -- Auto-incrementing ID for each user
            Name TEXT,                                  -- Full name of the user
            Username TEXT NOT NULL,                     -- Username for login
            Password TEXT NOT NULL,                     -- Password for login
            Email TEXT,                                 -- Email address of the user
            ProfilePic TEXT,                            -- Profile picture URL
            role TEXT CHECK(role IN ('admin', 'user')) -- Restricts role to 'admin' or 'user'
    );`
}

// :::::::::::::::::::::::::::::::::::::
// :::: END OF TABLE FORMAT ::::
// :::::::::::::::::::::::::::::::::::::