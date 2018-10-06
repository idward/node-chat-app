var socket = io();

socket.on('connect', () => {
    console.log('Connect to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
    console.log('recieve data from server', message);
    var li = document.createElement('li');
    li.textContent = `${message.from} : ${message.text}`;
    $('#messages').append(li);
});

// socket.emit('createMessage', {
//     from: 'Andrew',
//     text: 'Hey, this is Andrew'
// }, function () {
//     console.log('Got it');
// });

$('body').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: $('[name=message]').val()
    }, function () {

    });
});