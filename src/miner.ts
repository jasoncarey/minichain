import { Block } from './block';
import { Blockchain } from './blockchain';
import { Mempool } from './mempool';
import { State } from './state';
import { Transaction } from './transaction';

/**
 * Pull valid transactions from the mempool
 * Apply them to the state
 * Add a mining reward transaction
 * Create and mine a block
 * Add it to the blockcahin
 * Clear the mempool
 */
export class Miner {
  public blockchain: Blockchain;
  public mempool: Mempool;
  public state: State;
  public rewardAddress: string;
  public static COINBASE_REWARD: number = 1;

  constructor(blockchain: Blockchain, mempool: Mempool, state: State, rewardAddress: string) {
    this.blockchain = blockchain;
    this.mempool = mempool;
    this.state = state;
    this.rewardAddress = rewardAddress;
  }

  public async mineBlock(): Promise<Block> {
    const transactions = await this.mempool.getTransactions();
    const validTxs: Transaction[] = [];

    for (const tx of transactions) {
      try {
        if (await this.state.applyTransaction(tx)) {
          validTxs.push(tx);
        }
      } catch (error) {
        console.error('Error applying transaction:', error);
      }
    }

    validTxs.unshift(this.createCoinbaseTransaction());
    await this.state.credit(this.rewardAddress, Miner.COINBASE_REWARD);

    const latestBlock = await this.blockchain.getLatestBlock();
    const newBlock = new Block(latestBlock.index + 1, Date.now(), validTxs, latestBlock.hash);
    await this.blockchain.addBlock(newBlock);

    await this.mempool.clear();

    return newBlock;
  }

  private createCoinbaseTransaction(): Transaction {
    const tx = new Transaction('COINBASE', this.rewardAddress, Miner.COINBASE_REWARD, 0);

    tx.signCoinbase();
    return tx;
  }
}
