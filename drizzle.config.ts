import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { DB_PATH } from './src/node/config';

config({ path: '.env.local' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: DB_PATH,
  },
});
