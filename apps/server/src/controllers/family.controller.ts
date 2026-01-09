import { Request, Response } from "express";
import { db } from "../db";
import { family, member, user } from "../db/schema";
import { randomUUID, randomBytes } from "crypto";
import { eq } from "drizzle-orm";

export const createFamily = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const userId = res.locals.user?.id;

        if (!userId) return res.status(401).json({ error: "Unauthorized" });

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

        res.json({ success: true, familyId, inviteCode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating family" });
    }
};

export const joinFamily = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const { code } = req.body;

    if (!code) return res.status(400).json({ error: "Code is required" });

    const normalizedCode = String(code).trim().toUpperCase();

    try {
        const targetFamily = await db.query.family.findFirst({
            where: eq(family.inviteCode, normalizedCode),
        });

        if (!targetFamily) {
            return res.status(404).json({ error: "Código de invitación inválido" });
        }

        const existingMember = await db.query.member.findFirst({
            where: eq(member.userId, userId),
        });

        if (existingMember) {
            return res.status(400).json({ error: "Ya perteneces a una familia" });
        }

        await db.insert(member).values({
            id: randomUUID(),
            userId,
            familyId: targetFamily.id,
            role: "CHILD",
        });

        res.json({ success: true, familyId: targetFamily.id, role: "CHILD" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error joining family" });
    }
};

export const getFamilyMembers = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;

    try {
        const requestor = await db.query.member.findFirst({
            where: eq(member.userId, userId),
        });

        if (!requestor) return res.status(403).json({ error: "No tienes familia" });

        const members = await db
            .select({
                userId: member.userId,
                name: user.name,
                role: member.role,
                avatar: user.image
            })
            .from(member)
            .innerJoin(user, eq(member.userId, user.id))
            .where(eq(member.familyId, requestor.familyId));

        res.json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching members" });
    }
};