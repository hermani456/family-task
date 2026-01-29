import { Request, Response } from "express";
import * as UserService from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMyFamily = asyncHandler(async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const data = await UserService.getMyFamily(userId);
    res.json(data);
});