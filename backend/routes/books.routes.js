const express = require("express");
const bookRouter = express.Router();
const multer = require('multer');

const { uploadDir, dict } = require('../middleware/upload.middleware');

bookRouter.get('/', (req, res) => {
    res.json(dict);

});

bookRouter.post('/upload', (req, res) => {

})

module.exports = bookRouter;