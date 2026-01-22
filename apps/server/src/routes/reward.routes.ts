import { Router } from "express";
import { z } from "zod";
import * as RewardController from "../controllers/reward.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

const createRewardSchema = z.object({
    title: z.string().min(1, "Title is required"),
    cost: z.number().int().positive("Cost must be positive"),
    description: z.string().optional(),
    image: z.string().optional(),
});

const rewardIdSchema = z.object({
    rewardId: z.string().uuid("Invalid Reward ID"),
});

router.use(requireAuth);

router.get("/", RewardController.getRewards);
router.post("/", validate({ body: createRewardSchema }), RewardController.createReward);
router.post("/:rewardId/redeem", validate({ params: rewardIdSchema }), RewardController.redeemReward);
router.delete("/:rewardId", validate({ params: rewardIdSchema }), RewardController.deleteReward);

export default router;
