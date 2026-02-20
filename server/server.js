const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http'); // New Import
const { Server } = require('socket.io'); // New Import

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app); // Wrap Express with HTTP

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


// --- SOCKET.IO SETUP ---
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

let waitingQueue = []; 

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_queue', (userData) => {
        // 1. Prevent the same socket or same user email from joining twice
        const isAlreadyInQueue = waitingQueue.some(
            u => u.socketId === socket.id || u.user.email === userData.email
        );

        if (isAlreadyInQueue) {
            console.log(`User ${userData.username} is already waiting.`);
            return;
        }

        // 2. Add the unique user to the queue
        waitingQueue.push({ socketId: socket.id, user: userData });
        console.log(`User ${userData.username} joined. Queue size: ${waitingQueue.length}`);

        // 3. Only match if we have at least two DIFFERENT users
        if (waitingQueue.length >= 2) {
            // Remove the first two users from the queue entirely
            const user1 = waitingQueue.shift();
            const user2 = waitingQueue.shift();

            // Create ONE unique ID for both
            const sharedRoomId = `room_${user1.socketId.substring(0,5)}_${user2.socketId.substring(0,5)}`;

            // Send the SAME roomId to both specific sockets
            io.to(user1.socketId).emit('match_found', { 
                roomId: sharedRoomId, 
                opponent: user2.user.username 
            });
            
            io.to(user2.socketId).emit('match_found', { 
                roomId: sharedRoomId, 
                opponent: user1.user.username 
            });

            console.log(`✅ Match Created! Room: ${sharedRoomId}`);
        }
    });

    // ... matching logic ends here ...

    // --- NEW: Video Call Signaling ---
    // 1. User joins the specific video room
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        const clients = io.sockets.adapter.rooms.get(roomId);
        const numClients = clients ? clients.size : 0;
        
        // If there is another user, tell them to prepare for a call
        if (numClients > 1) {
            socket.to(roomId).emit('user_joined', socket.id);
        }
    });

    // 2. Forward the "Offer" (The initial call)
    socket.on('call_user', (data) => {
        io.to(data.userToCall).emit('incoming_call', { 
            signal: data.signalData, 
            from: data.from 
        });
    });

    // 3. Forward the "Answer" (The response)
    socket.on('answer_call', (data) => {
        io.to(data.to).emit('call_accepted', data.signal);
    });

    // ... disconnect logic ...

    socket.on('disconnect', () => {
        waitingQueue = waitingQueue.filter(u => u.socketId !== socket.id);
        console.log('User Disconnected:', socket.id);
    });
});

// Start Server (Note: we use 'server.listen', not 'app.listen')
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});