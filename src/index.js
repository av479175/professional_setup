import 'dotenv/config';
// This automatically runs .config() immediately
import mongoose from "mongoose";
import { app } from './app.js';

import { DB_NAME } from "./constants.js";
import connectDB from "../src/db/index.js";

//connectDB returns a promise
connectDB().then(() => {
    app.on("error", (error) => {
        console.log("ERROR , not database");
        throw error
    });

    app.listen(process.env.PORT, () => {
        console.log(`Server is running at : ${process.env.PORT}`);
    });
}).catch((err) => {
    console.log("MONGO CONNECTION failed!!", err);
})