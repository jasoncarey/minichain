import { ec as EC } from 'elliptic';
import { calculateHash } from './utils';

const ec = new EC('secp256k1');

/**
 * Responsible for:
 *   - generating a keypair
 *   - returning its address
 *   - signing arbitrary messages
 */
export class Wallet {
  private keypair: EC.KeyPair;

  constructor() {
    this.keypair = ec.genKeyPair();
  }

  public getAddress(): string {
    return this.keypair.getPublic('hex');
  }
  public sign(data: string): string {
    if (!data || typeof data !== 'string') {
      throw new Error('Cannot sign empty or invalid data');
    }
    const dataHash = calculateHash(data);
    return this.keypair.sign(dataHash, 'hex').toDER('hex');
  }
  public static verifySignature(data: string, signature: string, publicKey: string): boolean {
    const key = ec.keyFromPublic(publicKey, 'hex');
    const dataHash = calculateHash(data);
    return key.verify(dataHash, signature);
  }
}
