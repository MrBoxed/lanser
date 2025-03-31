const path = require("path");

// :::: CUSTOM VARIABLES CAN CHANGE AS PER USE :::: 
var DATABASE_NAME = "LANSER.db";
var SERVER_PORT = 27110;
var ROOT_FOLDER = path.join(__dirname, "../../");

var MOVIE_FOLDER = path.join(ROOT_FOLDER, '/movies');


// :::: FUNCTIONS TO UPDATE VARIABLES :::: 
function SetMoviesFolderPath(pathToFolder) {
    MOVIE_FOLDER = pathToFolder;
}



// ::: UPLOAD DIRECTORIES :::
const UPLOAD_DIR = {}    // Creating the Map for {key: value} pair

UPLOAD_DIR["movies"] = {
    type: 'movies',
    folder: path.join(ROOT_FOLDER, 'movies'),
    thumbnail: path.join(ROOT_FOLDER, 'movies', 'thumbnails'),
}

UPLOAD_DIR["books"] = {
    type: 'books',
    folder: path.join(ROOT_FOLDER, 'books'),
    thumbnail: path.join(ROOT_FOLDER, 'books', 'thumbnails'),
}

UPLOAD_DIR["music"] = {
    type: 'music',
    folder: path.join(ROOT_FOLDER, 'music'),
    thumbnail: path.join(ROOT_FOLDER, 'music', 'thumbnails'),
}

// ::: END OF DIRECTORIES :::


module.exports = {
    DATABASE_NAME,
    SERVER_PORT,
    ROOT_FOLDER,
    MOVIE_FOLDER,

    UPLOAD_DIR,
    SetMoviesFolderPath
}