import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Hash, Users, Coins, ArrowRight, RefreshCw } from 'lucide-react';

// Mock blockchain data
const mockBlocks = [
  {
    id: 1,
    hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
    previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    timestamp: new Date('2024-01-15T10:30:00Z'),
    nonce: 12345,
    difficulty: 4,
    transactions: [
      {
        id: 'tx1',
        hash: '0xabc123def456789012345678901234567890123456789012345678901234567890',
        from: '0x1234567890123456789012345678901234567890',
        to: '0x0987654321098765432109876543210987654321',
        amount: 10.5,
        fee: 0.001,
        timestamp: new Date('2024-01-15T10:29:45Z'),
      },
      {
        id: 'tx2',
        hash: '0xdef456abc789012345678901234567890123456789012345678901234567890123',
        from: '0x2345678901234567890123456789012345678901',
        to: '0x1987654321098765432109876543210987654321',
        amount: 5.25,
        fee: 0.001,
        timestamp: new Date('2024-01-15T10:29:50Z'),
      },
    ],
  },
  {
    id: 2,
    hash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    previousHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
    timestamp: new Date('2024-01-15T10:35:00Z'),
    nonce: 67890,
    difficulty: 4,
    transactions: [
      {
        id: 'tx3',
        hash: '0x789012def456abc123456789012345678901234567890123456789012345678901',
        from: '0x3456789012345678901234567890123456789012',
        to: '0x2987654321098765432109876543210987654321',
        amount: 15.75,
        fee: 0.002,
        timestamp: new Date('2024-01-15T10:34:30Z'),
      },
    ],
  },
  {
    id: 3,
    hash: '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
    previousHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    timestamp: new Date('2024-01-15T10:40:00Z'),
    nonce: 54321,
    difficulty: 4,
    transactions: [
      {
        id: 'tx4',
        hash: '0x456789abc123def456789012345678901234567890123456789012345678901234',
        from: '0x4567890123456789012345678901234567890123',
        to: '0x3987654321098765432109876543210987654321',
        amount: 8.33,
        fee: 0.001,
        timestamp: new Date('2024-01-15T10:39:15Z'),
      },
      {
        id: 'tx5',
        hash: '0x567890def123abc456789012345678901234567890123456789012345678901234',
        from: '0x5678901234567890123456789012345678901234',
        to: '0x4987654321098765432109876543210987654321',
        amount: 22.1,
        fee: 0.002,
        timestamp: new Date('2024-01-15T10:39:45Z'),
      },
    ],
  },
];

const mockMempool = [
  {
    id: 'pending1',
    hash: '0xpending123456789012345678901234567890123456789012345678901234567890',
    from: '0x6789012345678901234567890123456789012345',
    to: '0x5987654321098765432109876543210987654321',
    amount: 12.5,
    fee: 0.003,
    timestamp: new Date('2024-01-15T10:42:00Z'),
    status: 'pending',
  },
  {
    id: 'pending2',
    hash: '0xpending789012345678901234567890123456789012345678901234567890123456',
    from: '0x7890123456789012345678901234567890123456',
    to: '0x6987654321098765432109876543210987654321',
    amount: 7.25,
    fee: 0.002,
    timestamp: new Date('2024-01-15T10:41:30Z'),
    status: 'pending',
  },
  {
    id: 'pending3',
    hash: '0xpending345678901234567890123456789012345678901234567890123456789012',
    from: '0x8901234567890123456789012345678901234567',
    to: '0x7987654321098765432109876543210987654321',
    amount: 3.75,
    fee: 0.001,
    timestamp: new Date('2024-01-15T10:41:00Z'),
    status: 'pending',
  },
];

function formatHash(hash: string, length = 8) {
  return `${hash.slice(0, length)}...${hash.slice(-6)}`;
}

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function BlockchainExplorer() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blockchain Explorer</h1>
            <p className="text-muted-foreground">
              Monitor your local blockchain network and transaction pool
            </p>
          </div>
          <Button onClick={handleRefresh} disabled={refreshing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="blocks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="blocks">Blockchain</TabsTrigger>
            <TabsTrigger value="mempool">Mempool</TabsTrigger>
          </TabsList>

          <TabsContent value="blocks" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Blocks</CardTitle>
                  <Hash className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockBlocks.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockBlocks.reduce((acc, block) => acc + block.transactions.length, 0)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Latest Block</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">#{mockBlocks[mockBlocks.length - 1]?.id}</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Blocks</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {mockBlocks.reverse().map((block) => (
                  <AccordionItem
                    key={block.id}
                    value={`block-${block.id}`}
                    className="border rounded-lg"
                  >
                    <Card>
                      <AccordionTrigger className="hover:no-underline p-0">
                        <CardHeader className="w-full">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                              <Badge variant="secondary" className="text-sm px-3 py-1">
                                Block #{block.id}
                              </Badge>
                              <div className="text-left space-y-1">
                                <CardTitle className="text-base font-mono">
                                  {formatHash(block.hash, 12)}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                  {block.timestamp.toLocaleString()}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="text-right space-y-1 text-sm">
                              <div className="flex items-center gap-4">
                                <div className="text-muted-foreground">
                                  <span className="font-medium">Prev:</span>{' '}
                                  {formatHash(block.previousHash, 8)}
                                </div>
                                <div className="text-muted-foreground">
                                  <span className="font-medium">Nonce:</span>{' '}
                                  {block.nonce.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Users className="h-4 w-4" />
                                  {block.transactions.length} txs
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardContent className="pt-0">
                          <div className="grid gap-4 mb-4 text-sm">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <span className="font-medium">Full Hash:</span>
                                <p className="text-muted-foreground font-mono text-xs break-all">
                                  {block.hash}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium">Previous Hash:</span>
                                <p className="text-muted-foreground font-mono text-xs break-all">
                                  {block.previousHash}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium">Difficulty:</span>
                                <p className="text-muted-foreground">{block.difficulty}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium">
                              Transactions ({block.transactions.length})
                            </h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Hash</TableHead>
                                  <TableHead>From</TableHead>
                                  <TableHead>To</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Fee</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {block.transactions.map((tx) => (
                                  <TableRow key={tx.id}>
                                    <TableCell className="font-mono">
                                      {formatHash(tx.hash, 6)}
                                    </TableCell>
                                    <TableCell className="font-mono">
                                      {formatAddress(tx.from)}
                                    </TableCell>
                                    <TableCell className="font-mono">
                                      {formatAddress(tx.to)}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-1">
                                        <Coins className="h-3 w-3" />
                                        {tx.amount}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                      {tx.fee}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value="mempool" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockMempool.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  <Coins className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockMempool.reduce((acc, tx) => acc + tx.amount, 0).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockMempool.reduce((acc, tx) => acc + tx.fee, 0).toFixed(3)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Pending Transactions</CardTitle>
                <CardDescription>
                  Transactions waiting to be included in the next block
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hash</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMempool.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-mono">{formatHash(tx.hash, 6)}</TableCell>
                        <TableCell className="font-mono">{formatAddress(tx.from)}</TableCell>
                        <TableCell className="font-mono">{formatAddress(tx.to)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Coins className="h-3 w-3" />
                            {tx.amount}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{tx.fee}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                          >
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {tx.timestamp.toLocaleTimeString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
