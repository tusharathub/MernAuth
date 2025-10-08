import express from 'express';
import dotenv from 'dotenv';
import {ConnectDB} from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootPath = path.resolve(__dirname, "", "");

dotenv.config({ path: path.join(rootPath, ".env")});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

const projectedRoute = path.resolve(__dirname, "", "", "");

app.use(cors({origin: "http://localhost:5173", credentials: true}));

app.use("/api/auth", authRoutes);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(projectedRoute, "/frontend/dist")));

    app.get(/.*/, (req, res) => {
        res.sendFile(path.resolve(projectedRoute, "frontend", "dist", "index.html"));
    })
}

app.listen(PORT, () => {
    console.log('Server is running on port :', PORT);
    ConnectDB();
})