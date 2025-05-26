import { Block } from '../block';
import { Blockchain } from '../blockchain';
import { PEERS } from './config';

export async function syncChain(blockchain: Blockchain) {
  await new Promise((r) => setTimeout(r, 5000)); // wait for peers to come up
  for (const peer of PEERS) {
    await trySyncWithPeer(peer, blockchain);
  }
}

async function trySyncWithPeer(peer: string, blockchain: Blockchain, retries = 3) {
  try {
    const res = await fetch(`${peer}/chain`);
    if (!res.ok) throw new Error(`Non-200 response`);

    const peerChainRaw = await res.json();
    const peerChain: Block[] = peerChainRaw.map(
      (block: any) =>
        new Block(
          block.index,
          block.timestamp,
          block.transactions,
          block.previousHash,
          block.nonce,
        ),
    );

    const currentChain = await blockchain.getChain();
    if (peerChain.length > currentChain.length) {
      const temp = new Blockchain();
      for (const block of peerChain) {
        await temp.addBlock(block);
      }
      if (await temp.isValidChain()) {
        console.log(`🔄 Replacing chain with longer valid chain from ${peer}`);
        await blockchain.replaceChain(peerChain);
      }
    }
  } catch (err) {
    console.warn(`❌ Failed to sync with ${peer}:`, err);
    if (retries > 0) {
      setTimeout(() => trySyncWithPeer(peer, blockchain, retries - 1), 5000);
    }
  }
}
