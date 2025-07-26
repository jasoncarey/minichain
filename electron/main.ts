import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawn, ChildProcess } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: BrowserWindow | null;
let dockerProcess: ChildProcess | null = null;
let currentBlockchainStatus = { status: 'idle', message: 'Initializing...' };

// Function to send status updates to renderer
function sendStatusUpdate(status: string, message: string) {
  currentBlockchainStatus = { status, message };
  console.log(`📡 Sending blockchain status to renderer: ${status} - ${message}`);
  if (win && !win.isDestroyed() && win.webContents && !win.webContents.isDestroyed()) {
    try {
      win.webContents.send('blockchain-status', { status, message });
      console.log('✅ Status sent successfully');
    } catch (error) {
      console.log(
        '❌ Error sending status:',
        error instanceof Error ? error.message : String(error),
      );
    }
  } else {
    console.log('⚠️  Window not ready to receive status update');
  }
}

// Docker management functions
async function startDockerNodes(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('🐳 Starting blockchain nodes with Docker Compose...');
    sendStatusUpdate('starting', 'Starting blockchain nodes...');

    // Start docker-compose up
    dockerProcess = spawn('docker-compose', ['up', '--build'], {
      cwd: process.env.APP_ROOT,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let startupComplete = false;
    const nodesReady = new Set<string>();

    const timeout = setTimeout(() => {
      if (!startupComplete) {
        console.log('✅ Docker startup timeout reached, assuming nodes are starting...');
        sendStatusUpdate('ready', 'Blockchain nodes are starting (timeout reached)');
        startupComplete = true;
        resolve();
      }
    }, 15000); // 15 second timeout

    dockerProcess.stdout?.on('data', (data) => {
      const output = data.toString();
      console.log('🐳 Docker:', output);

      // Check for individual node startup
      const nodeMatch = output.match(/Node (node-\d+) started/);
      if (nodeMatch) {
        nodesReady.add(nodeMatch[1]);
        sendStatusUpdate('starting', `${nodesReady.size}/3 nodes started`);
      }

      // Check if all nodes are ready (look for the API server startup messages)
      if (output.includes('Node API running') && !startupComplete) {
        // Give a bit more time for all nodes to be ready
        setTimeout(() => {
          if (!startupComplete) {
            console.log('✅ Blockchain nodes are ready!');
            sendStatusUpdate('ready', 'All blockchain nodes are ready!');
            startupComplete = true;
            clearTimeout(timeout);
            resolve();
          }
        }, 3000);
      }
    });

    dockerProcess.stderr?.on('data', (data) => {
      const errorOutput = data.toString();
      console.error('🐳 Docker Error:', errorOutput);
      sendStatusUpdate('error', `Docker Error: ${errorOutput.substring(0, 100)}...`);
    });

    dockerProcess.on('error', (error) => {
      console.error('❌ Failed to start Docker:', error);
      sendStatusUpdate('error', `Failed to start Docker: ${error.message}`);
      clearTimeout(timeout);
      if (!startupComplete) {
        reject(error);
      }
    });

    dockerProcess.on('exit', (code) => {
      if (code !== 0 && !startupComplete) {
        console.error(`❌ Docker process exited with code ${code}`);
        sendStatusUpdate('error', `Docker process exited with code ${code}`);
        clearTimeout(timeout);
        reject(new Error(`Docker process exited with code ${code}`));
      }
    });
  });
}

async function stopDockerNodes(): Promise<void> {
  return new Promise((resolve) => {
    if (!dockerProcess) {
      resolve();
      return;
    }

    console.log('🐳 Stopping blockchain nodes...');
    sendStatusUpdate('stopping', 'Stopping blockchain nodes...');

    // First try graceful shutdown
    const stopProcess = spawn('docker-compose', ['down'], {
      cwd: process.env.APP_ROOT,
      stdio: 'inherit',
    });

    stopProcess.on('exit', () => {
      console.log('✅ Blockchain nodes stopped');
      sendStatusUpdate('stopped', 'Blockchain nodes stopped');
      dockerProcess = null;
      resolve();
    });

    // Force kill the main process if it's still running
    if (dockerProcess && !dockerProcess.killed) {
      dockerProcess.kill('SIGTERM');
    }

    // Fallback timeout
    setTimeout(() => {
      if (dockerProcess && !dockerProcess.killed) {
        dockerProcess.kill('SIGKILL');
      }
      resolve();
    }, 5000);
  });
}

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
    // Send current blockchain status to newly loaded renderer
    win?.webContents.send('blockchain-status', currentBlockchainStatus);
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    await stopDockerNodes();
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle app quit
app.on('before-quit', async (event) => {
  if (dockerProcess) {
    event.preventDefault();
    await stopDockerNodes();
    app.quit();
  }
});

// Start the app and Docker nodes
app.whenReady().then(async () => {
  try {
    createWindow();
    await startDockerNodes();
    console.log('🚀 Electron app and blockchain nodes are ready!');
  } catch (error) {
    console.error('❌ Failed to start blockchain nodes:', error);
    // Still show the window even if Docker fails
  }
});
