const express = require("express");
const movieRouter = express.Router();
const multer = require('multer');

const { UploadFile, uploadDir } = require('../middleware/upload.middleware');

const fileType = uploadDir["movies"];

// ::: IP:PORT/api/movies/ ::: 
movieRouter.get('/', (req, res) => {
    res.json(fileType);
});

// ::: IP:PORT/api/movies/upload :::  
movieRouter.post('/upload', UploadMovie, (req, res) => {
    res.status(201).json({ message: "file uploaded" });
});

// :::  EXTRA FUNCITION BELOW THIS :::
function UploadMovie(req, res, next) {
    UploadFile(req, res, next, fileType);
    next();
}

module.exports = movieRouter;