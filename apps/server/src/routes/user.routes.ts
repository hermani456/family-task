import { Router } from "express";
import * as UserController from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/family", UserController.getMyFamily);

export default router;
