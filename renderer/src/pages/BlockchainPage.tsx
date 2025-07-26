import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Blocks,
  Search,
  ChevronLeft,
  ChevronRight,
  Hash,
  Clock,
  User,
  TrendingUp,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Mock blockchain data
const mockBlocks = Array.from({ length: 20 }, (_, i) => ({
  height: 1247 - i,
  hash: `0x${Math.random().toString(16).substr(2, 8)}...`,
  previousHash: `0x${Math.random().toString(16).substr(2, 8)}...`,
  timestamp: new Date(Date.now() - i * 10 * 60 * 1000).toLocaleString(),
  miner: `Node ${(i % 3) + 1}`,
  txCount: Math.floor(Math.random() * 20) + 1,
  size: `${(Math.random() * 500 + 100).toFixed(0)} KB`,
  difficulty: '2.1T',
  nonce: Math.floor(Math.random() * 1000000),
  merkleRoot: `0x${Math.random().toString(16).substr(2, 8)}...`,
  transactions: Array.from({ length: Math.floor(Math.random() * 10) + 1 }, () => ({
    hash: `0x${Math.random().toString(16).substr(2, 8)}...`,
    from: `0x${Math.random().toString(16).substr(2, 4)}...`,
    to: `0x${Math.random().toString(16).substr(2, 4)}...`,
    amount: (Math.random() * 10).toFixed(4),
    fee: (Math.random() * 0.01).toFixed(6),
    type: Math.random() > 0.5 ? 'transfer' : 'coinbase',
  })),
}));

export default function BlockchainPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showTransactions, setShowTransactions] = useState<{ [key: number]: boolean }>({});
  const blocksPerPage = 10;

  const filteredBlocks = mockBlocks.filter(
    (block) =>
      block.height.toString().includes(searchTerm) ||
      block.hash.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const paginatedBlocks = filteredBlocks.slice(
    (currentPage - 1) * blocksPerPage,
    currentPage * blocksPerPage,
  );

  const totalPages = Math.ceil(filteredBlocks.length / blocksPerPage);

  const toggleTransactions = (blockHeight: number) => {
    setShowTransactions((prev) => ({
      ...prev,
      [blockHeight]: !prev[blockHeight],
    }));
  };

  return (
    <div className="min-h-screen bg-tokyonight-bg">
      {/* Header */}
      <header className="border-b bg-tokyonight-bgHighlight border-tokyonight-fgGutter">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Blocks className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Blockchain Explorer</h1>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link to="/blockchain">
                <Button variant="default">Blockchain</Button>
              </Link>
              <Link to="/mempool">
                <Button variant="ghost">Mempool</Button>
              </Link>
              <Link to="/wallet">
                <Button variant="ghost">Wallets</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Search and Controls */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by block height or hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-tokyonight-terminal border-tokyonight-fgGutter focus:border-tokyonight-purple"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredBlocks.length} blocks
            </div>
          </div>
        </div>

        {/* Blockchain Visualization */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Blockchain Structure</h2>
          <div className="space-y-4">
            {paginatedBlocks.map((block, index) => (
              <div key={block.height} className="relative">
                {/* Connection Line */}
                {index < paginatedBlocks.length - 1 && (
                  <div className="absolute left-1/2 top-full w-0.5 h-4 bg-tokyonight-purple transform -translate-x-1/2 z-0" />
                )}

                <Card className="relative z-10 bg-tokyonight-bgHighlight border-tokyonight-fgGutter hover:border-tokyonight-cyan/50 transition-all gradient-blue">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-tokyonight-purple/20 rounded-lg">
                          <Blocks className="h-6 w-6 text-tokyonight-purple" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">Block #{block.height}</CardTitle>
                          <CardDescription className="font-mono text-xs">
                            {block.hash}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleTransactions(block.height)}
                        >
                          {showTransactions[block.height] ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Hide Transactions
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Show Transactions
                            </>
                          )}
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-tokyonight-bgHighlight border-tokyonight-fgGutter">
                            <DialogHeader>
                              <DialogTitle>Block #{block.height} Details</DialogTitle>
                              <DialogDescription>
                                Complete information about this block
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Hash
                                </label>
                                <p className="font-mono text-sm break-all">{block.hash}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Previous Hash
                                </label>
                                <p className="font-mono text-sm break-all">{block.previousHash}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Merkle Root
                                </label>
                                <p className="font-mono text-sm break-all">{block.merkleRoot}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Nonce
                                </label>
                                <p className="text-sm">{block.nonce}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Difficulty
                                </label>
                                <p className="text-sm">{block.difficulty}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Size
                                </label>
                                <p className="text-sm">{block.size}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">Timestamp</div>
                          <div className="text-sm font-medium">{block.timestamp}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">Miner</div>
                          <div className="text-sm font-medium">{block.miner}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">Transactions</div>
                          <div className="text-sm font-medium">{block.txCount}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">Size</div>
                          <div className="text-sm font-medium">{block.size}</div>
                        </div>
                      </div>
                    </div>

                    {/* Previous Block Connection */}
                    {index < paginatedBlocks.length - 1 && (
                      <div className="flex items-center justify-center py-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <span>Previous:</span>
                          <span className="font-mono">{block.previousHash}</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    )}

                    {/* Transactions */}
                    {showTransactions[block.height] && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="font-medium mb-3">
                          Transactions ({block.transactions.length})
                        </h4>
                        <div className="space-y-2">
                          {block.transactions.map((tx, txIndex) => (
                            <div
                              key={txIndex}
                              className="flex items-center justify-between p-3 bg-tokyonight-terminal rounded-lg border border-tokyonight-fgGutter hover:border-tokyonight-cyan/50 transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-background rounded">
                                  <TrendingUp className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <div className="font-mono text-sm">{tx.hash}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {tx.type === 'coinbase'
                                      ? 'Coinbase Transaction'
                                      : `${tx.from} → ${tx.to}`}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">{tx.amount} MINI</div>
                                <div className="text-xs text-muted-foreground">
                                  Fee: {tx.fee} MINI
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter hover:bg-tokyonight-purple/20 hover:border-tokyonight-purple"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter hover:bg-tokyonight-purple/20 hover:border-tokyonight-purple"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
