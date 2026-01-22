import { Router } from "express";
import { z } from "zod";
import * as TaskController from "../controllers/task.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

const createTaskSchema = z.object({
    title: z.string().min(1, "El título es requerido"),
    points: z.number().int().positive("Los puntos deben ser positivos"),
    assignedToId: z.string().optional(),
});

const updateTaskStatusSchema = z.object({
    status: z.enum(["PENDING", "IN_PROGRESS", "REVIEW", "DONE"]),
});

const taskIdSchema = z.object({
    taskId: z.string().uuid("Invalid Task ID"),
});

router.use(requireAuth);

router.get("/", TaskController.getFamilyTasks);
router.post("/", validate({ body: createTaskSchema }), TaskController.createTask);
router.patch("/:taskId/status", validate({ body: updateTaskStatusSchema, params: taskIdSchema }), TaskController.updateTaskStatus);
router.delete("/:taskId", validate({ params: taskIdSchema }), TaskController.deleteTask);

export default router;
