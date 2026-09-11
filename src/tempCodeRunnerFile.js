import 'dotenv/config'; // This automatically runs .config() immediately
import mongoose from "mongoose";

import { DB_NAME } from "./constants";
import connectDB from ".db/index.js";

dotenv.config({ path: './.env' })

connectDB()
