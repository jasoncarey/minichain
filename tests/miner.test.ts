import { beforeEach, describe, it, expect } from 'vitest';
import { Blockchain } from '../src/blockchain';
import { Mempool } from '../src/mempool';
import { State } from '../src/state';
import { Miner } from '../src/miner';
import { Wallet } from '../src/wallet';
import { Transaction } from '../src/transaction';

describe('Miner', () => {
  let blockchain: Blockchain;
  let mempool: Mempool;
  let state: State;
  let miner: Miner;
  let alice: Wallet;
  let bob: Wallet;

  beforeEach(() => {
    blockchain = new Blockchain();
    mempool = new Mempool();
    state = new State();
    alice = new Wallet();
    bob = new Wallet();
    miner = new Miner(blockchain, mempool, state, alice.getAddress());
  });

  it('funds the miner on first block', () => {
    expect(state.getBalance(alice.getAddress())).toBe(0);
    miner.mineBlock();
    expect(state.getBalance(alice.getAddress())).toBe(1);
  });

  it('processes a transaction from alice to bob', () => {
    miner.mineBlock(); // mine so alice has a coin

    const tx = new Transaction(alice.getAddress(), bob.getAddress(), 1, 0);
    tx.sign(alice);
    mempool.add(tx);

    miner.mineBlock();

    expect(state.getBalance(alice.getAddress())).toBe(1);
    expect(state.getBalance(bob.getAddress())).toBe(1);
  });
});
