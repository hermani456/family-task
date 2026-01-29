import { Request, Response } from "express";
import * as TaskService from "../services/task.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getFamilyTasks = asyncHandler(async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const tasks = await TaskService.getFamilyTasks(userId);
    res.json(tasks);
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const taskId = await TaskService.createTask(userId, req.body);
    res.json({ success: true, taskId });
});

export const updateTaskStatus = asyncHandler(async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const { taskId } = req.params;
    const { status } = req.body;

    const result = await TaskService.updateTaskStatus(userId, taskId, status);
    res.json({ success: true, ...result });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const { taskId } = req.params;

    await TaskService.deleteTask(userId, taskId);
    res.json({ success: true, message: "Tarea eliminada correctamente" });
});