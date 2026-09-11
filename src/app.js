import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Create the Express application.
const app = express();

// Allow requests from the frontend origin stored in the environment variables.
// credentials: true allows cookies and authentication data to be sent.
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// Parse JSON request bodies and limit their size to 16 kilobytes.
app.use(express.json({ limit: "16kb" }));

// Parse data submitted through HTML forms.
app.use(express.urlencoded({extended : true ,limit : "16kb"}));

// Serve files such as images, CSS, and JavaScript from the public folder.
app.use(express.static("public"));

// Parse cookies so they can be accessed through req.cookies.
app.use(cookieParser());

// Export the configured app so index.js can start the server.
export { app }; 
