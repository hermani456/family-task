import { Request, Response } from "express";
import { db } from "../db";
import { reward, member, transaction } from "@family-task/shared";
import { eq, and, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export const getRewards = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;

    try {
        const userMember = await db.query.member.findFirst({
            where: eq(member.userId, userId),
        });
        if (!userMember) return res.status(403).json({ error: "No tienes familia" });

        const rewards = await db
            .select()
            .from(reward)
            .where(eq(reward.familyId, userMember.familyId))
            .orderBy(reward.cost);

        res.json(rewards);
    } catch (error) {
        res.status(500).json({ error: "Error fetching rewards" });
    }
};

export const createReward = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const { title, cost, description } = req.body;

    try {
        const userMember = await db.query.member.findFirst({
            where: eq(member.userId, userId),
        });

        if (!userMember || userMember.role !== "PARENT") {
            return res.status(403).json({ error: "Solo los padres pueden crear premios" });
        }

        const newReward = await db.insert(reward).values({
            id: randomUUID(),
            familyId: userMember.familyId,
            title,
            cost: Number(cost),
            description: description || "",
        }).returning();

        res.json(newReward[0]);
    } catch (error) {
        res.status(500).json({ error: "Error creating reward" });
    }
};

export const redeemReward = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const { rewardId } = req.params;

    try {
        await db.transaction(async (tx) => {
            const userMember = await tx.query.member.findFirst({
                where: eq(member.userId, userId),
            });

            if (!userMember) throw new Error("Miembro no encontrado");

            const targetReward = await tx.query.reward.findFirst({
                where: eq(reward.id, rewardId),
            });

            if (!targetReward) throw new Error("Premio no encontrado");

            if (userMember.balance < targetReward.cost) {
                throw new Error(`Te faltan ${targetReward.cost - userMember.balance} puntos`);
            }

            await db.transaction(async (tx) => {
                // ... (verificaciones de saldo igual que antes) ...

                // 4. EJECUTAR EL COBRO
                await tx.update(member)
                    .set({ balance: sql`${member.balance} - ${targetReward.cost}` })
                    .where(eq(member.id, userMember.id));

                // 5. REGISTRAR EN HISTORIAL (NUEVO)
                await tx.insert(transaction).values({
                    id: randomUUID(),
                    familyId: userMember.familyId,
                    userId: userId,
                    amount: -targetReward.cost, // Negativo porque es gasto
                    type: "SPENT",
                    description: `Canjeado: ${targetReward.title}`,
                });
            });
        });

        res.json({ success: true, message: "¡Premio canjeado!" });

    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || "Error redeeming reward" });
    }
};