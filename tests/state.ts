import { beforeEach, describe, expect, it } from 'vitest';
import { State } from '../src/state';
import { Transaction } from '../src/transaction';
import { Wallet } from '../src/wallet';
import { Mempool } from '../src/mempool';
import { mempool as mempoolTable, state as stateTable } from '../src/db/schema';
import { db } from '../src/db/sqlite-client';

describe('State', () => {
  let state: State;
  let mempool: Mempool;
  let alice: Wallet;
  let bob: Wallet;

  beforeEach(async () => {
    state = new State();
    mempool = new Mempool();
    alice = new Wallet();
    bob = new Wallet();

    await db.delete(mempoolTable);
    await db.delete(stateTable);
  });

  it('processes a valid transaction and update balances + nonce', async () => {
    // 1. Credit Alice
    await state.credit(alice.getAddress(), 10);

    // 2. Check initial balances
    expect(await state.getBalance(alice.getAddress())).toBe(10);
    expect(await state.getBalance(bob.getAddress())).toBe(0);
    expect(await state.getNonce(alice.getAddress())).toBe(0);

    // 3. Create and sign a tx from Alice to Bob
    const nonce = await state.getNonce(alice.getAddress());
    const tx = new Transaction(alice.getAddress(), bob.getAddress(), 5, nonce);
    tx.sign(alice);

    // 4. Add tx to mempool
    await mempool.add(tx);

    // 5. Verify mempool has 1 tx
    const memTxs = await mempool.getTransactions();
    expect(memTxs.length).toBe(1);

    // 6. Apply transaction
    const applied = await state.applyTransaction(tx);
    expect(applied).toBe(true);

    // 7. Check balances and nonce after tx
    expect(await state.getBalance(alice.getAddress())).toBe(5);
    expect(await state.getBalance(bob.getAddress())).toBe(5);
    expect(await state.getNonce(alice.getAddress())).toBe(1);

    // 8. Clear mempool and check it's empty
    await mempool.clear();
    const cleared = await mempool.getTransactions();
    expect(cleared.length).toBe(0);
  });

  it('rejects transaction with wrong nonce', async () => {
    await state.credit(alice.getAddress(), 10);

    const badTx = new Transaction(alice.getAddress(), bob.getAddress(), 5, 999);
    badTx.sign(alice);

    const result = await state.applyTransaction(badTx);
    expect(result).toBe(false);
    expect(await state.getBalance(alice.getAddress())).toBe(10);
    expect(await state.getBalance(bob.getAddress())).toBe(0);
  });
});
