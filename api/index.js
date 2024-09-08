const express = require('express');
const app = express();
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const qrRoute = require('./routes/qr');
const http = require('http');
const WebSocket = require('ws');
const admin = require('firebase-admin');

dotenv.config();

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore(); // Initializing Firestore

const server = http.createServer(app); // Create a server instance
const wss = new WebSocket.Server({ server }); // Create a WebSocket server

app.use((req, res, next) => {
  req.db = db; // Make Firestore available in req
  next();
});

app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/qr', qrRoute);

// WebSocket connection for real-time updates
wss.on('connection', (ws) => {
  // console.log('Client connected');

  const qrcodeRef = db.collection('qrcodes').orderBy('scannedAt', 'desc');

  qrcodeRef.onSnapshot(snapshot => {
    const qrcodes = snapshot.docs.map(doc => doc.data());
    ws.send(JSON.stringify(qrcodes)); // Send real-time data to the connected client
  });

  ws.on('close', () => {
    // console.log('Client disconnected');
  });
});

server.listen(8800, () => {
  console.log('Backend Server is running!');
});
