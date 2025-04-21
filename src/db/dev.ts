import { db } from './client';
import { blocks } from './schema';

async function main() {
  const result = await db.select().from(blocks).limit(5);
  console.log('📦 Blocks:', result);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
