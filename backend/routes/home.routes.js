const express = require("express");

const home = express.Router();
const movieRouter = require('./movies.routes.js');
const musicRouter = require("./music.routes.js");
const bookRouter = require("./books.routes.js");
// ::: IP:PORT/api/home ::: 
home.get("/home", (req, res) => {
    res.status(200).json({
        success: true,
        data: "ALL SET :)"
    });
});

// ::: IP:PORT/api/movies ::: 
home.use('/movies', movieRouter);

// ::: IP:PORT/api/music ::: 
home.use('/music', musicRouter);

// ::: IP:PORT/api/books ::: 
home.use('./books', bookRouter);


// ::: IP:PORT/api/ ::: 
home.get('/', async (req, res) => {
    res.status(200).json({
        success: true,
        data: "ALL SET :)"
    });
});

module.exports = home;