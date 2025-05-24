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

config({ path: '.env.local' });

const sqlite = new Database(DB_PATH);
const db = drizzle(sqlite, { schema });

migrate(db, { migrationsFolder: './drizzle/migrations' });

const app = express();
app.use(express.json());
app.use(cors());

const blockchain = new Blockchain();
const mempool = new Mempool();
const state = new State();

app.get('/chain', async (_req, res) => {
  const chain = await blockchain.getChain();
  res.json(chain);
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
  const { miner } = req.body;
  const minerInstance = new Miner(blockchain, mempool, state, miner);
  const block = await minerInstance.mineBlock();

  res.json({ message: 'Block mined', block });
});

app.post('/tx', async (req, res) => {
  const { from, to, amount, privKey } = req.body;

  const senderWallet = Wallet.fromPrivateKey(privKey);
  const nonce = await state.getNonce(from);

  const tx = new Transaction(from, to, amount, nonce);
  tx.sign(senderWallet);

  await mempool.add(tx);
  res.json({ message: 'Transaction added to mempool', tx });
});

app.listen(HTTP_PORT, '0.0.0.0', () => {
  console.log(`🧠 Node API running on http://localhost:${HTTP_PORT}`);
});
