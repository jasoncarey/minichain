import { Block } from '../block';
import { Blockchain } from '../blockchain';
import { Mempool } from '../mempool';
import { Miner } from '../miner';
import { State } from '../state';
import { Transaction } from '../transaction';
import { NODE_ID } from './config';
export class Node {
  blockchain: Blockchain;
  state: State;
  mempool: Mempool;
  miner: Miner;
  peers: string[];

  constructor(public id: string = NODE_ID) {
    this.blockchain = new Blockchain();
    this.state = new State();
    this.mempool = new Mempool();
    this.miner = new Miner(this.blockchain, this.mempool, this.state, '');
    this.peers = process.env.PEERS?.split(',') || [];
  }

  async start() {
    console.log(`🟢 Node ${this.id} started`);
    console.log(`🔄 Peers: ${this.peers}`);
  }

  async broadcastBlock(block: Block): Promise<void> {
    for (const peer of this.peers) {
      try {
        await fetch(`${peer}/block`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(block),
        });
      } catch (err) {
        console.warn(`❌ Failed to send block to ${peer}:`, err);
      }
    }
  }

  async broadcastTransaction(tx: Transaction): Promise<void> {
    for (const peer of this.peers) {
      try {
        await fetch(`${peer}/transaction`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tx),
        });
      } catch (err) {
        console.warn(`❌ Failed to send transaction to ${peer}:`, err);
      }
    }
  }
}
