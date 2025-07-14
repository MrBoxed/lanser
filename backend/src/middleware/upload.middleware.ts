import multer from 'multer'
import fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import { UploadDirType } from '../config/types';
import { UPLOAD_DIR } from '../config/server.config';

// :: Folder path where you want to create uploads folders: 
// :: PROJECT ROOT DIR

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

const FIELD_NAME = "file"

export default function UploadFile(req: Request, res: Response, next: NextFunction) {

    // TODO: add the feature, so user can change the download directory.
    // then: find if user provided custom dir to save,
    // if Not: use default 

    try {

        // console.log(UPLOAD_DIR.get('movies'));

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {

                let uploadType = null;
                const fileMimeType = file.mimetype;
                // console.log(typeof (fileMimeType));

                if (allowedVideoMimeTypes.includes(fileMimeType)) { // VIDEO 
                    uploadType = UPLOAD_DIR.get("movies");
                }

                if (allowedAudioMimeTypes.includes(fileMimeType)) {// AUDIO
                    uploadType = UPLOAD_DIR.get("music");
                }

                if (allowedDocumentMimeTypes.includes(fileMimeType)) { // DOCS
                    uploadType = UPLOAD_DIR.get("books")
                }

                if (!uploadType) {
                    throw new Error("Uplaod Directory import error:");
                }

                // Ensure the folder exists, or create it
                if (!fs.existsSync(uploadType?.folder)) {
                    fs.mkdirSync(uploadType?.folder, { recursive: true });
                }
                cb(null, uploadType.folder);
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname);
            }
        });

        if (storage) {
            const upload = multer({ storage: storage });
            upload.single(FIELD_NAME)(req, res, err => {
                if (err) {
                    console.error(`Error: ${err.message}`);
                }

                console.error(`Video uploaded successfully: ${req.file?.filename}`);
            });

        }
        else {
            console.error("Multer config Error:");
        }
    } catch (err: any) {
        console.error("Error at uploading: " + err.message);
    }

    next();
}

// :: FUNCTION TO SET UPLOAD PARAMETER ACCORDING TO FILE TYPE ::  
function StorageParameter(req: Request, res: Response): multer.StorageEngine | null {

    const storageConfig = multer.diskStorage({

        destination: function (req, file, cb) {

            const fileMimeType = file.mimetype;
            // console.log(typeof (fileMimeType));

            let uploadType = null;

            if (allowedVideoMimeTypes.includes(fileMimeType)) { // VIDEO 
                uploadType = UPLOAD_DIR.get("movies");
            }

            if (allowedAudioMimeTypes.includes(fileMimeType)) {// AUDIO
                uploadType = UPLOAD_DIR.get("music");
            }

            if (allowedDocumentMimeTypes.includes(fileMimeType)) { // DOCS
                uploadType = UPLOAD_DIR.get("books")
            }

            if (!uploadType) {
                throw new Error("Uplaod Directory import error:");
            }

            // Ensure the folder exists, or create it
            if (!fs.existsSync(uploadType?.folder)) {
                fs.mkdirSync(uploadType?.folder, { recursive: true });
            }
            cb(null, uploadType.folder);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    })

    if (storageConfig) {
        return storageConfig;

    } else {
        console.error("Upload file path error");
        return null;
    }

}