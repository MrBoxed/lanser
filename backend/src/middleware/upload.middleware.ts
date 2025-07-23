import multer from "multer";
import fs from "fs";
import path from "path";
import { NextFunction, Request, Response } from "express";
import { UploadDirType } from "../types/types";
import { UPLOAD_DIR } from "../config/server.config";

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
  "video/x-matroska",
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
  "audio/3gpp2",
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
  "text/xml",
];

export const MAIN_FILE = "file";
export const THUMBNAIL_FILE = "thumbnail";

let MasterType: UploadDirType;

export default function UploadFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

        if (allowedVideoMimeTypes.includes(fileMimeType)) {
          // VIDEO
          uploadType = UPLOAD_DIR.get("movies");
          if (uploadType) MasterType = uploadType;
        }

        if (allowedAudioMimeTypes.includes(fileMimeType)) {
          // AUDIO
          uploadType = UPLOAD_DIR.get("music");
          if (uploadType) MasterType = uploadType;
        }

        if (allowedDocumentMimeTypes.includes(fileMimeType)) {
          // DOCS
          uploadType = UPLOAD_DIR.get("books");
          if (uploadType) MasterType = uploadType;
        }

        // For thumbnail only temperary JUGAAD
        if (fileMimeType.startsWith("image/")) {
          // Ensure the folder exists, or create it
          if (!fs.existsSync(MasterType?.thumbnail)) {
            fs.mkdirSync(MasterType.thumbnail, { recursive: true });
          }
          return cb(null, MasterType.thumbnail);
        }

        if (!uploadType) {
          throw new Error("Uplaod Directory import error:" + file.mimetype);
        }

        // Ensure the folder exists, or create it
        if (!fs.existsSync(uploadType?.folder)) {
          fs.mkdirSync(uploadType?.folder, { recursive: true });
        }
        cb(null, uploadType.folder);
      },

      //   FILENAME :::
      filename: function (req, file, cb) {
        const userProvidedName: string | undefined = req.body?.data?.name;

        // Use original filename if no name provided
        if (!userProvidedName) {
          return cb(null, file.originalname);
        }

        // Get file extension (fallback to original if needed)
        const ext =
          path.extname(userProvidedName) || path.extname(file.originalname);

        // Sanitize base name: no spaces, only alphanumeric, dash, underscore
        const baseName = path
          .basename(userProvidedName, ext)
          .replace(/\s+/g, "-") // Replace spaces with dashes
          .replace(/[^a-zA-Z0-9-_]/g, ""); // Remove unsafe characters

        const timestamp = Date.now(); // Ensure uniqueness
        const uniqueName = `${baseName}-${timestamp}${ext}`;

        cb(null, uniqueName);
      },
    });

    if (storage) {
      const upload = multer({ storage: storage });

      upload.fields([
        { name: MAIN_FILE, maxCount: 1 },
        { name: THUMBNAIL_FILE, maxCount: 1 },
      ])(req, res, (err) => {
        if (err) {
          console.error("Multer error:", err.message);
          return res
            .status(500)
            .json({ error: "File upload failed", details: err.message });
        }

        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };

        // ✅ Manually assign to req.file and req.thumbnail
        req.file = files["file"]?.[0];
        (req as any).thumbnail = files["thumbnail"]?.[0];

        console.log("Video uploaded successfully:" + req.thumbnail?.filename);
        next();
      });
    } else {
      console.error("Multer config Error:");
    }
  } catch (err: any) {
    console.error("Error at uploading: " + err.message);
    return;
  }
}

// :: FUNCTION TO SET UPLOAD PARAMETER ACCORDING TO FILE TYPE ::
function StorageParameter(
  req: Request,
  res: Response
): multer.StorageEngine | null {
  const storageConfig = multer.diskStorage({
    destination: function (req, file, cb) {
      const fileMimeType = file.mimetype;
      // console.log(typeof (fileMimeType));

      let uploadType = null;

      if (allowedVideoMimeTypes.includes(fileMimeType)) {
        // VIDEO
        uploadType = UPLOAD_DIR.get("movies");
      }

      if (allowedAudioMimeTypes.includes(fileMimeType)) {
        // AUDIO
        uploadType = UPLOAD_DIR.get("music");
      }

      if (allowedDocumentMimeTypes.includes(fileMimeType)) {
        // DOCS
        uploadType = UPLOAD_DIR.get("books");
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
    },
  });

  if (storageConfig) {
    return storageConfig;
  } else {
    console.error("Upload file path error");
    return null;
  }
}
