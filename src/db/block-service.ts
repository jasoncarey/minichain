import { db } from './client';
import { blocks, transactions } from './schema';
import { Block } from '../block';
import { Blockchain } from '../blockchain';
import { eq } from 'drizzle-orm';
import { Transaction } from '../transaction';

export async function saveBlock(block: Block): Promise<void> {
  // insert the block
  const [insertedBlock] = await db
    .insert(blocks)
    .values({
      index: block.index,
      timestamp: block.timestamp,
      previousHash: block.previousHash,
      hash: block.hash,
      nonce: block.nonce,
    })
    .returning();

  // insert associated transactions
  if (block.transactions.length > 0) {
    await db.insert(transactions).values(
      block.transactions.map((tx) => ({
        blockId: insertedBlock.id,
        from: tx.from,
        to: tx.to,
        amount: tx.amount,
        nonce: tx.nonce,
        signature: tx.getSignature(),
      })),
    );
  }
}

export async function loadBlockchain(): Promise<Blockchain> {
  const chain = new Blockchain();
  chain.chain = []; // override genesis block

  // load blocks
  const allBlocks = await db.select().from(blocks).orderBy(blocks.index);

  for (const blk of allBlocks) {
    // load transactions
    const txs = await db.select().from(transactions).where(eq(transactions.blockId, blk.id));

    const parsedTxs = txs.map((tx) => {
      const transaction = new Transaction(tx.from, tx.to, tx.amount, tx.nonce);
      transaction.setSignature(tx.signature);
      return transaction;
    });

    const block = new Block(
      blk.index,
      blk.timestamp,
      parsedTxs,
      blk.previousHash,
      blk.nonce,
      blk.hash,
    );

    chain.chain.push(block);
  }

  return chain;
}
