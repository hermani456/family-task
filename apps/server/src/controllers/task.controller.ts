import { Request, Response } from "express";
import { db } from "../db";
import { task, member, user, transaction } from "@family-task/shared"
import { eq, and, desc, sql, or, isNull } from "drizzle-orm";
import { randomUUID } from "crypto";

export const getFamilyTasks = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;

    try {
        // 1. Datos del usuario actual
        const userMember = await db.query.member.findFirst({
            where: eq(member.userId, userId),
        });

        if (!userMember) return res.status(403).json({ error: "No tienes familia asignada" });

        // 2. Construir filtros según el ROL
        // Filtro base: Tareas de mi familia
        const filters = [eq(task.familyId, userMember.familyId)];

        // Si soy HIJO, agrego restricción de privacidad:
        // "Solo muéstrame las mías O las que están libres"
        if (userMember.role === "CHILD") {
            filters.push(
                or(
                    eq(task.assignedToId, userId), // Asignadas a mí
                    isNull(task.assignedToId)      // Libres para cualquiera
                ) as any
            );
        }

        const tasks = await db
            .select({
                id: task.id,
                title: task.title,
                status: task.status,
                points: task.points,
                assignedToId: task.assignedToId, // Necesitamos el ID para saber si es mía
                assignedToName: user.name,
            })
            .from(task)
            .leftJoin(user, eq(task.assignedToId, user.id))
            .where(and(...filters)) // Aplicamos los filtros combinados
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

        // --- LÓGICA HIJO ---
        if (requestor.role === "CHILD") {
            // 1. Validar transición
            if (!["IN_PROGRESS", "REVIEW"].includes(status)) {
                return res.status(403).json({ error: "Acción no permitida" });
            }

            // 2. SEGURIDAD: ¿La tarea es de otro?
            if (currentTask.assignedToId && currentTask.assignedToId !== userId) {
                return res.status(403).json({ error: "Esta tarea pertenece a otro hermano" });
            }

            // 3. ACCIÓN: Empezar Tarea (PENDING -> IN_PROGRESS)
            if (status === "IN_PROGRESS") {
                // CORRECCIÓN: Quitamos el chequeo de "!currentTask.assignedToId".
                // Si es mía O es libre, me la asigno (o re-confirmo) y cambio estado.
                await db.update(task)
                    .set({
                        status: "IN_PROGRESS",
                        assignedToId: userId // Aseguramos propiedad
                    })
                    .where(eq(task.id, taskId));

                return res.json({ success: true, status: "IN_PROGRESS", assignedTo: userId });
            }
        }

        // --- LÓGICA PADRE ---
        if (requestor.role === "PARENT") {
            if (status === "DONE" && currentTask.status !== "DONE") {

                await db.transaction(async (tx) => {
                    // 1. Actualizar Tarea
                    await tx.update(task).set({ status: "DONE" }).where(eq(task.id, taskId));

                    // 2. Pagar y Registrar (Solo si tiene dueño)
                    if (currentTask.assignedToId) {
                        // A. Sumar puntos
                        await tx.update(member)
                            .set({ balance: sql`${member.balance} + ${currentTask.points}` })
                            .where(and(eq(member.userId, currentTask.assignedToId), eq(member.familyId, currentTask.familyId)));

                        // B. CREAR REGISTRO EN EL HISTORIAL (NUEVO)
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

        // Fallback genérico
        await db.update(task).set({ status }).where(eq(task.id, taskId));
        res.json({ success: true, status });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating task" });
    }
};