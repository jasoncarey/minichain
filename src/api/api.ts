import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import { State } from '../state';
import { Mempool } from '../mempool';
import { loadBlockchain, saveBlock } from '../db/block-service';
import { Miner } from '../miner';
import { Wallet } from '../wallet';
import { Transaction } from '../transaction';
import { saveMempool } from '../storage';

config({ path: '.env.local' });

const app = express();
app.use(express.json());
app.use(cors());

const mempool = new Mempool();
const state = new State();

app.get('/chain', async (req, res) => {
  const chain = await loadBlockchain();
  res.json(chain.chain);
});

app.get('/balance/:address', (req, res) => {
  const address = req.params.address;
  const balance = state.getBalance(address);
  res.json({ address, balance });
});

app.get('/mempool', (req, res) => {
  const pendingTxs = mempool.getTransactions();
  res.json(pendingTxs);
});

app.post('/mine', async (req, res) => {
  const { miner } = req.body;

  const blockchain = await loadBlockchain();
  const minerInstance = new Miner(blockchain, mempool, state, miner);
  const block = minerInstance.mineBlock();

  await saveBlock(block);
  res.json({ message: 'Block mined', block });
});

app.post('/tx', (req, res) => {
  const { from, to, amount, privKey } = req.body;

  const senderWallet = Wallet.fromPrivateKey(privKey); // TODO: sign in client before sending
  const nonce = state.getNonce(from);

  const tx = new Transaction(from, to, amount, nonce);
  tx.sign(senderWallet);

  mempool.add(tx);
  saveMempool(mempool);

  res.json({ message: 'Transaction added to mempool', tx });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🧠 API running at http://localhost:${PORT}`);
});
