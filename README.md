# 🪙 MiniChain

A minimal, educational cryptocurrency and blockchain built from scratch in TypeScript.

## ⚙️ Features

- Account-based blockchain (like Ethereum)
- ECC wallet generation (secp256k1)
- Transaction signing & signature verification
- Mempool for pending transactions
- Mining with proof-of-work (adjustable difficulty)
- Coinbase reward system
- Global account state with balance and nonce tracking
- Basic transaction validation (signatures, balance, nonce)
- Fully tested with Vitest

---

## 🧪 Example Flow (Tested)

1. 🧑‍💼 Create wallets for users (`alice`, `bob`)
2. ⛏️ Mine a block with `alice` as the miner → she receives reward
3. 💸 `alice` sends coins to `bob` via a signed transaction
4. ⛏️ Mine again → transaction is confirmed, balances updated
5. 🔒 Transactions with reused or invalid nonces are rejected

---

## 📁 Project Structure
src/
├── block.ts         # Block structure + hashing + mining
├── blockchain.ts    # Chain management + validation
├── transaction.ts   # Transaction model + signing/verification
├── wallet.ts        # Keypair generation, signing, address
├── mempool.ts       # Pending transaction queue
├── state.ts         # Account balances and nonce tracking
├── miner.ts         # Block creation with transaction application
└── utils.ts         # SHA-256 hash helper
tests/
└── miner.test.ts    # End-to-end validation using Vitest
└── state.test.ts    # End-to-end validation using Vitest

---

## 🧰 Stack

- Language: TypeScript
- Cryptography: [`elliptic`](https://www.npmjs.com/package/elliptic) (`secp256k1`)
- Hashing: Node.js `crypto` (SHA-256)
- Testing: [`vitest`](https://vitest.dev)

---

## 🚀 Coming Soon

- CLI interface for sending, mining, checking balances
- JSON persistence of blockchain & state
- Optional Express API
- Contract system (e.g. time-locked transactions)

---

## 🧠 Why This Exists

This project is designed to deeply understand how cryptocurrencies and blockchains work under the hood — without any frameworks or SDKs. It's educational, testable, and extensible.

---

## 📝 License

MIT