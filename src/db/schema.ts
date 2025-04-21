import { pgTable, serial, text, integer, bigint } from 'drizzle-orm/pg-core';

export const blocks = pgTable('blocks', {
  id: serial('id').primaryKey(),
  index: integer('index').notNull(),
  timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
  previousHash: text('previous_hash').notNull(),
  hash: text('hash').notNull(),
  nonce: integer('nonce').notNull(),
});

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  blockId: integer('block_id').references(() => blocks.id),
  from: text('from').notNull(),
  to: text('to').notNull(),
  amount: integer('amount').notNull(),
  nonce: integer('nonce').notNull(),
  signature: text('signature').notNull(),
});
