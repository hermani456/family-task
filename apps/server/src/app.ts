import "dotenv/config";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth.js";
import cors from 'cors';
import helmet from "helmet";
import apiRouter from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
    origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL, "http://localhost:5173"] : ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api", apiRouter);
app.use(errorHandler);

export default app;