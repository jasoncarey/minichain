import { Transaction } from './transaction';

export class State {
  private balances: Map<string, number>;

  constructor() {
    this.balances = new Map();
  }

  public getBalance(address: string): number {
    const balance = this.balances.get(address);
    if (balance) {
      return balance;
    }
    return 0;
  }

  public credit(address: string, amount: number) {
    const balance = this.getBalance(address);
    this.balances.set(address, balance + amount);
  }

  public applyTransaction(tx: Transaction): boolean {
    if (!Transaction.verify(tx)) return false;
    if (this.getBalance(tx.from) < tx.amount) return false;

    this.credit(tx.from, -tx.amount);
    this.credit(tx.to, tx.amount);
    return true;
  }
}
