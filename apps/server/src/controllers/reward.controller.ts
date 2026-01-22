import { Request, Response } from "express";
import * as RewardService from "../services/reward.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getRewards = asyncHandler(async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const rewards = await RewardService.getRewards(userId);
    res.json(rewards);
});

export const createReward = asyncHandler(async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const result = await RewardService.createReward(userId, req.body);
    res.json(result);
});

export const redeemReward = asyncHandler(async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const { rewardId } = req.params;
    const result = await RewardService.redeemReward(userId, rewardId);
    res.json(result);
});

export const deleteReward = asyncHandler(async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const { rewardId } = req.params;
    const result = await RewardService.deleteReward(userId, rewardId);
    res.json(result);
});