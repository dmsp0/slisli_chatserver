const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const moment = require('moment'); // moment 모듈 추가

const PORT = 5000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000/',
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
    io.emit('chat message', { message: data.message, name: socket.id, time: moment().format('h:mm:ss A') });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
