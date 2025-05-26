const express = require('express');
const DB = require('./database/db.js');
const homeRoute = require('./routes/home.routes.js');
const { SERVER_PORT, ROOT_FOLDER } = require('./config/config.js');

const app = express();
const PORT = SERVER_PORT;

process.title = "lanser";

// ### ONLY FOR TESTING ###
app.set('view engine', 'ejs');
app.set('views', './views');
app.get('/movies/upload', (req, res) => {
    res.render('movieUpload');
})

// ### NO TESTING CODE BELOW THIS ###

// ::: ip:port/api ::: 
app.use('/api', homeRoute);

// ::: CONNECTING DATATBASE :::
const database = DB.ConnectDB();
database.then((db) => {
    console.log("Database connected!");
});

app.listen(PORT, () => {
    console.log(`server online on: ${PORT} port`);
});
