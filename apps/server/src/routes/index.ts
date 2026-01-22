import { Router } from "express";
import taskRoutes from "./task.routes.js";
import familyRoutes from "./family.routes.js";
import userRoutes from "./user.routes.js";
import rewardRoutes from "./reward.routes.js";
import transactionRoutes from "./transaction.routes.js";

const router = Router();

router.use("/tasks", taskRoutes);
router.use("/families", familyRoutes);
router.use("/user", userRoutes);
router.use("/rewards", rewardRoutes);
router.use("/history", transactionRoutes);

export default router;
