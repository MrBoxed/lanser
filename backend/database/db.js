const path = require('path');
const sqlite = require('sqlite3').verbose();
const { DATABASE_NAME } = require('../config/config');
const { movieTable, bookTable, musicTable, userTable } = require('./Tables/tables');


// TODO: Add userTable to the tables array
const tables = [movieTable, musicTable, bookTable]; // Array of tables to be created
const dbName = DATABASE_NAME;

async function ConnectDB() {

    // Creating database file in the root directory
    const databaseFile = path.join(__dirname, dbName);

    const DATABASE = new sqlite.Database(databaseFile, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(`Database ${dbName} created!`);
    });

    // ::: CRETATING TABLE IF NOT EXISTS :::
    await CreateTables(DATABASE);

    return DATABASE;
}


// FUNCTION TO CREATE TABLES IN THE DATABASE
async function CreateTables(database) {
    // Running queries to create tables
    tables.forEach(async (table) => {
        await database.run(table.strQuery, (err) => {
            if (err) {
                console.log("Table already exists!");
                return;
            }
            console.log(`Table created!`);
        });
    });
}

async function InsertData(database, table, data) {

    // Inserting data into the table
    const query = `INSERT INTO ${table} VALUES ${data}`;
    await database.run(query, data, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Data inserted!");
    });

}



module.exports = {
    ConnectDB
}