import { beforeEach, describe, it, expect, beforeAll } from 'vitest';
import { Blockchain } from '../src/blockchain';
import { Mempool } from '../src/mempool';
import { State } from '../src/state';
import { Miner } from '../src/miner';
import { Wallet } from '../src/wallet';
import { Transaction } from '../src/transaction';

describe('Mining Flow', () => {
  let blockchain: Blockchain;
  let mempool: Mempool;
  let miner: Miner;
  let state: State;
  let walletA: Wallet;
  let walletB: Wallet;

  beforeAll(() => {
    walletA = new Wallet();
    walletB = new Wallet();
  });

  beforeEach(() => {
    blockchain = new Blockchain();
    mempool = new Mempool();
    state = new State();
    miner = new Miner(blockchain, mempool, state, walletA.getAddress());
  });

  it('should mine block with valid transactions', async () => {
    // Add valid transaction
    const tx = new Transaction(walletA.getAddress(), walletB.getAddress(), 10, 0);
    tx.sign(walletA);
    mempool.add(tx);

    console.log('Mempool before mining:', await mempool.getTransactions());

    // Mine block
    const block = await miner.mineBlock();

    console.log(block.transactions);

    expect(block).toBeDefined();
    expect(block.transactions).toHaveLength(2); // 1 normal tx + 1 coinbase
    expect(blockchain.getLatestBlock()).toEqual(block);
  });

  it('should reject invalid transactions when mining', async () => {
    // Add invalid transaction (wrong signature)
    const invalidTx = new Transaction(walletA.getAddress(), walletB.getAddress(), 10, 0);
    invalidTx.setSignature('invalid_signature');
    mempool.add(invalidTx);

    // Mine block
    const block = await miner.mineBlock();

    expect(block.transactions).toHaveLength(1); // Only coinbase
  });

  it('should include coinbase transaction', async () => {
    const block = await miner.mineBlock();
    const coinbaseTx = block.transactions[0];

    expect(coinbaseTx.from).toBe('COINBASE');
    expect(coinbaseTx.to).toBe(walletA.getAddress());
    expect(coinbaseTx.amount).toBe(Miner.COINBASE_REWARD);
  });
});
