import { Request, Response } from "express";
import { db } from "../db/index.js";
import { transaction, member } from "../db/shared/index.js";
import { eq, desc } from "drizzle-orm";

export const getHistory = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;

    try {
        const userMember = await db.query.member.findFirst({
            where: eq(member.userId, userId),
        });

        if (!userMember) return res.status(403).json({ error: "No eres miembro" });

        const history = await db
            .select()
            .from(transaction)
            .where(eq(transaction.familyId, userMember.familyId))
            .orderBy(desc(transaction.createdAt))
            .limit(20);

        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching history" });
    }
};