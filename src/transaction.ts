import { calculateHash } from './utils';
import { Wallet } from './wallet';

/**
 * Responsible for:
 *   - store relevant fields
 *   - provide method to sign the transaction using a Wallet
 *   - provide method to verify a signature
 *
 * from: sender's address (public key in hex)
 * to: receiver's address
 * amount: coins to transfer
 * nonce: prevents replay attacks
 * signature: signature from sender (hex)
 */
export class Transaction {
  public from: string;
  public to: string;
  public amount: number;
  public nonce: number;
  private signature!: string;

  constructor(from: string, to: string, amount: number, nonce: number) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.nonce = nonce;
  }

  public getSignature(): string {
    return this.signature;
  }

  public sign(privateWallet: Wallet): void {
    this.signature = privateWallet.sign(this.toHash());
  }
  public toHash(): string {
    const data = JSON.stringify({
      from: this.from,
      to: this.to,
      amount: this.amount,
      nonce: this.nonce,
    });
    return calculateHash(data);
  }

  public setSignature(signature: string): void {
    this.signature = signature;
  }

  public static verify(transaction: Transaction): boolean {
    if (transaction.amount <= 0 || transaction.nonce < 0) {
      return false;
    }
    return Wallet.verifySignature(transaction.toHash(), transaction.signature, transaction.from);
  }

  /**
   * Used to safely reconstruct a Transaction object from raw DB records
   */
  public static fromData(data: {
    from: string;
    to: string;
    amount: number;
    nonce: number;
    signature: string;
  }): Transaction {
    const tx = new Transaction(data.from, data.to, data.amount, data.nonce);
    tx.setSignature(data.signature);
    return tx;
  }
}
