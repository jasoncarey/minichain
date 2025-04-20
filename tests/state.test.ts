import { beforeEach, describe, expect, it } from 'vitest';
import { State } from '../src/state';
import { Transaction } from '../src/transaction';
import { Wallet } from '../src/wallet';

describe('State', () => {
  let state: State;
  let alice: Wallet;
  let bob: Wallet;

  beforeEach(() => {
    state = new State();
    alice = new Wallet();
    bob = new Wallet();
  });

  it('applies transactions with valid nonce and rejects transactions with invalid nonce', () => {
    let tx: Transaction;
    state.credit(alice.getAddress(), 10);

    // valid nonce 0
    tx = new Transaction(alice.getAddress(), bob.getAddress(), 3, 0);
    tx.sign(alice);
    expect(state.applyTransaction(tx)).toBe(true);

    // valid nonce 1
    tx = new Transaction(alice.getAddress(), bob.getAddress(), 4, 1);
    tx.sign(alice);
    expect(state.applyTransaction(tx)).toBe(true);

    // invalid nonce 0 (replay)
    tx = new Transaction(alice.getAddress(), bob.getAddress(), 2, 0);
    tx.sign(alice);
    expect(state.applyTransaction(tx)).toBe(false);

    // invalid nonce 3 (skipped)
    tx = new Transaction(alice.getAddress(), bob.getAddress(), 2, 3);
    tx.sign(alice);
    expect(state.applyTransaction(tx)).toBe(false);
  });
});
