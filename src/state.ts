import { Transaction } from './transaction';

export class State {
  private balances: Map<string, number>;
  private nonces: Map<string, number>;

  constructor() {
    this.balances = new Map();
    this.nonces = new Map();
  }

  public getNonce(address: string): number {
    const nonce = this.nonces.get(address);
    return nonce ?? 0;
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
    if (tx.nonce !== this.getNonce(tx.from)) return false;
    if (this.getBalance(tx.from) < tx.amount) return false;

    this.credit(tx.from, -tx.amount);
    this.credit(tx.to, tx.amount);
    this.incrementNonce(tx.from);
    return true;
  }

  private incrementNonce(address: string): void {
    const current = this.getNonce(address);
    this.nonces.set(address, current + 1);
  }
}
