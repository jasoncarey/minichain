export const NODE_ID = process.env.NODE_ID || 'node-1';
export const DB_PATH = process.env.DB_PATH || `./data/${NODE_ID}.sqlite`;
export const HTTP_PORT = Number(process.env.HTTP_PORT) || 3001;
export const PEERS = process.env.PEERS?.split(',').map((peer) => peer.trim()) || [];
