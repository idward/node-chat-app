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

socket.on('newLocationMessage', (message) => {
    console.log('recieve data from server', message);
    var li = document.createElement('li');
    li.innerHTML = `${message.from}: <a target="_blank" href="${message.url}">Get location</a>`;
    $('#messages').append(li);
});

$('body').on('submit', function (e) {
    e.preventDefault();

    var messageText = $('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageText.val()
    }, function () {
        messageText.val('');
    });
});

var locationButton = $('#sendGeolocation');

locationButton.on('click', function () {
    if (!navigator.geolocation) {
        alert('geolocation is not supported by your browser');
    }

    $(this).attr('disabled', true).text('Send location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);

        socket.emit('createGeolocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function () {
            locationButton.removeAttr('diabled').text('Send location');
        });
    }, function () {
        alert('Unable to fetch geolocation');
    });
});