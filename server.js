/**
 * Encrypted P2P Messenger – Signaling Server
 * ------------------------------------------
 * This server ONLY handles WebRTC signaling (friend discovery +
 * offer/answer exchange). Chat messages never touch this server –
 * they go directly peer-to-peer and are encrypted with AES-GCM.
 *
 * Deploy on any free Node host: Railway, Render, Fly.io, Glitch, etc.
 */

const express = require('express');
const { ExpressPeerServer } = require('peer');
const cors = require('cors');
const path = require('path');
const http = require('http');

const PORT = process.env.PORT || 9000;
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'encrypted-p2p-messenger' });
});

const server = http.createServer(app);

// PeerJS signaling server
const peerServer = ExpressPeerServer(server, {
  path: '/peerjs',
  allow_discovery: true,          // lets clients list peers if needed
  proxied: true                   // important behind Railway/Render proxies
});

app.use('/peerjs', peerServer);

peerServer.on('connection', (client) => {
  console.log(`[+] Peer connected: ${client.getId()}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`[-] Peer disconnected: ${client.getId()}`);
});

server.listen(PORT, () => {
  console.log(`Encrypted P2P Messenger signaling server running on port ${PORT}`);
  console.log(`PeerJS path: /peerjs`);
  console.log(`Open http://localhost:${PORT} to use the messenger`);
});
