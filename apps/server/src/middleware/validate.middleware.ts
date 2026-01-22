import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

interface ValidationSchemas {
    body?: ZodSchema;
    params?: ZodSchema;
    query?: ZodSchema;
}

export const validate = (schemas: ValidationSchemas) => (req: Request, res: Response, next: NextFunction) => {
    if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: result.error.issues,
            });
        }
        req.body = result.data;
    }

    if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: result.error.issues,
            });
        }
        // req.params is usually strings, so we might not want to spread result.data back if we want to keep them as strings or if coercion happened. 
        // But for consistent typing, replacing is usually fine if we trust the schema.
    }

    if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: result.error.issues,
            });
        }
        req.query = result.data as any;
    }

    next();
};
