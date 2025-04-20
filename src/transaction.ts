import { calculateHash } from './utils';
import { Wallet } from './wallet';

/**
 * Responsible for:
 *   - store relevant fields
 *   - provide method to sign the transaction using a Wallet
 *   - provide method to verify a signature
 */
export class Transaction {
  public from: string; // sender's address (public key in hex)
  public to: string; // receiver's address
  public amount: number; // coins to transfer
  public nonce: number; // prevents replay attacks
  private signature!: string; // signature from sender (hex)

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

  public static verify(transaction: Transaction): boolean {
    if (transaction.amount <= 0 || transaction.nonce < 0) {
      return false;
    }
    return Wallet.verifySignature(transaction.toHash(), transaction.signature, transaction.from);
  }
}
