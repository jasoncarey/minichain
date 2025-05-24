import { mempool } from './db/schema';
import { db } from './db/sqlite-client';
import { Transaction } from './transaction';

export class Mempool {
  async add(tx: Transaction): Promise<void> {
    await db.insert(mempool).values({
      from: tx.from,
      to: tx.to,
      amount: tx.amount,
      nonce: tx.nonce,
      signature: tx.getSignature(),
    });
  }

  async getTransactions(): Promise<Transaction[]> {
    const txRows = await db.select().from(mempool);
    return txRows.map((tx) => Transaction.fromData(tx));
  }

  async clear(): Promise<void> {
    await db.delete(mempool);
  }
}
