import { Blockchain } from '../blockchain';
import { Mempool } from '../mempool';
import { Miner } from '../miner';
import { State } from '../state';
import { NODE_ID } from './config';
export class Node {
  blockchain: Blockchain;
  state: State;
  mempool: Mempool;
  miner: Miner;

  constructor(public id: string = NODE_ID) {
    this.blockchain = new Blockchain();
    this.state = new State();
    this.mempool = new Mempool();
    this.miner = new Miner(this.blockchain, this.mempool, this.state, '');
  }

  async start() {
    // TODO: load peers, start API server
    console.log(`🟢 Node ${this.id} started`);
    const peers = process.env.PEERS?.split(',') || [];
    console.log(`🔄 Peers: ${peers}`);
  }
}
