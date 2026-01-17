import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "./shared/index.js";

neonConfig.webSocketConstructor = ws;

import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err: any) => console.error('Unexpected error on idle client', err));

export const db = drizzle(pool, { schema });