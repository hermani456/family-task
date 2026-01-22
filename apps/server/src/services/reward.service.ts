import { db } from "../db/index.js";
import { reward, member, transaction } from "../db/shared/index.js";
import { eq, and, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { createError } from "../utils/error.utils.js";

export const getRewards = async (userId: string) => {
    const userMember = await db.query.member.findFirst({
        where: eq(member.userId, userId),
    });

    if (!userMember) throw createError("No tienes familia", 403);

    return await db
        .select()
        .from(reward)
        .where(eq(reward.familyId, userMember.familyId))
        .orderBy(reward.cost);
};

export const createReward = async (userId: string, data: { title: string; cost: number; description?: string; image?: string }) => {
    const userMember = await db.query.member.findFirst({
        where: eq(member.userId, userId),
    });

    if (!userMember || userMember.role !== "PARENT") {
        throw createError("Solo los padres pueden crear premios", 403);
    }

    const newReward = await db.insert(reward).values({
        id: randomUUID(),
        familyId: userMember.familyId,
        title: data.title,
        cost: Number(data.cost),
        description: data.description || "",
        image: data.image || "🎁",
    }).returning();

    return newReward[0];
};

export const redeemReward = async (userId: string, rewardId: string) => {
    return await db.transaction(async (tx) => {
        const userMember = await tx.query.member.findFirst({
            where: eq(member.userId, userId),
        });

        if (!userMember) throw createError("Miembro no encontrado", 404);

        const targetReward = await tx.query.reward.findFirst({
            where: eq(reward.id, rewardId),
        });

        if (!targetReward) throw createError("Premio no encontrado", 404);

        if (userMember.balance < targetReward.cost) {
            throw createError(`Te faltan ${targetReward.cost - userMember.balance} puntos`, 400);
        }

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

        return { success: true, message: "¡Premio canjeado!" };
    });
};

export const deleteReward = async (userId: string, rewardId: string) => {
    const userMember = await db.query.member.findFirst({
        where: eq(member.userId, userId),
    });

    if (!userMember || userMember.role !== "PARENT") {
        throw createError("Solo los padres pueden eliminar premios", 403);
    }

    const deletedReward = await db.delete(reward)
        .where(and(
            eq(reward.id, rewardId),
            eq(reward.familyId, userMember.familyId)
        ))
        .returning();

    if (deletedReward.length === 0) {
        throw createError("Premio no encontrado", 404);
    }

    return { success: true, message: "Premio eliminado" };
};
