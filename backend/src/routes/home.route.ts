import express from "express";
import videoRouter from "./videos.route";
import movieRouter from "./movie.route";
import audioRouter from "./music.route";
import docRouter from "./docs.route";
import uploadRouter from "./upload.route";

const homeRoute = express.Router();

// ::: IP:PORT/api/home ::: 
homeRoute.get("/home", (req, res) => {
    res.status(200).json({
        success: true,
        data: "ALL SET :)"
    });
});

// ::: IP:PORT/api/movies ::: 
homeRoute.use('/movies', movieRouter);

// ::: IP:PORT/api/music ::: 
homeRoute.use('/music', audioRouter);

// ::: IP:PORT/api/books ::: 
homeRoute.use('./books', docRouter);

// :: IP:PORT/api/upload :::
homeRoute.use('/upload', uploadRouter);


export default homeRoute;
