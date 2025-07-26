import React, { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
}

function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all');

  useEffect(() => {
    // Mock transaction data
    const mockTransactions: Transaction[] = [
      {
        id: 'tx1',
        from: '0x1234...5678',
        to: '0x8765...4321',
        amount: 50,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'confirmed',
        blockNumber: 1,
      },
      {
        id: 'tx2',
        from: '0x8765...4321',
        to: '0x9999...8888',
        amount: 25,
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        status: 'pending',
      },
      {
        id: 'tx3',
        from: '0x9999...8888',
        to: '0x1234...5678',
        amount: 10,
        timestamp: new Date().toISOString(),
        status: 'pending',
      },
    ];
    setTransactions(mockTransactions);
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true;
    return tx.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#22c55e';
      case 'pending':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'failed':
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <div className="page">
      <h1>Transactions</h1>

      {/* Filter Controls */}
      <div className="section">
        <div className="filter-controls">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({transactions.length})
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({transactions.filter((tx) => tx.status === 'pending').length})
          </button>
          <button
            className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed ({transactions.filter((tx) => tx.status === 'confirmed').length})
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="section">
        <h2>Transaction History</h2>
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions found.</p>
          </div>
        ) : (
          <div className="transactions-list">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="transaction-card">
                <div className="transaction-header">
                  <div className="transaction-id">
                    <span className="status-icon">{getStatusIcon(tx.status)}</span>
                    <span className="tx-id">{tx.id}</span>
                  </div>
                  <span className="status-badge" style={{ color: getStatusColor(tx.status) }}>
                    {tx.status}
                  </span>
                </div>

                <div className="transaction-details">
                  <div className="transaction-addresses">
                    <div className="from-address">
                      <label>From:</label>
                      <code>{tx.from}</code>
                    </div>
                    <div className="arrow">→</div>
                    <div className="to-address">
                      <label>To:</label>
                      <code>{tx.to}</code>
                    </div>
                  </div>

                  <div className="transaction-info">
                    <div className="amount">
                      <label>Amount:</label>
                      <span className="amount-value">{tx.amount} coins</span>
                    </div>
                    <div className="timestamp">
                      <label>Time:</label>
                      <span>{new Date(tx.timestamp).toLocaleString()}</span>
                    </div>
                    {tx.blockNumber && (
                      <div className="block-number">
                        <label>Block:</label>
                        <span>#{tx.blockNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Stats */}
      <div className="section">
        <h2>Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Transactions</h3>
            <span className="stat-value">{transactions.length}</span>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <span className="stat-value">
              {transactions.filter((tx) => tx.status === 'pending').length}
            </span>
          </div>
          <div className="stat-card">
            <h3>Confirmed</h3>
            <span className="stat-value">
              {transactions.filter((tx) => tx.status === 'confirmed').length}
            </span>
          </div>
          <div className="stat-card">
            <h3>Total Volume</h3>
            <span className="stat-value">
              {transactions.reduce((sum, tx) => sum + tx.amount, 0)} coins
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionsPage;
