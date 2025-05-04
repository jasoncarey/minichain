import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const blocks = sqliteTable('blocks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  index: integer('index').notNull(),
  timestamp: integer('timestamp').notNull(),
  previousHash: text('previous_hash').notNull(),
  hash: text('hash').notNull(),
  nonce: integer('nonce').notNull(),
});

export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  blockId: integer('block_id').references(() => blocks.id),
  from: text('from').notNull(),
  to: text('to').notNull(),
  amount: integer('amount').notNull(),
  nonce: integer('nonce').notNull(),
  signature: text('signature').notNull(),
});

export const mempool = sqliteTable('mempool', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  from: text('from').notNull(),
  to: text('to').notNull(),
  amount: integer('amount').notNull(),
  nonce: integer('nonce').notNull(),
  signature: text('signature').notNull(),
});

export const state = sqliteTable('state', {
  address: text('address').primaryKey(),
  balance: integer('balance').notNull(),
  nonce: integer('nonce').notNull(),
});
