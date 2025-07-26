import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Wallet,
  Plus,
  Send,
  Download,
  Copy,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  History,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock wallet data
const mockWallets = [
  {
    id: 1,
    name: 'Main Wallet',
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    balance: '5.24891',
    transactions: 47,
    created: '2024-01-15',
  },
  {
    id: 2,
    name: 'Mining Wallet',
    address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    balance: '12.85432',
    transactions: 23,
    created: '2024-01-20',
  },
  {
    id: 3,
    name: 'Trading Wallet',
    address: '1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71',
    balance: '0.00000',
    transactions: 0,
    created: '2024-01-25',
  },
];

const mockTransactionHistory = [
  {
    hash: '0xa1b2c3d4...',
    type: 'received',
    amount: '+2.5',
    from: '1BvBMSE...',
    timestamp: '2 hours ago',
  },
  { hash: '0xe5f6g7h8...', type: 'sent', amount: '-1.2', to: '1Lbcfr7...', timestamp: '1 day ago' },
  {
    hash: '0xi9j0k1l2...',
    type: 'received',
    amount: '+0.8',
    from: '1A1zP1e...',
    timestamp: '2 days ago',
  },
];

export default function WalletsPage() {
  const [selectedWallet, setSelectedWallet] = useState(mockWallets[0]);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [newWalletName, setNewWalletName] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-tokyonight-bg">
      {/* Header */}
      <header className="border-b bg-tokyonight-bgHighlight border-tokyonight-fgGutter">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Wallet className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Wallet Manager</h1>
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
                <Button variant="ghost">Mempool</Button>
              </Link>
              <Link to="/wallets">
                <Button variant="default">Wallets</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wallet List */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Your Wallets</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Wallet
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter">
                  <DialogHeader>
                    <DialogTitle>Create New Wallet</DialogTitle>
                    <DialogDescription>
                      Generate a new wallet with a unique address and private key
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="walletName">Wallet Name</Label>
                      <Input
                        id="walletName"
                        placeholder="Enter wallet name"
                        value={newWalletName}
                        onChange={(e) => setNewWalletName(e.target.value)}
                        className="font-mono text-sm bg-tokyonight-terminal border-tokyonight-fgGutter focus:border-tokyonight-purple"
                      />
                    </div>
                    <Button className="w-full">Create Wallet</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {mockWallets.map((wallet) => (
                <Card
                  key={wallet.id}
                  className={`cursor-pointer transition-all bg-tokyonight-bgHighlight border-tokyonight-fgGutter hover:border-tokyonight-purple/50 ${
                    selectedWallet.id === wallet.id
                      ? 'ring-2 ring-tokyonight-purple glow-purple'
                      : ''
                  }`}
                  onClick={() => setSelectedWallet(wallet)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{wallet.name}</h3>
                      <Badge variant="outline">{wallet.transactions} txs</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground font-mono mb-2">
                      {wallet.address.slice(0, 20)}...
                    </div>
                    <div className="text-lg font-bold">{wallet.balance} MINI</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Wallet Details */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Wallet Overview */}
              <Card className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter gradient-purple">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{selectedWallet.name}</CardTitle>
                      <CardDescription>Created on {selectedWallet.created}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{selectedWallet.balance} MINI</div>
                      <div className="text-sm text-muted-foreground">
                        ≈ ${(Number.parseFloat(selectedWallet.balance) * 45000).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Public Address</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          value={selectedWallet.address}
                          readOnly
                          className="font-mono text-sm bg-tokyonight-terminal border-tokyonight-fgGutter focus:border-tokyonight-purple"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(selectedWallet.address)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Private Key</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          type={showPrivateKey ? 'text' : 'password'}
                          value="L1aW4aubDFB7yfras2S1mN3bqg9nwySY8nkoLmJebSLD5BWv3ENZ"
                          readOnly
                          className="font-mono text-sm bg-tokyonight-terminal border-tokyonight-fgGutter focus:border-tokyonight-purple"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowPrivateKey(!showPrivateKey)}
                        >
                          {showPrivateKey ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard('L1aW4aubDFB7yfras2S1mN3bqg9nwySY8nkoLmJebSLD5BWv3ENZ')
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="h-20 flex-col space-y-2 bg-tokyonight-purple hover:bg-tokyonight-purple/80 glow-purple">
                      <Send className="h-6 w-6" />
                      <span>Send Minicoin</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter">
                    <DialogHeader>
                      <DialogTitle>Send Bitcoin</DialogTitle>
                      <DialogDescription>Send Bitcoin from {selectedWallet.name}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="sendAddress">Recipient Address</Label>
                        <Input
                          id="sendAddress"
                          placeholder="Enter Bitcoin address"
                          value={sendAddress}
                          onChange={(e) => setSendAddress(e.target.value)}
                          className="font-mono text-sm bg-tokyonight-terminal border-tokyonight-fgGutter focus:border-tokyonight-purple"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sendAmount">Amount (MINI)</Label>
                        <Input
                          id="sendAmount"
                          type="number"
                          step="0.00000001"
                          placeholder="0.00000000"
                          value={sendAmount}
                          onChange={(e) => setSendAmount(e.target.value)}
                          className="font-mono text-sm bg-tokyonight-terminal border-tokyonight-fgGutter focus:border-tokyonight-purple"
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Available Balance:</span>
                        <span className="font-medium">{selectedWallet.balance} MINI</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Network Fee:</span>
                        <span className="font-medium">0.00001 MINI</span>
                      </div>
                      <Button className="w-full">Send Transaction</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                  <Download className="h-6 w-6" />
                  <span>Receive Minicoin</span>
                </Button>
              </div>

              {/* Transaction History */}
              <Card className="bg-tokyonight-bgHighlight border-tokyonight-fgGutter">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Transaction History</CardTitle>
                    <Button variant="outline" size="sm">
                      <History className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTransactionHistory.map((tx, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                              tx.type === 'received'
                                ? 'bg-tokyonight-green/20'
                                : 'bg-tokyonight-red/20'
                            }`}
                          >
                            {tx.type === 'received' ? (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium capitalize">{tx.type}</div>
                            <div className="text-sm text-muted-foreground font-mono">{tx.hash}</div>
                            <div className="text-xs text-muted-foreground">
                              {tx.type === 'received' ? `From: ${tx.from}` : `To: ${tx.to}`}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-medium ${
                              tx.type === 'received' ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {tx.amount} MINI
                          </div>
                          <div className="text-xs text-muted-foreground">{tx.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
