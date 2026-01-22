import { Request, Response } from "express";
import * as FamilyService from "../services/family.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createFamily = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body;
    const userId = res.locals.user?.id;

    const result = await FamilyService.createFamily(userId, name);
    res.json({ success: true, ...result });
});

export const joinFamily = asyncHandler(async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const { code } = req.body;

    const result = await FamilyService.joinFamily(userId, code);
    res.json({ success: true, ...result });
});

export const getFamilyMembers = asyncHandler(async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const members = await FamilyService.getFamilyMembers(userId);
    res.json(members);
});