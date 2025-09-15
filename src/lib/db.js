import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Get database connection from environment
const connectionString = import.meta.env.VITE_DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create the connection
const sql = postgres(connectionString);
export const db = drizzle(sql);