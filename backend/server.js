const express = require('express');
const DB = require('./database/db.js');
const homeRoute = require('./routes/home.route.js');
const { SERVER_PORT } = require('./config/config.js');

const app = express();
const PORT = SERVER_PORT;

app.use('/api', homeRoute);

// ::: CONNECTING DATATBASE :::
const database = DB.ConnectDB();
database.then((db) => {
    console.log("Database connected!");
});

app.listen(PORT, () => {
    console.log(`server online on: ${PORT} port`);
});
