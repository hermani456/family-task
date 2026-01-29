import { db } from "../db/index.js";
import { member, family } from "../db/shared/index.js";
import { eq } from "drizzle-orm";
import { createError } from "../utils/error.utils.js";

export const getMyFamily = async (userId: string) => {
    const currentMember = await db.query.member.findFirst({
        where: eq(member.userId, userId),
        with: {
            user: true,
        },
    });

    if (!currentMember) return null;

    const currentFamily = await db.query.family.findFirst({
        where: eq(family.id, currentMember.familyId),
    });

    if (!currentFamily) throw createError("Familia no encontrada", 404);

    return {
        family: currentFamily,
        member: currentMember,
    };
};
