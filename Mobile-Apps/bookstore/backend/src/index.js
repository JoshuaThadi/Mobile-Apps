//const express = require("express");
import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import { connectDB } from "./lib/db.js";
import job from "./lib/cron.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

job.start();
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);


app.listen(PORT , () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});

