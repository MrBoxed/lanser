const express = require("express");
const movieRouter = express.Router();
const multer = require('multer');

const { UploadFile } = require('../middleware/upload.middleware');
const { UPLOAD_DIR } = require('../config/config.js');

const fileType = UPLOAD_DIR["movies"];


// ::: IP:PORT/api/movies/ ::: 
movieRouter.get('/', (req, res) => {
    res.json(fileType);
});

// ::: IP:PORT/api/movies/upload :::  
movieRouter.post('/upload', UploadMovie, async (req, res) => {
    if (req.file)
        return res.status(201).send('File Uploaded :)');

    else
        res.status(500).json({ message: "No file uploaded" });
});

// :::  EXTRA FUNCITION BELOW THIS :::
function UploadMovie(req, res, next) {
    UploadFile(req, res, next, fileType);
    next();
}

module.exports = movieRouter;