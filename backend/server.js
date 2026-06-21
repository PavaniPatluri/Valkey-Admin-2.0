const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Base Metrics
let metrics = {
  clusterHealth: 99.9,
  activeNodes: 24,
  memoryUsageGB: 64.2,
  cpuLoadPercent: 42,
  cacheHitRatio: 94.8,
  activeConnections: 12450,
};

function generateLiveMetrics() {
  metrics.memoryUsageGB = Math.max(0, metrics.memoryUsageGB + (Math.random() * 3 - 1.5));
  metrics.cpuLoadPercent = Math.max(0, Math.min(100, metrics.cpuLoadPercent + (Math.random() * 10 - 5)));
  metrics.activeConnections = Math.max(0, metrics.activeConnections + (Math.random() * 1000 - 500));
  
  return {
    type: 'metrics_update',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    data: {
      memoryUsageGB: Number(metrics.memoryUsageGB.toFixed(2)),
      cpuLoadPercent: Number(metrics.cpuLoadPercent.toFixed(1)),
      activeConnections: Math.floor(metrics.activeConnections)
    }
  };
}

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket.');

  // Send initial metrics immediately
  ws.send(JSON.stringify({ type: 'initial_metrics', data: metrics }));

  // Broadcast updates every 2 seconds
  const intervalId = setInterval(() => {
    const update = generateLiveMetrics();
    ws.send(JSON.stringify(update));
  }, 2000);

  ws.on('close', () => {
    console.log('Client disconnected.');
    clearInterval(intervalId);
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Valkey Mock Backend is running.' });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Mock Valkey backend running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
