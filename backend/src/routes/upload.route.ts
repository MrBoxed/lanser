import express from "express";

import { NextFunction, Request, Response } from 'express';
import UploadFile from '../middleware/upload.middleware';
import { InsertIntoTable } from "../db/db";

const uploadRouter = express.Router();

uploadRouter.post("/", Upload, function (req, res) {

    if (!req.file)
        res.status(500).json("Error upload failed on server");

    // InsertIntoTable(req.file!, {});

    console.log(req.body);
    res.status(201).json("File uploaded successfully");

});

// :::  EXTRA FUNCITION BELOW THIS :::
function Upload(req: Request, res: Response, next: NextFunction) {
    UploadFile(req, res, next);
}


export default uploadRouter;