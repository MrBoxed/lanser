const express = require("express");

const home = express.Router();

home.get("/home", (req, res) => {
    res.status(200).json({
        success: true,
        data: "ALL SET :)"
    });
});

home.get('/', async (req, res) => {
    res.status(200).json({
        success: true,
        data: "ALL SET :)"
    });
});

module.exports = home;