const express = require('express');
const { ExpressPeerServer } = require('peer');
const cors = require('cors');
const path = require('path');
const http = require('http');

const PORT = process.env.PORT || 9000;
const app = express();

app.use(cors());

// Explicitly serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly send index.html on root request
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'encrypted-p2p-messenger' });
});

const server = http.createServer(app);

// PeerJS signaling server
const peerServer = ExpressPeerServer(server, {
  path: '/peerjs',
  allow_discovery: true,
  proxied: true
});

app.use('/peerjs', peerServer);

server.listen(PORT, () => {
  console.log(`Encrypted P2P Messenger signaling server running on port ${PORT}`);
});
