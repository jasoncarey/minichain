import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import './blockchain.d.ts';

// Import page components
import HomePage from './pages/HomePage';
import BlockchainPage from './pages/BlockchainPage.tsx';
import MempoolPage from './pages/MempoolPage';
import WalletPage from './pages/WalletPage';
import TransactionsPage from './pages/TransactionsPage';
import SettingsPage from './pages/SettingsPage';

function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="nav-header bg-card border-b border-border">
      <div className="nav-brand">
        <h1 className="text-primary">Minichain</h1>
      </div>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
          Home
        </Link>
        <Link to="/blockchain" className={`nav-link ${isActive('/blockchain') ? 'active' : ''}`}>
          Blockchain
        </Link>
        <Link to="/wallet" className={`nav-link ${isActive('/wallet') ? 'active' : ''}`}>
          Wallet
        </Link>
        <Link
          to="/transactions"
          className={`nav-link ${isActive('/transactions') ? 'active' : ''}`}
        >
          Transactions
        </Link>
        <Link to="/mempool" className={`nav-link ${isActive('/mempool') ? 'active' : ''}`}>
          Mempool
        </Link>
        <Link to="/settings" className={`nav-link ${isActive('/settings') ? 'active' : ''}`}>
          Settings
        </Link>
      </div>
    </nav>
  );
}

function App() {
  useEffect(() => {
    // Enable dark mode by adding the dark class to the document element
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blockchain" element={<BlockchainPage />} />
          <Route path="/mempool" element={<MempoolPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
