import { db } from './db/sqlite-client';
import { blocks, transactions } from './db/schema';
import { Block } from './block';
import { eq } from 'drizzle-orm';
import { Transaction } from './transaction';

/**
 * Responsible for:
 * - Storing the blockchain
 * - Adding new blocks to the blockchain
 * - Verifying the integrity of the blockchain
 * - Creating the genesis block
 */
export class Blockchain {
  constructor() {
    this.ensureGenesisBlock();
  }

  private async ensureGenesisBlock() {
    const existing = await db.select({ count: blocks.id }).from(blocks);
    if (existing.length === 0) {
      this.addBlock(new Block(0, Date.now(), [], ''));
    }
  }

  async addBlock(block: Block) {
    await db.insert(blocks).values({
      index: block.index,
      timestamp: block.timestamp,
      previousHash: block.previousHash,
      hash: block.hash,
      nonce: block.nonce,
    });
  }

  async getChain(): Promise<Block[]> {
    const blockRows = await db.select().from(blocks).orderBy(blocks.index);

    const blocksWithTxs: Block[] = [];

    for (const blk of blockRows) {
      const txRows = await db.select().from(transactions).where(eq(transactions.blockId, blk.id));

      const txs = txRows.map((tx) => {
        const t = new Transaction(tx.from, tx.to, tx.amount, tx.nonce);
        t.setSignature(tx.signature);
        return t;
      });

      const block = new Block(blk.index, blk.timestamp, txs, blk.previousHash, blk.nonce, blk.hash);
      blocksWithTxs.push(block);
    }

    return blocksWithTxs;
  }

  async isValidChain(): Promise<Boolean> {
    const chain = await this.getChain();

    for (let i = 1; i < chain.length; i++) {
      const current = chain[i];
      const previous = chain[i - 1];

      if (current.previousHash !== previous.hash) return false;
      if (current.calculateHash() !== current.hash) return false;
    }
    return true;
  }
}
