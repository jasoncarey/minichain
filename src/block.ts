import { calculateHash } from './utils';

export class Block {
  public hash: string // SHA-256 hash of the current block

  constructor(
    public index: number, // position in the chain
    public timestamp: number, // time of creation
    public transactions: any[], // list of transactions
    public previousHash: string, // hash of the previous block
    public nonce: number = 0, // number used to mine the block
  ) {
    this.hash = this.calculateHash();
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
}