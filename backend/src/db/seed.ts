import { db } from './sqlite-client';
import { blocks, transactions, mempool, state } from './schema';
import { Transaction } from '../transaction';
import { Block } from '../block';
import { GENESIS_TIMESTAMP, GENESIS_HASH } from '../blockchain';

async function main() {
  // Clear existing data
  await db.delete(transactions);
  await db.delete(blocks);
  await db.delete(mempool);
  await db.delete(state);

  // Create mock state
  await db.insert(state).values([
    { address: 'addr1', balance: 100, nonce: 0 },
    { address: 'addr2', balance: 50, nonce: 0 },
  ]);

  // Insert a transaction
  const tx = new Transaction('addr1', 'addr2', 20, 0);
  tx.setSignature('fake-signature'); // for demo

  await db.insert(mempool).values({
    from: tx.from,
    to: tx.to,
    amount: tx.amount,
    nonce: tx.nonce,
    signature: tx.getSignature(),
  });

  // Insert genesis block
  const block = new Block(0, GENESIS_TIMESTAMP, [], '', 0, GENESIS_HASH);
  await db.insert(blocks).values({
    index: block.index,
    timestamp: block.timestamp,
    previousHash: block.previousHash,
    nonce: block.nonce,
    hash: block.hash,
  });

  console.log('✅ Seeded data');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
