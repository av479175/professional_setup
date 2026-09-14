import 'dotenv/config';
// This automatically runs .config() immediately
import connectDB from "../src/db/index.js";
import { app } from './app.js';



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