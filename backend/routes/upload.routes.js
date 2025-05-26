const express = require("express");
const movieRouter = express.Router();
const { UploadFile } = require('../middleware/upload.middleware');
const { UPLOAD_DIR } = require('../config/config.js');

const fileType = UPLOAD_DIR["movies"];
