import { Request, Response } from "express";
import { db } from "../db/index.js";
import { task, member, user, transaction } from "@family-task/shared"
import { eq, and, desc, sql, or, isNull } from "drizzle-orm";
import { randomUUID } from "crypto";

export const getFamilyTasks = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;

    try {
        const userMember = await db.query.member.findFirst({
            where: eq(member.userId, userId),
        });

        if (!userMember) return res.status(403).json({ error: "No tienes familia asignada" });

        const filters = [eq(task.familyId, userMember.familyId)];

        if (userMember.role === "CHILD") {
            filters.push(
                or(
                    eq(task.assignedToId, userId),
                    isNull(task.assignedToId)
                ) as any
            );
        }

        const tasks = await db
            .select({
                id: task.id,
                title: task.title,
                status: task.status,
                points: task.points,
                assignedToId: task.assignedToId,
                assignedToName: user.name,
            })
            .from(task)
            .leftJoin(user, eq(task.assignedToId, user.id))
            .where(and(...filters))
            .orderBy(desc(task.createdAt));

        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error loading tasks" });
    }
};

export const createTask = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const { title, points, assignedToId } = req.body;

    try {
        const userMember = await db.query.member.findFirst({
            where: eq(member.userId, userId),
        });

        if (!userMember) return res.status(403).json({ error: "No tienes familia" });

        const taskId = randomUUID();
        await db.insert(task).values({
            id: taskId,
            familyId: userMember.familyId,
            authorId: userId,
            assignedToId: assignedToId || null,
            title,
            points: Number(points) || 10,
            status: "PENDING",
        });

        res.json({ success: true, taskId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating task" });
    }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const { taskId } = req.params;
    const { status } = req.body;

    try {
        const requestor = await db.query.member.findFirst({
            where: eq(member.userId, userId),
        });

        if (!requestor) return res.status(403).json({ error: "No eres miembro" });

        const currentTask = await db.query.task.findFirst({
            where: and(eq(task.id, taskId), eq(task.familyId, requestor.familyId)),
        });

        if (!currentTask) return res.status(404).json({ error: "Tarea no encontrada" });

        if (requestor.role === "CHILD") {
            if (!["IN_PROGRESS", "REVIEW"].includes(status)) {
                return res.status(403).json({ error: "Acción no permitida" });
            }


            if (currentTask.assignedToId && currentTask.assignedToId !== userId) {
                return res.status(403).json({ error: "Esta tarea pertenece a otro hermano" });
            }


            if (status === "IN_PROGRESS") {
                await db.update(task)
                    .set({
                        status: "IN_PROGRESS",
                        assignedToId: userId
                    })
                    .where(eq(task.id, taskId));

                return res.json({ success: true, status: "IN_PROGRESS", assignedTo: userId });
            }
        }


        if (requestor.role === "PARENT") {
            if (status === "DONE" && currentTask.status !== "DONE") {

                await db.transaction(async (tx) => {

                    await tx.update(task).set({ status: "DONE" }).where(eq(task.id, taskId));


                    if (currentTask.assignedToId) {

                        await tx.update(member)
                            .set({ balance: sql`${member.balance} + ${currentTask.points}` })
                            .where(and(eq(member.userId, currentTask.assignedToId), eq(member.familyId, currentTask.familyId)));


                        await tx.insert(transaction).values({
                            id: randomUUID(),
                            familyId: currentTask.familyId,
                            userId: currentTask.assignedToId,
                            amount: currentTask.points,
                            type: "EARNED",
                            description: `Tarea completada: ${currentTask.title}`,
                        });
                    }
                });
                return res.json({ success: true, status: "DONE" });
            }
        }


        await db.update(task).set({ status }).where(eq(task.id, taskId));
        res.json({ success: true, status });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating task" });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const { taskId } = req.params;

    try {
        const requestor = await db.query.member.findFirst({
            where: eq(member.userId, userId),
        });

        if (!requestor) return res.status(403).json({ error: "No eres miembro de una familia" });

        if (requestor.role !== "PARENT") {
            return res.status(403).json({ error: "Solo los padres pueden eliminar tareas" });
        }

        const taskToDelete = await db.query.task.findFirst({
            where: and(
                eq(task.id, taskId),
                eq(task.familyId, requestor.familyId)
            ),
        });

        if (!taskToDelete) {
            return res.status(404).json({ error: "Tarea no encontrada o no tienes permisos" });
        }

        await db.delete(task).where(eq(task.id, taskId));

        res.json({ success: true, message: "Tarea eliminada correctamente" });

    } catch (error) {
        console.error("Error en deleteTask:", error);
        res.status(500).json({ error: "Error deleting task" });
    }
};