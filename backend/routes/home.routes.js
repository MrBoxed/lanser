const express = require("express");

const home = express.Router();
const movieRouter = require('./movies.routes.js');

home.get("/home", (req, res) => {
    res.status(200).json({
        success: true,
        data: "ALL SET :)"
    });
});

home.use('/movies', movieRouter);

home.get('/', async (req, res) => {
    res.status(200).json({
        success: true,
        data: "ALL SET :)"
    });
});

module.exports = home;