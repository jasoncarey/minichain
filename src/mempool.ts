import { Transaction } from './transaction';

export class Mempool {
  public pool: Transaction[] = [];

  public add(tx: Transaction): void {
    this.pool.push(tx);
  }

  public getTransactions(): Transaction[] {
    return [...this.pool]; // copy to avoid mutation
  }

  public clear(): void {
    this.pool = [];
  }
}
