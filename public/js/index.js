var socket = io();

function scrollToBottom() {
    var messages = $('#messages');
    var message = messages.children('li:last').height();
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');

    if (scrollHeight > clientHeight) {
        messages.scrollTop(messages.height());
    }
}

socket.on('connect', () => {
    console.log('Connect to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
    var template = $('#message-template').html();
    var formatTime = moment(message.createdAt).format('h:mm a');
    var li = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formatTime
    });
    $('#messages').append(li);
    scrollToBottom();
});

socket.on('newLocationMessage', (message) => {
    console.log('recieve data from server', message);
    var template = $('#location-message-template').html();
    var formatTime = moment(message.createdAt).format('h:mm a');
    var li = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formatTime
    });
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