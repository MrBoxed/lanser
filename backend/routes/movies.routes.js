const express = require("express");
const moviewRouter = express.Router();
const multer = require('multer');

const { uploadDir, dict } = require('../middleware/upload.middleware');

moviewRouter.get('/', (req, res) => {
    res.json(dict);

});

moviewRouter.post('/upload', (req, res) => {

})

module.exports = moviewRouter;