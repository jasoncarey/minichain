import { Block } from './block';

/**
 * Responsible for:
 * - Storing the blockchain
 * - Adding new blocks to the blockchain
 * - Verifying the integrity of the blockchain
 * - Creating the genesis block
 */
export class Blockchain {
  public chain: Block[];

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  private createGenesisBlock(): Block {
    return new Block(0, Date.now(), [], '');
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  public addBlock(newBlock: Block): void {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mine(2);
    this.chain.push(newBlock);
  }

  public isValidChain(): Boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      const recomputedHash = currentBlock.calculateHash();
      if (currentBlock.hash !== recomputedHash) {
        return false;
      }
    }
    return true;
  }
}
