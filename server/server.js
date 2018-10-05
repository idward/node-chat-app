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

    socket.emit('newEmail', {
        from: 'test@test.com',
        text: 'hello world',
        createdAt: 123
    });

    socket.on('createEmail', (email) => {
        console.log('recieved data from client: ', email);
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});