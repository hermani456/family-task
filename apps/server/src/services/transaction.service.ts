import { db } from "../db/index.js";
import { transaction, member } from "../db/shared/index.js";
import { eq, desc } from "drizzle-orm";
import { createError } from "../utils/error.utils.js";

export const getHistory = async (userId: string) => {
    const userMember = await db.query.member.findFirst({
        where: eq(member.userId, userId),
    });

    if (!userMember) throw createError("No eres miembro", 403);

    return await db
        .select()
        .from(transaction)
        .where(eq(transaction.familyId, userMember.familyId))
        .orderBy(desc(transaction.createdAt))
        .limit(20);
};
