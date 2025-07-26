import { Transaction } from './transaction';
import { calculateHash } from './utils';

/**
 * index: position in the chain
 * timestamp: time of creation
 * transactions: list of transactions
 * previousHash: hash of the previous block
 * nonce: number used to mine the block
 * hash: the hash of the block
 * hashOverride: allow overriding for use in db
 */
export class Block {
  public hash: string;

  constructor(
    public index: number,
    public timestamp: number,
    public transactions: any[],
    public previousHash: string,
    public nonce: number = 0,
    hashOverride?: string,
  ) {
    this.hash = hashOverride ?? this.calculateHash();
  }

  public calculateHash(): string {
    const data = JSON.stringify({
      index: this.index,
      timestamp: this.timestamp,
      transactions: this.transactions,
      previousHash: this.previousHash,
      nonce: this.nonce,
    });

    return calculateHash(data);
  }

  public mine(difficulty: number): void {
    const prefix = '0'.repeat(difficulty);
    while (!this.hash.startsWith(prefix)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }

  public static fromData(data: any): Block {
    const transactions = data.transactions.map(Transaction.fromData);
    return new Block(
      data.index,
      data.timestamp,
      transactions,
      data.previousHash,
      data.nonce,
      data.hash,
    );
  }
}
