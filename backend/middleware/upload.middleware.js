const multer = require('multer');
const path = require('path');
const fs = require('fs');

// :: Folder path where you want to create uploads folders: 
// :: PROJECT ROOT DIR
const { ROOT_FOLDER } = require('../config/config.js');

const UPLOAD_DIR = require('../config/config.js');

const allowedVideoMimeTypes = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/mpeg",
  "video/x-msvideo",
  "video/x-ms-wmv",
  "video/x-flv",
  "video/3gpp",
  "video/3gpp2",
  "video/x-matroska"
];


const allowedAudioMimeTypes = [
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
  "audio/aac",
  "audio/mp4",
  "audio/flac",
  "audio/midi",
  "audio/x-midi",
  "audio/amr",
  "audio/3gpp",
  "audio/3gpp2"
];

const allowedDocumentMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/rtf",
  "text/plain",
  "text/csv",
  "text/html",
  "text/markdown",
  "application/json",
  "application/xml",
  "text/xml"
];


function UploadFile(req, res, next) {

    // Getting the upload folder for specific uplaod type;
    // apply file filters

    // upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])

    try {
        // const storage = StorageParameter(req, fileType);
        
        let uploadType = null;

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {

                const fileMimeType = file.mimetype;

                // TODO: add the feature, so user can change the download directory.
                // then: find if user provided custom dir to save,
                // ifNot: user default 
                if(allowedVideoMimeTypes.includes(fileMimeType)){ // VIDEO 
                    uploadType = UPLOAD_DIR["movies"]
                }

                if(allowedAudioMimeTypes.includes(fileMimeType)) {// AUDIO
                    uploadType = UPLOAD_DIR["music"]
                }

                if(allowedDocumentMimeTypes.includes(fileMimeType)) { // DOCS
                    uploadType = UPLOAD_DIR["books"]
                }       

                // Ensure the folder exists, or create it
                if (!fs.existsSync(uploadType.folder)) {
                    fs.mkdirSync(uploadType.folder, { recursive: true });
                }
                cb(null, uploadType.folder);
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname);
            }
        })

        if (storage) {
            const upload = multer({ storage: storage });
            upload.single(FIELD_NAME)(req, res, err => {
                if (err) {
                    console.error(`Error: ${err.message}`);
                }
                console.error(`Video uploaded successfully: ${req.file.filename}`);
            });

        }
        else {
            console.error("Multer config Error:");
        }
    } catch (error) {
        console.error("Error at uploading: " + error.message);
    }

    next();
}

// :: FUNCTION TO SET UPLOAD PARAMETER ACCORDING TO PARAM ::  
function StorageParameter(req, typeObject) {


    const storageConfig = multer.diskStorage(
        {
            destination: function (req, file, cb) {

                file.mimetype

                // Ensure the folder exists, or create it
                //if (!fs.existsSync(uploadFolder)) {
                    fs.mkdirSync(uploadFolder, { recursive: true });
                //}

                cb(null, uploadFolder);
            },
            filename: function (req, file, cb) {
                // Change to have standard format for filename; only for testing
                const videoFileName = file.originalname;

                cb(null, videoFileName);
            }
        });

    if (storageConfig) {
        return storageConfig;

    } else {
        console.error("Upload file path error");
        return null;
    }

}

module.exports = {
    UploadFile
}