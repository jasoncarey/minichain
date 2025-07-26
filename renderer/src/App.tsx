import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/electron-vite.animate.svg';
import './App.css';
import './blockchain.d.ts';

interface BlockchainStatus {
  status: 'starting' | 'ready' | 'error' | 'stopping' | 'stopped' | 'idle';
  message: string;
}

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
        return '#22c55e'; // green
      case 'starting':
        return '#f59e0b'; // amber
      case 'error':
        return '#ef4444'; // red
      case 'stopping':
        return '#f59e0b'; // amber
      case 'stopped':
        return '#6b7280'; // gray
      default:
        return '#9ca3af'; // gray
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
    <div
      style={{
        padding: '12px 16px',
        margin: '16px 0',
        border: '1px solid #374151',
        borderRadius: '8px',
        backgroundColor: '#1f2937',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span style={{ fontSize: '16px' }}>{getStatusEmoji()}</span>
      <div>
        <div
          style={{
            fontWeight: 'bold',
            color: getStatusColor(),
            fontSize: '14px',
            textTransform: 'uppercase',
          }}
        >
          Blockchain Nodes: {status.status}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: '#9ca3af',
            marginTop: '2px',
          }}
        >
          {status.message}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://electron-vite.github.io" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Minichain Blockchain</h1>

      <BlockchainStatusIndicator />

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Your blockchain nodes are running on ports 3001, 3002, and 3003
      </p>
    </>
  );
}

export default App;
