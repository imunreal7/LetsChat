import express from "express";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();
const __dirname = path.resolve();

app.use(cookieParser());

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
    });
}

server.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT);
    connectDB();
});
