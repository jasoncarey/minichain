import { beforeEach, describe, it, expect, beforeAll } from 'vitest';
import { Blockchain } from '../src/blockchain';
import { Mempool } from '../src/mempool';
import { State } from '../src/state';
import { Miner } from '../src/miner';
import { Wallet } from '../src/wallet';
import { Transaction } from '../src/transaction';

describe('Wallet System', () => {
  let walletA: Wallet;
  let walletB: Wallet;
  let transaction: Transaction;

  beforeAll(() => {
    walletA = new Wallet();
    walletB = new Wallet();
  });

  it('should create wallet with valid keys', () => {
    expect(walletA.getPrivateKey()).toBeDefined();
    expect(walletA.getAddress()).toBeDefined();
    expect(walletA.getPrivateKey().length).toBe(64); // 32 bytes in hex
    expect(walletA.getAddress().length).toBeGreaterThan(128);
  });

  it('should create wallet from existing private key', () => {
    const privateKey = walletA.getPrivateKey();
    const restoredWallet = Wallet.fromPrivateKey(privateKey);

    expect(restoredWallet.getAddress()).toBe(walletA.getAddress());
    expect(restoredWallet.getPrivateKey()).toBe(walletA.getPrivateKey());
  });

  it('should create and sign valid transaction', () => {
    transaction = new Transaction(
      walletA.getAddress(),
      walletB.getAddress(),
      10,
      0, // nonce
    );

    transaction.sign(walletA);

    expect(transaction.getSignature()).toBeDefined();
    expect(transaction.getSignature().length).toBeGreaterThan(0);
  });

  it('should verify valid transaction', () => {
    const isValid = Transaction.verify(transaction);
    expect(isValid).toBe(true);
  });

  it('should detect tampered transactions', () => {
    const tamperedTransaction = new Transaction(
      transaction.from,
      transaction.to,
      100, // changed amount
      transaction.nonce,
    );
    tamperedTransaction.setSignature(transaction.getSignature()); // reuse original signature

    const isValid = Transaction.verify(tamperedTransaction);
    expect(isValid).toBe(false);
  });

  it('should reject transactions with invalid signature', () => {
    const fakeTransaction = new Transaction(walletA.getAddress(), walletB.getAddress(), 10, 0);

    // Take a valid signature and corrupt it without breaking DER format (which throws)
    const validSig = transaction.getSignature();
    const corruptedSig = validSig.slice(0, -2) + '00';

    fakeTransaction.setSignature(corruptedSig);

    const isValid = Transaction.verify(fakeTransaction);
    expect(isValid).toBe(false);
  });
});
