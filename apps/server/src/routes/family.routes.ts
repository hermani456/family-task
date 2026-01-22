import { Router } from "express";
import { z } from "zod";
import * as FamilyController from "../controllers/family.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

const createFamilySchema = z.object({
    name: z.string().min(1, "Name is required"),
});

const joinFamilySchema = z.object({
    code: z.string().length(6, "Code must be 6 characters"), // inviteCode is hex string of 3 random bytes = 6 chars? Wait, randomBytes(3).toString('hex') is 6 chars.
});

router.use(requireAuth);

router.post("/", validate({ body: createFamilySchema }), FamilyController.createFamily);
router.post("/join", validate({ body: joinFamilySchema }), FamilyController.joinFamily);
router.get("/members", FamilyController.getFamilyMembers);

export default router;
