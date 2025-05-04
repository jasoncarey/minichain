import { eq } from 'drizzle-orm';
import { db } from './db/sqlite-client';
import { Transaction } from './transaction';
import { state } from './db/schema';

export class State {
  async getNonce(address: string): Promise<number> {
    const row = await db.query.state.findFirst({
      where: eq(state.address, address),
    });

    return row ? row.balance : 0;
  }

  async getBalance(address: string): Promise<number> {
    const row = await db.query.state.findFirst({
      where: eq(state.address, address),
    });

    return row ? row.balance : 0;
  }

  async credit(address: string, amount: number): Promise<void> {
    const current = await this.getBalance(address);
    const exists = await db.query.state.findFirst({
      where: eq(state.address, address),
    });

    if (exists) {
      await db
        .update(state)
        .set({ balance: current + amount })
        .where(eq(state.address, address));
    } else {
      await db.insert(state).values({
        address,
        balance: amount,
        nonce: 0,
      });
    }
  }

  async incrementNonce(address: string): Promise<void> {
    const current = await this.getNonce(address);
    await db
      .update(state)
      .set({ nonce: current + 1 })
      .where(eq(state.address, address));
  }

  async applyTransaction(tx: Transaction): Promise<boolean> {
    if (!Transaction.verify(tx)) return false;

    const nonce = await this.getNonce(tx.from);
    if (tx.nonce !== nonce) return false;

    const balance = await this.getBalance(tx.from);
    if (balance < tx.amount) return false;

    await this.credit(tx.from, -tx.amount);
    await this.credit(tx.to, tx.amount);
    this.incrementNonce(tx.from);
    return true;
  }
}
