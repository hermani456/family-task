import { Request, Response } from "express";
import * as TransactionService from "../services/transaction.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getHistory = asyncHandler(async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const history = await TransactionService.getHistory(userId);
    res.json(history);
});