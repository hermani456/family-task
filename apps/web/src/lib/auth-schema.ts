import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = loginSchema.extend({
    name: z.string().min(2, "Name must be at least 2 characters"),
    repeatPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
});

export type AuthSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;