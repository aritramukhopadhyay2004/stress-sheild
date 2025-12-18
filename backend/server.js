const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: process.env.FRONTEND_URL || '*' }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});
// Routes
const authRoutes = require('./routes/auth');
const healthRoutes = require('./routes/health');
const alertRoutes = require('./routes/alerts');

app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/alerts', alertRoutes);

// Socket.io for real-time alerts
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.locals.io = io;

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
