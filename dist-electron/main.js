"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const electron = require("electron");
const node_url = require("node:url");
const path = require("node:path");
const node_child_process = require("node:child_process");
var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
const __dirname$1 = path.dirname(node_url.fileURLToPath(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.js", document.baseURI).href));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let dockerProcess = null;
let currentBlockchainStatus = { status: "idle", message: "Initializing..." };
function sendStatusUpdate(status, message) {
  currentBlockchainStatus = { status, message };
  console.log(`📡 Sending blockchain status to renderer: ${status} - ${message}`);
  if (win && !win.isDestroyed() && win.webContents && !win.webContents.isDestroyed()) {
    try {
      win.webContents.send("blockchain-status", { status, message });
      console.log("✅ Status sent successfully");
    } catch (error) {
      console.log(
        "❌ Error sending status:",
        error instanceof Error ? error.message : String(error)
      );
    }
  } else {
    console.log("⚠️  Window not ready to receive status update");
  }
}
async function startDockerNodes() {
  return new Promise((resolve, reject) => {
    var _a, _b;
    console.log("🐳 Starting blockchain nodes with Docker Compose...");
    sendStatusUpdate("starting", "Starting blockchain nodes...");
    dockerProcess = node_child_process.spawn("docker-compose", ["up", "--build"], {
      cwd: process.env.APP_ROOT,
      stdio: ["pipe", "pipe", "pipe"]
    });
    let startupComplete = false;
    const nodesReady = /* @__PURE__ */ new Set();
    const timeout = setTimeout(() => {
      if (!startupComplete) {
        console.log("✅ Docker startup timeout reached, assuming nodes are starting...");
        sendStatusUpdate("ready", "Blockchain nodes are starting (timeout reached)");
        startupComplete = true;
        resolve();
      }
    }, 15e3);
    (_a = dockerProcess.stdout) == null ? void 0 : _a.on("data", (data) => {
      const output = data.toString();
      console.log("🐳 Docker:", output);
      const nodeMatch = output.match(/Node (node-\d+) started/);
      if (nodeMatch) {
        nodesReady.add(nodeMatch[1]);
        sendStatusUpdate("starting", `${nodesReady.size}/3 nodes started`);
      }
      if (output.includes("Node API running") && !startupComplete) {
        setTimeout(() => {
          if (!startupComplete) {
            console.log("✅ Blockchain nodes are ready!");
            sendStatusUpdate("ready", "All blockchain nodes are ready!");
            startupComplete = true;
            clearTimeout(timeout);
            resolve();
          }
        }, 3e3);
      }
    });
    (_b = dockerProcess.stderr) == null ? void 0 : _b.on("data", (data) => {
      const errorOutput = data.toString();
      console.error("🐳 Docker Error:", errorOutput);
      sendStatusUpdate("error", `Docker Error: ${errorOutput.substring(0, 100)}...`);
    });
    dockerProcess.on("error", (error) => {
      console.error("❌ Failed to start Docker:", error);
      sendStatusUpdate("error", `Failed to start Docker: ${error.message}`);
      clearTimeout(timeout);
      if (!startupComplete) {
        reject(error);
      }
    });
    dockerProcess.on("exit", (code) => {
      if (code !== 0 && !startupComplete) {
        console.error(`❌ Docker process exited with code ${code}`);
        sendStatusUpdate("error", `Docker process exited with code ${code}`);
        clearTimeout(timeout);
        reject(new Error(`Docker process exited with code ${code}`));
      }
    });
  });
}
async function stopDockerNodes() {
  return new Promise((resolve) => {
    if (!dockerProcess) {
      resolve();
      return;
    }
    console.log("🐳 Stopping blockchain nodes...");
    sendStatusUpdate("stopping", "Stopping blockchain nodes...");
    const stopProcess = node_child_process.spawn("docker-compose", ["down"], {
      cwd: process.env.APP_ROOT,
      stdio: "inherit"
    });
    stopProcess.on("exit", () => {
      console.log("✅ Blockchain nodes stopped");
      sendStatusUpdate("stopped", "Blockchain nodes stopped");
      dockerProcess = null;
      resolve();
    });
    if (dockerProcess && !dockerProcess.killed) {
      dockerProcess.kill("SIGTERM");
    }
    setTimeout(() => {
      if (dockerProcess && !dockerProcess.killed) {
        dockerProcess.kill("SIGKILL");
      }
      resolve();
    }, 5e3);
  });
}
function createWindow() {
  win = new electron.BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.js")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
    win == null ? void 0 : win.webContents.send("blockchain-status", currentBlockchainStatus);
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
electron.app.on("window-all-closed", async () => {
  if (process.platform !== "darwin") {
    await stopDockerNodes();
    electron.app.quit();
    win = null;
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
electron.app.on("before-quit", async (event) => {
  if (dockerProcess) {
    event.preventDefault();
    await stopDockerNodes();
    electron.app.quit();
  }
});
electron.app.whenReady().then(async () => {
  try {
    createWindow();
    await startDockerNodes();
    console.log("🚀 Electron app and blockchain nodes are ready!");
  } catch (error) {
    console.error("❌ Failed to start blockchain nodes:", error);
  }
});
exports.MAIN_DIST = MAIN_DIST;
exports.RENDERER_DIST = RENDERER_DIST;
exports.VITE_DEV_SERVER_URL = VITE_DEV_SERVER_URL;
