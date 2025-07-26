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
  constructor() {}

  async init() {
    await this.ensureGenesisBlock();
  }

  /**
   * If the blockchain is empty, add a genesis block.
   */
  private async ensureGenesisBlock() {
    console.log('Ensuring genesis block...');
    const [{ count }] = await db.select({ count: sql<number>`COUNT(*)` }).from(blocks);
    if (count === 0) {
      await this.addBlock(new Block(0, GENESIS_TIMESTAMP, [], '', 0, GENESIS_HASH));
    }
  }

  async addBlock(block: Block) {
    const latestBlock = await this.getLatestBlock();
    if (!this.isValidNewBlock(block, latestBlock)) {
      console.warn('Invalid new block, skipping...');
      return;
    } else {
      console.log('New block is valid, adding to chain...');
    }

    const existing = await db.query.blocks.findFirst({
      where: (blk, { eq }) => eq(blk.hash, block.hash),
    });

    if (existing) {
      // console.debug('Block already exists, skipping...');
      return;
    }

    await db.insert(blocks).values({
      index: block.index,
      timestamp: block.timestamp,
      previousHash: block.previousHash,
      hash: block.hash,
      nonce: block.nonce,
    });
  }

  private isValidNewBlock(newBlock: Block, previousBlock: Block): boolean {
    if (previousBlock.index + 1 !== newBlock.index) {
      console.warn(`❌ Invalid index: expected ${previousBlock.index + 1}, got ${newBlock.index}`);
      return false;
    }
    if (previousBlock.hash !== newBlock.previousHash) {
      console.warn(
        `❌ Invalid previousHash: expected ${previousBlock.hash}, got ${newBlock.previousHash}`,
      );
      return false;
    }
    if (newBlock.hash !== newBlock.calculateHash()) {
      console.warn(`❌ Invalid hash: expected ${newBlock.calculateHash()}, got ${newBlock.hash}`);
      return false;
    }
    return true;
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
    for (const block of newChain) {
      const existing = await db.query.blocks.findFirst({
        where: (blk, { eq }) => eq(blk.hash, block.hash),
      });

      if (!existing) {
        await db.insert(blocks).values({
          index: block.index,
          timestamp: block.timestamp,
          previousHash: block.previousHash,
          hash: block.hash,
          nonce: block.nonce,
        });
      }
    }
  }
}
