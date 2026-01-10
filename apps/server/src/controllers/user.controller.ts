import { Request, Response } from "express";
import { db } from "../db";
import { member, family, user } from "@family-task/shared";
import { eq } from "drizzle-orm";

export const getMyFamily = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;

    try {
        const currentMember = await db.query.member.findFirst({
            where: eq(member.userId, userId),
            with: {
                user: true, 
            },
        });

        if (!currentMember) return res.json(null); 

        const currentFamily = await db.query.family.findFirst({
            where: eq(family.id, currentMember.familyId),
        });

        if (!currentFamily) return res.status(404).json({ error: "Familia no encontrada" });

        res.json({
            family: currentFamily,
            member: currentMember,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};