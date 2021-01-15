// Make socket connection
var socket = io();

// Joined Game
socket.emit('userJoined', { playerId , gameId });

// Query DOM
var message = document.getElementById('message'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    userList = [],
    usersWindow = document.getElementById('usersWindow');

// load more messages if at top of chatWindow
output.addEventListener("scroll", function(){
    if (output.scrollTop === 0) {
        console.log(output.firstChild.getAttribute("data-created-at"));
        socket.emit('messageTop', { oldestMsg: output.firstChild.getAttribute("data-created-at")});
    }
});

// scroll to bottom chat function
function scrollToBottom() {
    output.scrollTop = output.scrollHeight;
}

document.addEventListener("DOMContentLoaded", function(){
    // Emit events
    btn.addEventListener('click', function(){
        socket.emit('message', {'body': message.value});
        message.value = '';
    });

    message.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            socket.emit('message', {'body': message.value});
            message.value = '';
        }
    });

    // Listen for events
    socket.on('message', (data) => {
        if (data.messageType === 'gameInfo') {
            output.innerHTML += '<p class="gameInfo">' + data.body + '</p>';
        }
        else if(data.messageType === 'spectatorChat') {
            output.innerHTML += '<p class="spectatorChat"></p>';
            output.lastChild.innerText = data.username + ': ' + data.body;
        }
        else if(data.messageType === 'dmChat') {
            output.innerHTML += '<p class="dmChat"></p>';
            output.lastChild.innerText = data.username + ': ' + data.body;
        }
        scrollToBottom();
    });

    socket.on('messageTop', (data) => {
        if (data.messageType === 'gameInfo') {
            output.innerHTML += '<p class="gameInfo">' + data.body + '</p>';
        }
        else if(data.messageType === 'spectatorChat') {
            var newP = document.createElement("p");
            newP.className = "spectatorChat";
            var text = document.createTextNode(data.username + ': ' + data.body);
            newP.appendChild(text);
            output.insertBefore(newP, output.firstChild);
            output.firstChild.setAttribute('data-created-at', data.createdAt);
        }
        else if(data.messageType === 'dmChat') {
            var newP = document.createElement("p");
            newP.className = "dmChat";
            var text = document.createTextNode(data.username + ': ' + data.body);
            newP.appendChild(text);
            output.insertBefore(newP, output.firstChild);
            output.firstChild.setAttribute('data-created-at', data.createdAt);
        }
    });

    socket.on('userListUpdate', (data) => {

        // add new users to client side list
        data.userList.forEach((i) => {
            if (userList.indexOf(i._id) === -1) {

                // create <p> for username
                let newUserUsername = document.createElement('p');
                newUserUsername.className = "username";
                let newUserUsernameText = document.createTextNode(i.username);
                newUserUsername.appendChild(newUserUsernameText);

                // create <p> for role
                let newUserRole = document.createElement('p');
                if (i.role === "Spectator") {
                    var newUserRoleText = document.createTextNode("Spectator");
                    newUserRole.className = "spectatorColor role";
                }
                else if (i.role === "Dungeon Master") {
                    var newUserRoleText = document.createTextNode("Dungeon Master");
                    newUserRole.className = "dmColor role";
                }
                newUserRole.appendChild(newUserRoleText);

                // create the <div>
                let newUser = document.createElement('div');
                newUser.className = "user";
                newUser.setAttribute('data-player-id', i._id);
                newUser.appendChild(newUserUsername);
                newUser.appendChild(newUserRole);
                usersWindow.appendChild(newUser);
                userList.push(i._id);
            }
        });

        // remove user client side
        var test = data.userList.map(x => x._id);
        userList.forEach((clientItem, i) => {
            if (!test.includes(clientItem)) {
                console.log('not found!');
                var item = document.querySelector('[data-player-id="'+clientItem+'"]');
                item.remove();
                userList.splice(i, 1);
            } 
        });
    });
});
