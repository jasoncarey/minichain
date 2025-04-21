import fs from 'fs';
import path from 'path';
import { Blockchain } from './blockchain';
import { Block } from './block';
import { State } from './state';
import { Mempool } from './mempool';
import { Transaction } from './transaction';

const dataDir = path.resolve('data');
const blockchainFile = path.join(dataDir, 'blockchain.json');
const stateFile = path.join(dataDir, 'state.json');
const mempoolFile = path.join(dataDir, 'mempool.json');

export function loadBlockchain(): Blockchain {
  if (!fs.existsSync(blockchainFile)) {
    return new Blockchain(); // fallback to fresh chain
  }

  const raw = fs.readFileSync(blockchainFile, 'utf-8');
  const blocksData = JSON.parse(raw);

  const blockchain = new Blockchain();

  // overwrwite chain we deserialised blocks
  blockchain.chain = blocksData.map(
    (b: any) => new Block(b.index, b.timestamp, b.transactions, b.previousHash, b.nonce),
  );

  return blockchain;
}

export function saveBlockchain(blockchain: Blockchain): void {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const serialized = JSON.stringify(blockchain.chain, null, 2);
  fs.writeFileSync(blockchainFile, serialized, 'utf-8');
}

export function loadState(): State {
  const state = new State();

  if (!fs.existsSync(stateFile)) {
    return state;
  }

  const raw = fs.readFileSync(stateFile, 'utf-8');
  const parsed = JSON.parse(raw);

  for (const [address, balance] of Object.entries(parsed.balances)) {
    if (typeof balance === 'number') {
      state.credit(address, balance);
    }
  }

  for (const [address, nonce] of Object.entries(parsed.nonces)) {
    if (typeof nonce === 'number') {
      state.setNonce(address, nonce);
    }
  }

  return state;
}

export function saveState(state: State): void {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const data = {
    balances: state.dumpBalances(),
    nonces: state.dumpNonces(),
  };

  fs.writeFileSync(stateFile, JSON.stringify(data, null, 2), 'utf-8');
}

export function saveMempool(mempool: Mempool): void {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const serialized = JSON.stringify(mempool.pool, null, 2);
  fs.writeFileSync(mempoolFile, serialized, 'utf-8');
}

export function loadMempool(): Mempool {
  const mempool = new Mempool();

  if (!fs.existsSync(mempoolFile)) {
    return mempool;
  }

  const raw = fs.readFileSync(mempoolFile, 'utf-8');
  const parsed = JSON.parse(raw);

  for (const tx of parsed) {
    const transaction = new Transaction(tx.from, tx.to, tx.amount, tx.nonce);
    transaction.setSignature(tx.signature);
    mempool.add(transaction);
  }

  return mempool;
}
