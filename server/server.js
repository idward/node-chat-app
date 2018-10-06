const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
    console.log('New user to connect');

    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the chat app'
    });

    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New user joined'
    });

    socket.on('createMessage', (message) => {
        //all clients can recieve the message from server
        io.emit('newMessage', Object.assign({}, message, {createdAt: new Date().getTime()}));
        //other clients can recieve the message from server
        // socket.broadcast.emit('newMessage', Object.assign({}, message, {createdAt: new Date().getTime()}));
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});