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

  public signCoinbase(): void {
    if (this.from === 'COINBASE') {
      this.signature = 'COINBASE_SIGNATURE';
    }
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

  public static verify(tx: Transaction): boolean {
    if (tx.from === 'COINBASE') {
      return tx.getSignature() === 'COINBASE_SIGNATURE';
    }
    console.log('Verifying transaction...');
    if (tx.amount <= 0 || tx.nonce < 0) {
      console.log('Invalid transaction...');
      return false;
    }
    console.log('Verifying signature...');
    return Wallet.verifySignature(tx.toHash(), tx.signature, tx.from);
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

  /**
   * Creates a coinbase transaction
   */
  public static createCoinbase(rewardAddress: string, amount: number): Transaction {
    console.log('Creating coinbase transaction...');
    const tx = new Transaction('COINBASE', rewardAddress, amount, 0);
    tx.setSignature('COINBASE');
    return tx;
  }
}
