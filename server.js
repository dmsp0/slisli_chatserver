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

const connectedUsers = {};

io.use((socket, next) => {
  const { token, userId } = socket.handshake.auth;
  if (token && userId) {
    socket.userId = userId; // 사용자 ID를 소켓에 저장
    next();
  } else {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}, UserID: ${socket.userId}`);

  connectedUsers[socket.userId] = socket.id;

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.userId} joined room ${roomId}`);

    // 방에 입장 메시지 방송
    const joinMessage = `${socket.userId}님이 입장하였습니다.`;
    io.to(roomId).emit('chat message', {
      message: joinMessage,
      userId: 'system',
      nickname: 'system',
      time: moment().format('h:mm:ss A')
    });
  });

  socket.on('chat message', (data) => {
    console.log(`${data.nickname}: ${data.message}`);
    io.to(data.roomId).emit('chat message', {
      message: data.message,
      userId: socket.userId,
      nickname: data.nickname,
      time: moment().format('h:mm:ss A'),
    });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    delete connectedUsers[socket.userId];
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
