import express from "express";
import 'dotenv/config';
import routes from "./routes";
import cors from "cors";
import morgan from "morgan";

//Creating express app
const app = express();
//Using express json parser to handle request body handling
app.use(express.json());
//app.use(express.);
app.use(cors({
    origin: '*'
}));
app.use(morgan('combined'));
// app.use(deserializeUser);

//Launching express server on specified port
app.listen(3100, () => {
    //Printing context data in logs
    console.log("Up !")
    //Define app routes
    routes(app);
});