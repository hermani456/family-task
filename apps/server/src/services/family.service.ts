import { db } from "../db/index.js";
import { family, member, user } from "../db/shared/index.js";
import { eq } from "drizzle-orm";
import { randomUUID, randomBytes } from "crypto";
import { createError } from "../utils/error.utils.js";

export const createFamily = async (userId: string, name: string) => {
    if (!userId) throw createError("Unauthorized", 401);

    const inviteCode = randomBytes(3).toString("hex").toUpperCase();
    const familyId = randomUUID();

    await db.transaction(async (tx) => {
        await tx.insert(family).values({
            id: familyId,
            name,
            inviteCode,
        });

        await tx.insert(member).values({
            id: randomUUID(),
            userId: userId,
            familyId: familyId,
            role: "PARENT",
        });
    });

    return { familyId, inviteCode };
};

export const joinFamily = async (userId: string, code: string) => {
    if (!code) throw createError("Code is required", 400);

    const normalizedCode = String(code).trim().toUpperCase();

    const targetFamily = await db.query.family.findFirst({
        where: eq(family.inviteCode, normalizedCode),
    });

    if (!targetFamily) {
        throw createError("Código de invitación inválido", 404);
    }

    const existingMember = await db.query.member.findFirst({
        where: eq(member.userId, userId),
    });

    if (existingMember) {
        throw createError("Ya perteneces a una familia", 400);
    }

    await db.insert(member).values({
        id: randomUUID(),
        userId,
        familyId: targetFamily.id,
        role: "CHILD",
    });

    return { familyId: targetFamily.id, role: "CHILD" };
};

export const getFamilyMembers = async (userId: string) => {
    const requestor = await db.query.member.findFirst({
        where: eq(member.userId, userId),
    });

    if (!requestor) throw createError("No tienes familia", 403);

    const members = await db
        .select({
            userId: member.userId,
            name: user.name,
            role: member.role,
            avatar: user.image,
            balance: member.balance
        })
        .from(member)
        .innerJoin(user, eq(member.userId, user.id))
        .where(eq(member.familyId, requestor.familyId));

    return members;
};
