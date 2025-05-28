import { db } from './db/sqlite-client';
import { blocks, transactions } from './db/schema';
import { Block } from './block';
import { eq, sql } from 'drizzle-orm';
import { Transaction } from './transaction';

export const GENESIS_TIMESTAMP = new Date('2000-01-01T00:00:00.000Z').getTime();
export const GENESIS_HASH = '0c0ffee0c0ffee0c0ffee0c0ffee0c0ffee0c0ffee0c0ffee0c0ffee0c0ffee0';

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

  /**
   * If the blockchain is empty, add a genesis block.
   */
  private async ensureGenesisBlock() {
    const [{ count }] = await db.select({ count: sql<number>`COUNT(*)` }).from(blocks);
    if (count === 0) {
      this.addBlock(new Block(0, GENESIS_TIMESTAMP, [], '', 0, GENESIS_HASH));
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

      const txs = txRows.map((tx) => Transaction.fromData(tx));

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

  async getLatestBlock(): Promise<Block> {
    const chain = await this.getChain();
    return chain[chain.length - 1];
  }

  async replaceChain(newChain: Block[]) {
    await db.delete(blocks);
    await db.delete(transactions);

    for (const block of newChain) {
      await this.addBlock(block);
    }
  }
}
