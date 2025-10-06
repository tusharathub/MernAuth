import express from 'express';
import dotenv from 'dotenv';
import {ConnectDB} from './db/connectDB.js';

import authRoutes from './routes/auth.route.js';

dotenv.config({ path: '.env.local' });
const app = express();

app.get("/", (req, res) => {
    res.send("Hello World my guy");
})

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    ConnectDB();
})