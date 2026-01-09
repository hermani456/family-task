import "dotenv/config";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";
import cors from 'cors';
import { requireAuth } from "./middleware/auth.middleware";
import { createFamily, joinFamily, getFamilyMembers } from "./controllers/family.controller";
import { getMyFamily } from "./controllers/user.controller";
import { getFamilyTasks, createTask, updateTaskStatus } from "./controllers/task.controller";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// app.all("/api/auth/*", toNodeHandler(auth)); // For ExpressJS v4
app.all("/api/auth/*splat", toNodeHandler(auth));

// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());

app.post("/api/families", requireAuth, createFamily);
app.get("/api/user/family", requireAuth, getMyFamily);
app.get("/api/tasks", requireAuth, getFamilyTasks);
app.post("/api/tasks", requireAuth, createTask);
app.post("/api/families/join", requireAuth, joinFamily);
app.patch("/api/tasks/:taskId/status", requireAuth, updateTaskStatus);
app.get("/api/families/members", requireAuth, getFamilyMembers);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});