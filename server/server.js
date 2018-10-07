const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils');
const {isRealString} = require('./utils/validation');
const {User} = require('./models/user.model');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;
var user = new User();

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
    console.log('New user to connect');

    socket.on('join', function (params, callback) {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Display name and Room name are required');
        }

        socket.join(params.room);
        //user.removeUser(socket.id);
        debugger;
        user.addUser(socket.id, params.name, params.room);
        console.log(user.getUserList(params.room));

        io.to(params.room).emit('updateUserList', user.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined`));

        callback();
    });

    socket.on('createMessage', (message, callback) => {
        //all clients can recieve the message from server
        io.emit('newMessage', generateMessage(message.from, message.text));
        //other clients can recieve the message from server
        // socket.broadcast.emit('newMessage', Object.assign({}, message, {createdAt: new Date().getTime()}));
        callback();
    });

    socket.on('createGeolocation', function (coords, callback) {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
        callback();
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
        var leftUser = user.removeUser(socket.id);
        socket.broadcast.to(leftUser.room).emit('newMessage', generateMessage('Admin', `${leftUser.name} has left`));
        io.to(leftUser.room).emit('updateUserList', user.getUserList(leftUser.room));
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});