import express from "express";

import { NextFunction, Request, Response } from 'express';
import UploadFile from '../middleware/upload.middleware';

const uploadRouter = express.Router();

uploadRouter.post("/", Upload, function (req, res) {

    if (!req.file)
        res.status(500).json("Error upload failed on server")

    else res.send("GOT THE FILE :)")
});

// :::  EXTRA FUNCITION BELOW THIS :::
function Upload(req: Request, res: Response, next: NextFunction) {
    UploadFile(req, res, next);
    next();
}


export default uploadRouter;