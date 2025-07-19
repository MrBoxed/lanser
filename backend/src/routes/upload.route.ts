import express from "express";

import { NextFunction, Request, Response } from "express";
import UploadFile from "../middleware/upload.middleware";
import { InsertFileIntoTable } from "../db/db";
import { UserFormData } from "../config/types";

const uploadRouter = express.Router();

uploadRouter.post("/", UploadFile, function (req, res) {
  // InsertIntoTable(req.file!, {});

  const { data } = req.body;
  const userFormData: UserFormData = JSON.parse(data);

  if (!req.file) {
    return res.status(500).json("Error upload failed on server");
  }

  if (req.file?.size != userFormData.filesize) {
    console.log("Not fully uploaded !!");
    return res.json({ message: "Upload Cancel midway." });
  } else {
    if (req.file) InsertFileIntoTable(req.file, userFormData);

    res.status(201).json("File uploaded successfully");
  }
});

export default uploadRouter;
