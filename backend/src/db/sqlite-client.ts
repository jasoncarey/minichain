import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { DB_PATH } from '../node/config';

export const sqlite = new Database(DB_PATH);

export const db = drizzle<typeof schema>(sqlite, { schema });
