// Make socket connection
var socket = io();

// Joined Game
socket.emit('playerJoined', { playerId , gameId });

// Query DOM
var message = document.getElementById('message'),
    btn = document.getElementById('send'),
    output = document.getElementById('output');

// Emit events
btn.addEventListener('click', function(){
    socket.emit('message', {'body': message.value});
});

// Listen for events
socket.on('message', (data) => {
    if (data.messageType === 'gameInfo') {
        output.innerHTML += '<p class="gameInfo">' + data.body + '</p>';
    }
    else if(data.messageType === 'spectatorChat') {
        output.innerHTML += '<p class="spectatorChat">' + ': ' + data.body + '</p>';
    }

});
