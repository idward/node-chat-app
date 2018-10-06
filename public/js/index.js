var socket = io();

socket.on('connect', () => {
    console.log('Connect to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
    console.log('recieve data from server', message);
});