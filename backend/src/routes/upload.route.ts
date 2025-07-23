import express from "express";
const uploadRouter = express.Router();

import { NextFunction, Request, Response } from "express";
import UploadFile, {
  MAIN_FILE,
  THUMBNAIL_FILE,
} from "../middleware/upload.middleware";
import { InsertFileIntoTable } from "../db/db";
import { UserFormDataType } from "../types/form.types";
import { authenticateToken } from "../middleware/auth.middleware";

uploadRouter.post(
  "/",
  UploadFile,
  authenticateToken,
  async function (req, res) {
    try {
      const { data } = req.body;
      const userFormData: UserFormDataType = JSON.parse(data);

      console.log(JSON.stringify(userFormData));
      console.log(req.file?.filename);
      console.log(req.thumbnail?.filename);

      if (!req.file) {
        return res.status(500).json("Error upload failed on server");
      }

      // if (req.file?.size != userFormData.filesize) {
      //   console.log("Not fully uploaded !!");
      //   return res.json({ message: "Upload Cancel midway." });
      // }

      // Ensure user is available
      if (!req.user?.id) {
        return res
          .status(401)
          .json({ message: "Unauthorized: user not found in token" });
      }

      // Pass userId to DB insert
      await InsertFileIntoTable(
        req.file,
        req.thumbnail,
        userFormData,
        req.user.id
      );

      res.status(201).json("File uploaded successfully");
    } catch (error: any) {
      console.error("Error at uploading" + error);
      res.status(500).json("File insertion filed");
    }
  }
);

export default uploadRouter;
