'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, Moon, Sun } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from 'next-themes';

interface Transaction {
  from: string;
  to: string;
  amount: number;
  nonce: number;
  signature: string;
}

interface Block {
  index: number;
  timestamp: number;
  previousHash: string;
  hash: string;
  nonce: number;
  transactions: Transaction[];
}

// Mock data for demonstration when API is unavailable
const mockBlockchainData: Block[] = [
  {
    index: 0,
    timestamp: Date.now() - 3600000 * 5,
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    hash: '000dc75a315c77a1f9c98fb6247d03dd18ac52632d7dc6a9920261d8109b37cf',
    nonce: 12345,
    transactions: [],
  },
  {
    index: 1,
    timestamp: Date.now() - 3600000 * 3,
    previousHash: '000dc75a315c77a1f9c98fb6247d03dd18ac52632d7dc6a9920261d8109b37cf',
    hash: '000af1cf2b0e5b0a464b98b5dfd3f1de43beabc28b820245c739a6ceb6e2c4f2',
    nonce: 67890,
    transactions: [
      {
        from: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        to: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
        amount: 2.5,
        nonce: 1,
        signature: '0xddd0a7290af9526056b4e35a077b9a11b513aa0028ec6c9880948544508f3c63',
      },
      {
        from: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
        to: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
        amount: 1.0,
        nonce: 2,
        signature: '0xbbb0a7290af9526056b4e35a077b9a11b513aa0028ec6c9880948544508f3c63',
      },
    ],
  },
  {
    index: 2,
    timestamp: Date.now() - 3600000,
    previousHash: '000af1cf2b0e5b0a464b98b5dfd3f1de43beabc28b820245c739a6ceb6e2c4f2',
    hash: '000f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
    nonce: 54321,
    transactions: [
      {
        from: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
        to: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        amount: 0.75,
        nonce: 3,
        signature: '0xaaa0a7290af9526056b4e35a077b9a11b513aa0028ec6c9880948544508f3c63',
      },
    ],
  },
];

export default function BlockchainExplorer() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBlocks, setExpandedBlocks] = useState<Record<number, boolean>>({});
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const fetchBlockchain = async () => {
      try {
        const response = await fetch('/chain');

        // Check content type to detect HTML responses
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error(
            'API returned HTML instead of JSON. The endpoint might not be set up correctly.',
          );
        }

        if (!response.ok) {
          throw new Error(`Error fetching blockchain: ${response.status}`);
        }

        const data = await response.json();
        setBlocks(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blockchain:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch blockchain data');

        // Load mock data for demonstration
        setBlocks(mockBlockchainData);
        setLoading(false);
      }
    };

    fetchBlockchain();
  }, []);

  const toggleBlockExpansion = (index: number) => {
    setExpandedBlocks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.toLocaleString()} (${formatDistanceToNow(date, { addSuffix: true })})`;
  };

  const truncateHash = (hash: string) => {
    if (!hash) return '';
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 10)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-gray-700 dark:text-gray-300" />
        <span className="ml-2 text-lg dark:text-gray-200">Loading blockchain data...</span>
      </div>
    );
  }

  const renderBlockchain = () => (
    <div className="space-y-6">
      {blocks.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No blocks found in the blockchain.</p>
        </div>
      ) : (
        blocks.map((block) => (
          <div
            key={block.index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <h2 className="text-xl font-semibold dark:text-white">Block #{block.index}</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                  {formatTimestamp(block.timestamp)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Hash</p>
                  <p className="font-mono text-sm break-all dark:text-gray-300">{block.hash}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Previous Hash</p>
                  <p className="font-mono text-sm break-all dark:text-gray-300">
                    {block.previousHash}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nonce</p>
                  <p className="font-mono dark:text-gray-300">{block.nonce}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Transactions</p>
                  <p className="font-mono dark:text-gray-300">{block.transactions.length}</p>
                </div>
              </div>

              <button
                onClick={() => toggleBlockExpansion(block.index)}
                className="mt-4 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {expandedBlocks[block.index] ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Hide Transactions
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show Transactions ({block.transactions.length})
                  </>
                )}
              </button>
            </div>

            {expandedBlocks[block.index] && (
              <div className="p-4 sm:p-6 bg-white dark:bg-gray-900">
                <h3 className="text-lg font-medium mb-4 dark:text-white">Transactions</h3>

                {block.transactions.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No transactions in this block.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {block.transactions.map((tx, index) => (
                      <div
                        key={index}
                        className="border border-gray-100 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
                            <p className="font-mono text-sm break-all dark:text-gray-300">
                              {tx.from}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">To</p>
                            <p className="font-mono text-sm break-all dark:text-gray-300">
                              {tx.to}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                            <p className="font-mono text-sm dark:text-gray-300">{tx.amount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Nonce</p>
                            <p className="font-mono text-sm dark:text-gray-300">{tx.nonce}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Signature</p>
                          <p className="font-mono text-sm break-all dark:text-gray-300">
                            {tx.signature}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl dark:bg-gray-900 min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center sm:text-left dark:text-white">
            Blockchain Explorer (Mock Data)
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </header>

        <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-8">
          <h2 className="text-xl font-bold text-amber-700 dark:text-amber-500 mb-2">API Error</h2>
          <p className="text-amber-600 dark:text-amber-400 mb-2">{error}</p>
          <p className="text-amber-600 dark:text-amber-400">
            Displaying mock data for demonstration purposes.
          </p>
        </div>

        {renderBlockchain()}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl dark:bg-gray-900 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center sm:text-left dark:text-white">
          Blockchain Explorer
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </header>

      {renderBlockchain()}
    </div>
  );
}
