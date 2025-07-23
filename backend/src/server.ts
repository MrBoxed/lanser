import express from "express";
import cors from "cors";
import { SERVER_PORT, ROOT_FOLDER } from "./config/server.config";
import { drizzle } from "drizzle-orm/singlestore/driver";
import apiRoutes from "./routes/home.route";

// ::: ROUTES :::

const app = express();

// ### ONLY FOR TESTING ###
// app.set('view engine', 'ejs');
// app.set('views', `${ROOT_FOLDER}/views`);
// app.get('/movies/upload', (req, res) => {
//     res.render('movieUpload');
// })

// ### NO TESTING CODE BELOW THIS ###

// Enable CORS for all routes & origins
app.use(cors());

app.use(express.json());

// ::: IP:PORT/api/ :::
app.use("/api", apiRoutes);

// ::: CONNECTING DATATBASE :::
// const db = drizzle();

app.listen(SERVER_PORT, () => {
  console.log(`server working on: ${SERVER_PORT} port`);
});
