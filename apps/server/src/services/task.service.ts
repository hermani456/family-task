import { db } from "../db/index.js";
import { task, member, user, transaction } from "../db/shared/index.js"
import { eq, and, desc, sql, or, isNull } from "drizzle-orm";
import { randomUUID } from "crypto";
import { createError } from "../utils/error.utils.js";

export const getFamilyTasks = async (userId: string) => {
    const userMember = await db.query.member.findFirst({
        where: eq(member.userId, userId),
    });

    if (!userMember) throw createError("No tienes familia asignada", 403);

    const filters = [eq(task.familyId, userMember.familyId)];

    if (userMember.role === "CHILD") {
        filters.push(
            or(
                eq(task.assignedToId, userId),
                isNull(task.assignedToId)
            ) as any
        );
    }

    return await db
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
};

export const createTask = async (userId: string, data: { title: string; points: number; assignedToId?: string }) => {
    const userMember = await db.query.member.findFirst({
        where: eq(member.userId, userId),
    });

    if (!userMember) throw createError("No tienes familia", 403);

    const taskId = randomUUID();
    await db.insert(task).values({
        id: taskId,
        familyId: userMember.familyId,
        authorId: userId,
        assignedToId: data.assignedToId || null,
        title: data.title,
        points: data.points,
        status: "PENDING",
    });

    return taskId;
};

export const updateTaskStatus = async (userId: string, taskId: string, status: "PENDING" | "IN_PROGRESS" | "REVIEW" | "DONE") => {
    const requestor = await db.query.member.findFirst({
        where: eq(member.userId, userId),
    });

    if (!requestor) throw createError("No eres miembro", 403);

    const currentTask = await db.query.task.findFirst({
        where: and(eq(task.id, taskId), eq(task.familyId, requestor.familyId)),
    });

    if (!currentTask) throw createError("Tarea no encontrada", 404);

    if (requestor.role === "CHILD") {
        if (!["IN_PROGRESS", "REVIEW"].includes(status)) {
            throw createError("Acción no permitida", 403);
        }

        if (currentTask.assignedToId && currentTask.assignedToId !== userId) {
            throw createError("Esta tarea pertenece a otro hermano", 403);
        }

        await db.update(task)
            .set({
                status: status,
                assignedToId: userId
            })
            .where(eq(task.id, taskId));

        return { status, assignedTo: userId };
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
            return { status: "DONE" };
        }
    }

    await db.update(task).set({ status }).where(eq(task.id, taskId));
    return { status };
};

export const deleteTask = async (userId: string, taskId: string) => {
    const requestor = await db.query.member.findFirst({
        where: eq(member.userId, userId),
    });

    if (!requestor) throw createError("No eres miembro de una familia", 403);

    if (requestor.role !== "PARENT") {
        throw createError("Solo los padres pueden eliminar tareas", 403);
    }

    const taskToDelete = await db.query.task.findFirst({
        where: and(
            eq(task.id, taskId),
            eq(task.familyId, requestor.familyId)
        ),
    });

    if (!taskToDelete) {
        throw createError("Tarea no encontrada o no tienes permisos", 404);
    }

    await db.delete(task).where(eq(task.id, taskId));
};

