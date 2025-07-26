import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Blocks,
  Clock,
  Hash,
  Network,
  TrendingUp,
  Zap,
  Circle,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlockchainStatus {
  status: 'starting' | 'ready' | 'error' | 'stopping' | 'stopped' | 'idle';
  message: string;
}

// Mock data - replace with actual blockchain data
const mockNodes = [
  { id: 1, name: 'Node 1', status: 'online', blockHeight: 1247, peers: 8, syncProgress: 100 },
  { id: 2, name: 'Node 2', status: 'online', blockHeight: 1247, peers: 6, syncProgress: 100 },
  { id: 3, name: 'Node 3', status: 'syncing', blockHeight: 1245, peers: 4, syncProgress: 87 },
];

const mockRecentBlocks = [
  { height: 1247, hash: '0x7f9a2b8c...', timestamp: '2 min ago', txCount: 12, miner: 'Node 1' },
  { height: 1246, hash: '0x3e8d1a5f...', timestamp: '5 min ago', txCount: 8, miner: 'Node 2' },
  { height: 1245, hash: '0x9c4b7e2a...', timestamp: '8 min ago', txCount: 15, miner: 'Node 1' },
  { height: 1244, hash: '0x1a6f8d3c...', timestamp: '12 min ago', txCount: 6, miner: 'Node 3' },
];

const mockRecentTransactions = [
  {
    hash: '0xa1b2c3d4...',
    from: '0x1234...',
    to: '0x5678...',
    amount: '2.5 MINI',
    fee: '0.001',
    status: 'confirmed',
  },
  {
    hash: '0xe5f6g7h8...',
    from: '0x9abc...',
    to: '0xdef0...',
    amount: '1.2 MINI',
    fee: '0.0008',
    status: 'confirmed',
  },
  {
    hash: '0xi9j0k1l2...',
    from: '0x3456...',
    to: '0x789a...',
    amount: '0.8 MINI',
    fee: '0.0012',
    status: 'pending',
  },
];

