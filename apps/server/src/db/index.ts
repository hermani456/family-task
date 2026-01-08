import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing');
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err: any) => console.error('Unexpected error on idle client', err));

export const db = drizzle(pool, { schema });