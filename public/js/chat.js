var socket = io();

function scrollToBottom() {
    // var message = messages.children('li:last').height();
    // var scrollTop = messages.prop('scrollTop');
    var messages = $('#messages');
    var clientHeight = messages.prop('clientHeight');
    var scrollHeight = messages.prop('scrollHeight');

    if (scrollHeight > clientHeight) {
        messages.scrollTop(messages.height());
    }
}

socket.on('connect', () => {
    console.log('Connect to server');

    var params = $.deparam(window.location.search);
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error');
        }
    });
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('updateUserList', (users) => {
    console.log('Users list', users);
    $('#users').children('ul').remove();
    var ul = document.createElement('ul');
    users.forEach(user => {
        var li = document.createElement('li');
        li.textContent = user;
        ul.appendChild(li);
    });

    $('#users').append(ul);
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