function BlockchainStatusIndicator() {
  const [status, setStatus] = useState<BlockchainStatus>({
    status: 'idle',
    message: 'Initializing...',
  });

  useEffect(() => {
    console.log('🎯 Setting up blockchain status listener...');
    if (window.blockchain) {
      console.log('✅ window.blockchain is available');
      window.blockchain.onStatusUpdate((newStatus) => {
        console.log('📨 Received blockchain status update:', newStatus);
        setStatus(newStatus as BlockchainStatus);
      });

      return () => {
        console.log('🧹 Cleaning up blockchain status listener');
        window.blockchain.removeStatusListener();
      };
    } else {
      console.log('❌ window.blockchain is not available');
    }
  }, []);

  const getStatusColor = () => {
    switch (status.status) {
      case 'ready':
        return 'text-tokyonight-green';
      case 'starting':
        return 'text-tokyonight-yellow';
      case 'error':
        return 'text-tokyonight-red';
      case 'stopping':
        return 'text-tokyonight-yellow';
      case 'stopped':
        return 'text-gray-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusEmoji = () => {
    switch (status.status) {
      case 'ready':
        return '✅';
      case 'starting':
        return '🔄';
      case 'error':
        return '❌';
      case 'stopping':
        return '⏹️';
      case 'stopped':
        return '⏸️';
      default:
        return '⚪';
    }
  };

  return (
    <Card className="mb-6 bg-tokyonight-bgHighlight border-tokyonight-fgGutter">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '16px' }}>{getStatusEmoji()}</span>
          <div>
            <div className={`font-bold ${getStatusColor()} text-sm uppercase`}>
              Blockchain Nodes: {status.status}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{status.message}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HomePage() {
  const networkStats = {
    totalBlocks: 1247,
    totalTransactions: 15420,
    hashRate: '125.4 TH/s',
    difficulty: '2.1T',
    avgBlockTime: '10.2 min',
    networkNodes: 3,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-tokyonight-green" />;
      case 'syncing':
        return <AlertCircle className="h-4 w-4 text-tokyonight-yellow" />;
      default:
        return <Circle className="h-4 w-4 text-tokyonight-red" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-tokyonight-green';
      case 'syncing':
        return 'bg-tokyonight-yellow';
      default:
        return 'bg-tokyonight-red';
    }
  };

  return (
    <div className="min-h-screen bg-tokyonight-bg">
      {/* Header */}
      <header className="border-b bg-tokyonight-bgHighlight border-tokyonight-fgGutter">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Blocks className="h-8 w-8 text-tokyonight-purple" />
                <h1 className="text-2xl font-bold">Minichain Explorer</h1>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Link to="/">
                <Button
                  variant="ghost"
                  className="hover:bg-tokyonight-terminal hover:text-tokyonight-purple"
                >
                  Home
                </Button>
              </Link>
              <Link to="/blockchain">
                <Button
                  variant="ghost"
                  className="hover:bg-tokyonight-terminal hover:text-tokyonight-purple"
                >
                  Blockchain
                </Button>
              </Link>
              <Link to="/mempool">
                <Button
                  variant="ghost"
                  className="hover:bg-tokyonight-terminal hover:text-tokyonight-purple"
                >
                  Mempool
                </Button>
              </Link>
              <Link to="/wallet">
                <Button
                  variant="ghost"
                  className="hover:bg-tokyonight-terminal hover:text-tokyonight-purple"
                >
                  Wallet
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Blockchain Status Indicator */}
        <BlockchainStatusIndicator />

        {/* Network Overview */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Network Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter hover:border-tokyonight-purple/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Blocks</CardTitle>
                <Blocks className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {networkStats.totalBlocks.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">+12 from last hour</p>
              </CardContent>
            </Card>

            <Card className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter hover:border-tokyonight-purple/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {networkStats.totalTransactions.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">+47 from last hour</p>
              </CardContent>
            </Card>

            <Card className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter hover:border-tokyonight-purple/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hash Rate</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{networkStats.hashRate}</div>
                <p className="text-xs text-muted-foreground">Network mining power</p>
              </CardContent>
            </Card>

            <Card className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter hover:border-tokyonight-purple/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Difficulty</CardTitle>
                <Hash className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{networkStats.difficulty}</div>
                <p className="text-xs text-muted-foreground">Current difficulty</p>
              </CardContent>
            </Card>

            <Card className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter hover:border-tokyonight-purple/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Block Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{networkStats.avgBlockTime}</div>
                <p className="text-xs text-muted-foreground">Last 100 blocks</p>
              </CardContent>
            </Card>

            <Card className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter hover:border-tokyonight-purple/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Nodes</CardTitle>
                <Network className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{networkStats.networkNodes}</div>
                <p className="text-xs text-muted-foreground">Connected nodes</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Node Status */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Node Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockNodes.map((node) => (
              <Card
                key={node.id}
                className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter gradient-purple"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{node.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(node.status)}
                      <Badge variant={node.status === 'online' ? 'default' : 'secondary'}>
                        {node.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Block Height:</span>
                    <span className="font-medium">{node.blockHeight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Peers:</span>
                    <span className="font-medium">{node.peers}</span>
                  </div>
                  {node.status === 'syncing' && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Sync Progress:</span>
                        <span className="font-medium">{node.syncProgress}%</span>
                      </div>
                      <Progress value={node.syncProgress} className="h-2 bg-tokyonight-terminal" />
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(node.status)}`} />
                    <span className="text-xs text-muted-foreground">
                      {node.status === 'online' ? 'Fully synced' : 'Synchronizing...'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <Tabs defaultValue="blocks" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="blocks">Recent Blocks</TabsTrigger>
              <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="blocks" className="space-y-4">
              <Card className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter">
                <CardHeader>
                  <CardTitle>Latest Blocks</CardTitle>
                  <CardDescription>Most recently mined blocks on the network</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentBlocks.map((block) => (
                      <div
                        key={block.height}
                        className="flex items-center justify-between p-4 border border-tokyonight-fgGutter rounded-lg hover:bg-tokyonight-terminal hover:border-tokyonight-purple/50 transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                            <Blocks className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Block #{block.height}</div>
                            <div className="text-sm text-muted-foreground">{block.hash}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{block.txCount} transactions</div>
                          <div className="text-xs text-muted-foreground">
                            Mined by {block.miner}
                          </div>
                          <div className="text-xs text-muted-foreground">{block.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link to="/blockchain">
                      <Button variant="outline" className="w-full bg-transparent">
                        View Full Blockchain
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <Card className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter">
                <CardHeader>
                  <CardTitle>Latest Transactions</CardTitle>
                  <CardDescription>Most recent transactions on the network</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentTransactions.map((tx) => (
                      <div
                        key={tx.hash}
                        className="flex items-center justify-between p-4 border border-tokyonight-fgGutter rounded-lg hover:bg-tokyonight-terminal hover:border-tokyonight-purple/50 transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">{tx.hash}</div>
                            <div className="text-sm text-muted-foreground">
                              {tx.from} → {tx.to}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{tx.amount}</div>
                          <div className="text-xs text-muted-foreground">Fee: {tx.fee} MINI</div>
                          <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link to="/mempool">
                      <Button variant="outline" className="w-full bg-transparent">
                        View Mempool
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
