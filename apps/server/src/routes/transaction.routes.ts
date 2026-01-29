import { Router } from "express";
import * as TransactionController from "../controllers/transaction.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", TransactionController.getHistory);

export default router;
