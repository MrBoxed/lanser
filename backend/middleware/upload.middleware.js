const multer = require('multer');
const path = require('path');
const fs = require('fs');

const FIELD_NAME = "videoFile"; // form fieldname : should be same as frontend


// :: Folder path where you want to create uploads folders: 
// :: PROJECT ROOT DIR
const { ROOT_FOLDER } = require('../config/config.js');

function UploadFile(req, res, next, fileType) {

    // Getting the upload folder for specific uplaod type;
    // apply file filters

    // upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])

    if (!fileType) {
        console.error("FileType error");
        return;
    }

    try {
        const storage = StorageParameter(req, fileType);
        // const storage = multer.diskStorage({
        //     destination: function (req, file, cb) {

        //         // Ensure the folder exists, or create it
        //         if (!fs.existsSync(fileType.folder)) {
        //             fs.mkdirSync(fileType.folder, { recursive: true });
        //         }
        //         cb(null, fileType.folder);
        //     },
        //     filename: function (req, file, cb) {
        //         cb(null, file.originalname);
        //     }
        // })

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

    const uploadFolder = typeObject.folder;
    console.log(uploadFolder);

    const storageConfig = multer.diskStorage(
        {
            destination: function (req, file, cb) {

                // Ensure the folder exists, or create it
                if (!fs.existsSync(uploadFolder)) {
                    fs.mkdirSync(uploadFolder, { recursive: true });
                }

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