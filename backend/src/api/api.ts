import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import { Blockchain } from '../blockchain';
import { Mempool } from '../mempool';
import { Miner } from '../miner';
import { State } from '../state';
import { Wallet } from '../wallet';
import { Transaction } from '../transaction';
import { DB_PATH, HTTP_PORT } from '../node/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from '../db/schema';
import { syncChain } from '../node/sync';
import { Node } from '../node/node';
import { Block } from '../block';

config({ path: '.env.local' });

const sqlite = new Database(DB_PATH);
const db = drizzle(sqlite, { schema });

migrate(db, { migrationsFolder: './drizzle/migrations' });

const app = express();
app.use(express.json());
app.use(cors());

let node: Node;
let blockchain: Blockchain;
let state: State;
let mempool: Mempool;

async function main() {
  node = new Node();
  await node.start();

  ({ blockchain, state, mempool } = node);

  app.get('/chain', async (_req, res) => {
    console.log('Getting chain...');
    const chain = await node.blockchain.getChain();
    res.json(chain);
  });

  app.post('/create-wallet', async (req, res) => {
    const wallet = new Wallet();
    res.json({
      message: 'Wallet created. DO NOT LOSE THIS PRIVATE KEY!',
      address: wallet.getAddress(),
      privateKey: wallet.getPrivateKey(),
    });
  });

  app.get('/balance/:address', async (req, res) => {
    const balance = await state.getBalance(req.params.address);
    res.json({ address: req.params.address, balance });
  });

  app.get('/mempool', async (_req, res) => {
    const pendingTxs = await mempool.getTransactions();
    res.json(pendingTxs);
  });

  app.post('/mine', async (req, res) => {
    try {
      const { miner } = req.body;
      if (!miner) {
        res.status(400).json({ error: 'Miner address is required' });
        return;
      }

      const minerInstance = new Miner(blockchain, mempool, state, miner);
      const block = await minerInstance.mineBlock();

      res.json({ message: 'Block mined', block });
    } catch (err) {
      console.error('❌ Error mining block:', err);
      res.status(500).json({ error: 'Failed to mine block' });
    }
  });

  app.post('/tx', async (req, res) => {
    const { from, to, amount, privKey } = req.body;

    const senderWallet = Wallet.fromPrivateKey(privKey);
    const nonce = await state.getNonce(from);

    const tx = new Transaction(from, to, amount, nonce);
    tx.sign(senderWallet);

    await mempool.add(tx);

    await node.broadcastTransaction(tx);

    res.json({ message: 'Transaction added to mempool', tx });
  });

  app.post('/receive-block', async (req, res) => {
    const block = req.body;
    try {
      if (block.index === 0) {
        // console.debug('Skipping genesis block...');
        res.status(200).json({ message: 'Genesis block skipped' });
        return;
      }
      await blockchain.addBlock(Block.fromData(block));
      res.status(200).json({ message: 'Block received and added' });
    } catch (err) {
      console.error('❌ Error processing received block:', err);
      res.status(400).json({ error: 'Failed to process block' });
    }
  });

  app.post('/receive-tx', async (req, res) => {
    try {
      const tx = Transaction.fromData(req.body);
      await mempool.add(tx);
      res.status(200).json({ message: 'Transaction received and added' });
    } catch (err) {
      console.error('❌ Error processing received transaction:', err);
      res.status(400).json({ error: 'Failed to process transaction' });
    }
  });

  app.listen(HTTP_PORT, '0.0.0.0', async () => {
    console.log(`🧠 Node API running on http://localhost:${HTTP_PORT}`);

    try {
      console.log('🔄 Starting initial sync...');
      await syncChain(blockchain);
      console.log('✅ Initial sync complete');

      // Broadcast newly mined blocks to peers
      // setInterval(async () => {
      //   const latestBlock = await blockchain.getLatestBlock();
      //   const peers = process.env.PEERS?.split(',') || [];

      //   for (const peer of peers) {
      //     try {
      //       await fetch(`${peer}/receive-block`, {
      //         method: 'POST',
      //         headers: { 'Content-Type': 'application/json' },
      //         body: JSON.stringify(latestBlock),
      //       });
      //     } catch (err) {
      //       if (err instanceof Error) {
      //         console.warn(`⚠️ Failed to broadcast to ${peer}:`, err.message);
      //       } else {
      //         console.warn(`⚠️ Failed to broadcast to ${peer}:`, err);
      //       }
      //     }
      //   }
      // }, 10_000); // every 10 seconds
    } catch (err) {
      console.error('❌ Initial sync failed:', err);
    }
  });
}

main().catch((err) => {
  console.error('❌ Failed to start node:', err);
});
