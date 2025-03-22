const multer = require('multer');
const path = require('path');
const fs = require('fs');

const FIELD_NAME = "videoFile"; // form FIELD_NAME : should be same as frontend

// :: Folder path where you want to create uploads folders: 
// :: PROJECT ROOT DIR
const { ROOT_FOLDER } = require('../config/config.js');

// ::: UPLOAD DIRECTORIES :::
const uploadDir = {}    // Creating the Map for {key: value} pair

uploadDir["movies"] = {
    type: 'movies',
    folder: path.join(ROOT_FOLDER, 'movies'),
    thumbnail: path.join(ROOT_FOLDER, 'movies', 'thumbnails'),
}

uploadDir["books"] = {
    type: 'books',
    folder: path.join(ROOT_FOLDER, 'books'),
    thumbnail: path.join(ROOT_FOLDER, 'books', 'thumbnails'),
}

uploadDir["music"] = {
    type: 'music',
    folder: path.join(ROOT_FOLDER, 'music'),
    thumbnail: path.join(ROOT_FOLDER, 'music', 'thumbnails'),
}

// ::: END OF DIRECTORIES :::

function UploadFile(req, res, next, fileType) {

    // Getting the upload folder for specific uplaod type;

    if (!fileType) {
        console.error("FileType error");
        return;
    }

    const storage = StorageParameter(req, fileType);

    if (storage) {
        let upload = multer({ storage });
        upload.single(FIELD_NAME);

    }
    else {
        console.error("Multer config Error:");
    }
    next();
}

// :: FUNCTION TO SET UPLOAD PARAMETER ACCORDING TO PARAM ::  
function StorageParameter(req, typeObject) {

    const filePath = typeObject.folder;

    if (filePath) {
        return multer.diskStorage({
            destination: (req, file, cb) => {

                // Ensure the folder exists, or create it
                if (!fs.existsSync(uploadFolder)) {
                    fs.mkdirSync(uploadFolder, { recursive: true });
                }

                cb(null, filePath);
            }
        });

    } else {
        console.error("Upload file path error");
    }

}

module.exports = {
    uploadDir,
    UploadFile
}