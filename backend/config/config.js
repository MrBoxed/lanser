const path = require("path");

// :::: CUSTOM VARIABLES CAN CHANGE AS PER USE :::: 
var DATABASE_NAME = "LANSER.db";
var SERVER_PORT = 27110;
var ROOT_FOLDER = path.join(__dirname, "../");

var MOVIE_FOLDER = path.join(ROOT_FOLDER, '/movies');


// :::: FUNCTIONS TO UPDATE VARIABLES :::: 
function SetMoviesFolderPath(pathToFolder) {
    MOVIE_FOLDER = pathToFolder;
}

module.exports = {
    DATABASE_NAME,
    SERVER_PORT,
    ROOT_FOLDER,
    MOVIE_FOLDER,

    SetMoviesFolderPath
}