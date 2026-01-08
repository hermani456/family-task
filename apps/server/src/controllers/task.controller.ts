import { Request, Response } from "express";
import { db } from "../db";
import { task, member, user } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export const getFamilyTasks = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;

    try {
        const userMember = await db.query.member.findFirst({
            where: eq(member.userId, userId),
            columns: { familyId: true }
        });

        if (!userMember) return res.status(403).json({ error: "No tienes familia asignada" });

        const tasks = await db
            .select({
                id: task.id,
                title: task.title,
                status: task.status,
                points: task.points,
                assignedToName: user.name,
            })
            .from(task)
            .leftJoin(user, eq(task.assignedToId, user.id))
            .where(eq(task.familyId, userMember.familyId))
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