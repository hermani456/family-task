import { Request, Response } from "express";
import { db } from "../db";
import { member, family } from "../db/schema";
import { eq } from "drizzle-orm";

export const getMyFamily = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;

    try {
        const result = await db
            .select({
                memberId: member.id,
                role: member.role,
                balance: member.balance,
                familyId: family.id,
                familyName: family.name,
                inviteCode: family.inviteCode,
            })
            .from(member)
            .innerJoin(family, eq(member.familyId, family.id))
            .where(eq(member.userId, userId))
            .limit(1);

        if (result.length === 0) {
            res.json({ family: null });
            return;
        }

        res.json({ family: result[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching family data" });
    }
};