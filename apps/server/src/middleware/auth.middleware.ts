import { Request, Response, NextFunction } from "express";
import { auth } from "../../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        res.locals.user = session.user;
        res.locals.session = session.session;

        next();
    } catch (e) {
        res.status(500).json({ error: "Auth check failed" });
    }
};