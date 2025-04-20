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

  public mineBlock(): Block {
    const transactions = this.mempool.getTransactions();
    const validTxs: Transaction[] = [];
    for (const tx of transactions) {
      if (this.state.applyTransaction(tx)) {
        validTxs.push(tx);
      }
    }

    const rewardTx: Transaction = new Transaction('', this.rewardAddress, Miner.COINBASE_REWARD, 0);
    validTxs.unshift(rewardTx);
    this.state.credit(this.rewardAddress, Miner.COINBASE_REWARD);

    const newBlock = new Block(
      this.blockchain.getLatestBlock().index + 1,
      Date.now(),
      validTxs,
      this.blockchain.getLatestBlock().hash,
    );

    this.blockchain.addBlock(newBlock);

    this.mempool.clear();

    return newBlock;
  }
}
