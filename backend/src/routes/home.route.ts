import express from "express";
import videoRouter from "./videos.route";
import movieRouter from "./movie.route";
import audioRouter from "./music.route";
import docRouter from "./docs.route";
import uploadRouter from "./upload.route";
import authRouter from "./auth.route";

const apiRoute = express.Router();


// ::: IP:PORT/api/home ::: 
apiRoute.get("/home", (req, res) => {
    res.status(200).json({
        success: true,
        data: "ALL SET :)"
    });
});

// ::: IP:PORT/api/auth ::: 
apiRoute.use('/auth', authRouter);

// ::: IP:PORT/api/movies ::: 
apiRoute.use('/movies', movieRouter);

// ::: IP:PORT/api/music ::: 
apiRoute.use('/music', audioRouter);

// ::: IP:PORT/api/books ::: 
apiRoute.use('./books', docRouter);

// :: IP:PORT/api/upload :::
apiRoute.use('/upload', uploadRouter);


export default apiRoute;
