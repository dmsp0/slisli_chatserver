// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const moment = require('moment');

const PORT = 5000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  path: '/socket',
});

app.use(express.json());

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('chat message', (data) => {
    console.log('Message received:', data.message);
    io.to(data.roomId).emit('chat message', { message: data.message, userId: socket.id, nickname: data.nickname, time: moment().format('h:mm:ss A') });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
