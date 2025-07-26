import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Clock,
  TrendingUp,
  Search,
  Zap,
  AlertCircle,
  CheckCircle,
  Hash,
  Coins,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock mempool data for each node
const mockMempoolData = {
  node1: {
    name: 'Node 1',
    status: 'online',
    totalTx: 45,
    totalSize: '2.3 MB',
    avgFee: '0.00012 MINI',
    transactions: Array.from({ length: 45 }, (_, i) => ({
      hash: `0x${Math.random().toString(16).substr(2, 8)}...`,
      from: `0x${Math.random().toString(16).substr(2, 4)}...`,
      to: `0x${Math.random().toString(16).substr(2, 4)}...`,
      amount: (Math.random() * 10).toFixed(4),
      fee: (Math.random() * 0.01).toFixed(6),
      feeRate: (Math.random() * 100 + 10).toFixed(0),
      size: Math.floor(Math.random() * 500 + 200),
      priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      timeInMempool: Math.floor(Math.random() * 3600),
      confirmations: 0,
    })),
  },
  node2: {
    name: 'Node 2',
    status: 'online',
    totalTx: 38,
    totalSize: '1.9 MB',
    avgFee: '0.00015 MINI',
    transactions: Array.from({ length: 38 }, (_, i) => ({
      hash: `0x${Math.random().toString(16).substr(2, 8)}...`,
      from: `0x${Math.random().toString(16).substr(2, 4)}...`,
      to: `0x${Math.random().toString(16).substr(2, 4)}...`,
      amount: (Math.random() * 10).toFixed(4),
      fee: (Math.random() * 0.01).toFixed(6),
      feeRate: (Math.random() * 100 + 10).toFixed(0),
      size: Math.floor(Math.random() * 500 + 200),
      priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      timeInMempool: Math.floor(Math.random() * 3600),
      confirmations: 0,
    })),
  },
  node3: {
    name: 'Node 3',
    status: 'syncing',
    totalTx: 32,
    totalSize: '1.6 MB',
    avgFee: '0.00010 MINI',
    transactions: Array.from({ length: 32 }, (_, i) => ({
      hash: `0x${Math.random().toString(16).substr(2, 8)}...`,
      from: `0x${Math.random().toString(16).substr(2, 4)}...`,
      to: `0x${Math.random().toString(16).substr(2, 4)}...`,
      amount: (Math.random() * 10).toFixed(4),
      fee: (Math.random() * 0.01).toFixed(6),
      feeRate: (Math.random() * 100 + 10).toFixed(0),
      size: Math.floor(Math.random() * 500 + 200),
      priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      timeInMempool: Math.floor(Math.random() * 3600),
      confirmations: 0,
    })),
  },
};

export default function MempoolPage() {
  const [selectedNode, setSelectedNode] = useState('node1');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('fee');

  const currentNodeData = mockMempoolData[selectedNode as keyof typeof mockMempoolData];

  const filteredTransactions = currentNodeData.transactions
    .filter(
      (tx) =>
        tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.to.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((tx) => priorityFilter === 'all' || tx.priority === priorityFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'fee':
          return Number.parseFloat(b.fee) - Number.parseFloat(a.fee);
        case 'feeRate':
          return Number.parseFloat(b.feeRate) - Number.parseFloat(a.feeRate);
        case 'time':
          return a.timeInMempool - b.timeInMempool;
        case 'size':
          return b.size - a.size;
        default:
          return 0;
      }
    });

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  return (
    <div className="min-h-screen bg-tokyonight-bg">
      {/* Header */}
      <header className="border-b bg-tokyonight-bgHighlight border-tokyonight-fgGutter">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Mempool Explorer</h1>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link to="/blockchain">
                <Button variant="ghost">Blockchain</Button>
              </Link>
              <Link to="/mempool">
                <Button variant="default">Mempool</Button>
              </Link>
              <Link to="/wallet">
                <Button variant="ghost">Wallets</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Node Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Node Mempool Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {Object.entries(mockMempoolData).map(([nodeKey, nodeData]) => (
              <Card
                key={nodeKey}
                className={`cursor-pointer transition-all bg-tokyonight-bgHighlight border-tokyonight-fgGutter hover:border-tokyonight-cyan/50 ${
                  selectedNode === nodeKey ? 'ring-2 ring-tokyonight-purple glow-purple' : ''
                }`}
                onClick={() => setSelectedNode(nodeKey)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{nodeData.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {nodeData.status === 'online' ? (
                        <CheckCircle className="h-4 w-4 text-tokyonight-green" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-tokyonight-yellow" />
                      )}
                      <Badge variant={nodeData.status === 'online' ? 'default' : 'secondary'}>
                        {nodeData.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pending Transactions:</span>
                    <span className="font-medium">{nodeData.totalTx}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Size:</span>
                    <span className="font-medium">{nodeData.totalSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Fee:</span>
                    <span className="font-medium">{nodeData.avgFee}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32 bg-tokyonight-terminal border-tokyonight-fgGutter">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 bg-tokyonight-terminal border-tokyonight-fgGutter">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fee">Fee</SelectItem>
                  <SelectItem value="feeRate">Fee Rate</SelectItem>
                  <SelectItem value="time">Time</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredTransactions.length} of {currentNodeData.totalTx} transactions
            </div>
          </div>
        </div>

        {/* Mempool Overview */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">{currentNodeData.name} Mempool</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter gradient-purple">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentNodeData.totalTx}</div>
                <p className="text-xs text-muted-foreground">Pending confirmation</p>
              </CardContent>
            </Card>

            <Card className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter gradient-purple">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Size</CardTitle>
                <Hash className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentNodeData.totalSize}</div>
                <p className="text-xs text-muted-foreground">Memory usage</p>
              </CardContent>
            </Card>

            <Card className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter gradient-purple">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Fee</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentNodeData.avgFee}</div>
                <p className="text-xs text-muted-foreground">Per transaction</p>
              </CardContent>
            </Card>

            <Card className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter gradient-purple">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentNodeData.transactions.filter((tx) => tx.priority === 'high').length}
                </div>
                <p className="text-xs text-muted-foreground">Fast confirmation</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transaction List */}
        <Card className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter">
          <CardHeader>
            <CardTitle>Pending Transactions</CardTitle>
            <CardDescription>Transactions waiting to be included in the next block</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((tx, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-tokyonight-fgGutter rounded-lg hover:bg-tokyonight-terminal hover:border-tokyonight-purple/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-mono text-sm font-medium">{tx.hash}</div>
                      <div className="text-xs text-muted-foreground">
                        {tx.from} → {tx.to}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          className={` ${
                            tx.priority === 'high'
                              ? 'bg-tokyonight-red/20 text-tokyonight-red'
                              : tx.priority === 'medium'
                              ? 'bg-tokyonight-yellow/20 text-tokyonight-yellow'
                              : 'bg-tokyonight-green/20 text-tokyonight-green'
                          }`}
                          variant={getPriorityVariant(tx.priority)}
                        >
                          {tx.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(tx.timeInMempool)} in mempool
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{tx.amount} MINI</div>
                    <div className="text-xs text-muted-foreground">Fee: {tx.fee} MINI</div>
                    <div className="text-xs text-muted-foreground">
                      {tx.feeRate} sat/vB • {tx.size} bytes
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No transactions found matching your criteria
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
