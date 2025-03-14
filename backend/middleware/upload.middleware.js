const multer = require('multer');
const path = require('path');

const uploadDir = new Map(); // Creating the Map for {key: value} pair
uploadDir.set("movies",
    {
        type: 'movies',
        folder: path.join(__dirname, './movies'),
        thumbnail: path.join(__dirname, '/movies/thumbnails'),
    }
);

uploadDir.set("books",
    {
        type: 'books',
        folder: path.join(__dirname, './books'),
        thumbnail: path.join(__dirname, '/books/thumbnails'),
    }
);

uploadDir.set("music",
    {
        type: 'music',
        folder: path.join(__dirname, './music'),
        thumbnail: path.join(__dirname, '/music/thumbnails'),
    }
);



module.exports = {
    uploadDir
}