# Encrypted P2P Messenger (Self-hosted)

A private messaging tool where:

- You get a permanent **Friend Code**
- Friends can add each other and chat
- All messages are **end-to-end encrypted** with a shared password (AES-GCM)
- The server only does signaling (WebRTC handshake) — chat data never goes through the server

## Project structure

```
p2p-messenger/
├── package.json
├── server.js              ← signaling server
├── public/
│   └── index.html         ← the messenger UI
└── README.md
```

## Local test

```bash
cd p2p-messenger
npm install
npm start
```

Open http://localhost:9000 in two browsers (or one normal + one incognito).

1. Enter the **same shared password** on both
2. Click **Create Friend Code & Go Online**
3. Copy one Friend Code → paste it in the other as “Add Friend”
4. Click **Chat**

## Deploy for free (recommended)

### Option 1 – Railway (easiest)

1. Go to https://railway.app and sign in with GitHub
2. Click **New Project → Deploy from GitHub repo** (or upload the folder)
3. Railway detects Node.js automatically
4. After deploy you get a URL like `https://your-app.up.railway.app`
5. Open that URL on any device — the messenger is ready

### Option 2 – Render

1. Go to https://render.com
2. New → Web Service
3. Connect the repo or upload
4. Build command: `npm install`
5. Start command: `npm start`
6. Free tier works fine for personal use

### Option 3 – Fly.io

```bash
# install flyctl first, then:
fly launch
fly deploy
```

### Option 4 – Any VPS / Raspberry Pi

```bash
git clone <your-repo>
cd p2p-messenger
npm install
# use pm2 or systemd to keep it running
npm start
```

## How encryption works

- Both users enter the **same shared password**
- Password is turned into an AES-GCM key (PBKDF2, 100k iterations)
- Every message is encrypted **before** it leaves the browser
- The signaling server never sees message content

## Notes

- Both people must be online at the same time to establish a connection (normal for pure P2P)
- After the connection is established, traffic is direct peer-to-peer (or via TURN if needed)
- Friend list is stored only in the browser (`localStorage`)
- You can later add your own TURN server for even better connectivity behind strict firewalls

## Switching back to free PeerJS cloud

In `public/index.html` set:

```js
useCloudFallback: true
```

Then the client will use the public PeerJS cloud instead of your server (useful for quick tests).
