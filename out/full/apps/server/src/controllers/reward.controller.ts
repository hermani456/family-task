import { Request, Response } from "express";
import { db } from "../db/index.js";
import { reward, member, transaction } from "../db/shared/index.js";
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
    const { title, cost, description, image } = req.body;

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
            image: image || "🎁",
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

                await tx.update(member)
                    .set({ balance: sql`${member.balance} - ${targetReward.cost}` })
                    .where(eq(member.id, userMember.id));

                await tx.insert(transaction).values({
                    id: randomUUID(),
                    familyId: userMember.familyId,
                    userId: userId,
                    amount: -targetReward.cost,
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

export const deleteReward = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const { rewardId } = req.params;

    try {
        const userMember = await db.query.member.findFirst({
            where: eq(member.userId, userId),
        });

        if (!userMember || userMember.role !== "PARENT") {
            return res.status(403).json({ error: "Solo los padres pueden eliminar premios" });
        }

        const deletedReward = await db.delete(reward)
            .where(and(
                eq(reward.id, rewardId),
                eq(reward.familyId, userMember.familyId)
            ))
            .returning();

        if (deletedReward.length === 0) {
            return res.status(404).json({ error: "Premio no encontrado" });
        }

        res.json({ success: true, message: "Premio eliminado" });

    } catch (error) {
        console.error("Error deleting reward:", error);
        res.status(500).json({ error: "Error deleting reward" });
    }
};