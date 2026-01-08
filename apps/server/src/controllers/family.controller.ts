import { Request, Response } from "express";
import { db } from "../db";
import { family, member } from "../db/schema";
import { randomUUID, randomBytes } from "crypto";

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