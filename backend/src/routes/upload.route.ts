import express from "express";

import { NextFunction, Request, Response } from "express";
import UploadFile from "../middleware/upload.middleware";
import { InsertIntoTable } from "../db/db";
import { UserFormData } from "../config/types";

const uploadRouter = express.Router();

uploadRouter.post("/", UploadFile, function (req, res) {
  // InsertIntoTable(req.file!, {});
  
  const { data } = req.body;
  const userFormData:UserFormData = JSON.parse(data);

  if (!req.file) 
        return res.status(500).json("Error upload failed on server");
  
  console.log(req.body);
  console.log(userFormData);
  
  console.log("MULTER FILE SIZE: "+req.file.size);
  console.log("FORM FILE SIZE: "+userFormData.filesize);

  res.status(201).json("File uploaded successfully");
  
});


export default uploadRouter;
