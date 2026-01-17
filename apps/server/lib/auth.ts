import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../src/db/index.js"; // your drizzle instance
import * as schema from "../src/db/shared/index.js"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: [
        process.env.CLIENT_URL || "http://localhost:5173"
    ],
});