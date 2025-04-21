import { Command } from 'commander';
import { Wallet } from './wallet';
import { State } from './state';
import { Transaction } from './transaction';
import { Mempool } from './mempool';
import { Miner } from './miner';
import { Blockchain } from './blockchain';

const program = new Command();
const blockchain = new Blockchain();
const state = new State();
const mempool = new Mempool();
const minerInstance = new Miner(blockchain, mempool, state, '');

program.name('minichain').description('A minimal blockchain CLI').version('0.1.0');

program
  .command('wallet:create')
  .description('Generate a new wallet')
  .action(() => {
    const wallet = new Wallet();
    const address = wallet.getAddress();
    const privateKey = wallet.getPrivateKey();

    console.log('🪪 Wallet created!');
    console.log('Address:', address);
    console.log('Private key (DO NOT SHARE):', privateKey);
  });

program
  .command('wallet:balance')
  .argument('<address>', 'wallet address')
  .action((address: string) => {
    const balance = state.getBalance(address);
    console.log(`💰 Balance of ${address}: ${balance}`);
  });

program
  .command('tx:send')
  .requiredOption('--from <address>', 'Sender address')
  .requiredOption('--to <address>', 'Recipient address')
  .requiredOption('--amount <number>', 'Amount to send')
  .requiredOption('--privkey <key>', 'Sender private key (hex)')
  .description('Create and submit a transaction')
  .action((opts) => {
    const { from, to, amount, privkey } = opts;
    const wallet = Wallet.fromPrivateKey(privkey);
    const nonce = state.getNonce(from);
    const tx = new Transaction(from, to, Number(amount), nonce);
    tx.sign(wallet);

    mempool.add(tx);
    console.log('✅ Transaction added to mempool.');
  });

program
  .command('mine')
  .requiredOption('--miner <address>', 'Address to receive mining reward')
  .description('Mine a new block with transactions from the mempool')
  .action((opts) => {
    const { miner } = opts;
    minerInstance.rewardAddress = miner;

    const block = minerInstance.mineBlock();
    console.log('⛏️  Block mined!');
    console.log(`Index: ${block.index}`);
    console.log(`Hash: ${block.hash}`);
    console.log(`Transactions: ${block.transactions.length}`);

    console.log(`💰 New balance for ${miner}: ${state.getBalance(miner)}`);
  });

program.parse();
