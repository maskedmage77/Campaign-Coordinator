// Make socket connection
var socket = io();

// Joined Game
socket.emit('userJoined', { playerId , gameId });

// Query DOM
var detailsWindow = document.getElementById('detailsWindow'),
    chatWindow = document.getElementById('chatWindow'),
    usersWindow = document.getElementById('usersWindow'),
    characterWindow = document.getElementById('characterWindow'),
    settingsWindow = document.getElementById('settingsWindow'),
    helpWindow = document.getElementById('helpWindow');
    pageWidth = window.innerWidth;
// Nav Elements
var navGameButton = document.getElementById('navGameButton'),
    navChatButton = document.getElementById('navChatButton'),
    navClientsButton = document.getElementById('navClientsButton'),
    navPlayerButton = document.getElementById('navPlayerButton'),
    navSettingsButton = document.getElementById('navSettingsButton');
// Chat Elements
var message = document.getElementById('message'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    userList = [];

// Adjust pageWidth variable if window size changes
window.addEventListener('resize', function(){
    pageWidth = window.innerWidth;
    if (pageWidth <= 600) {
        hideWindows();
        detailsWindow.classList.remove("hidden");
        navGameButton.classList.remove('grey');
    }
});

// Hide Windows
function hideWindows() {
    detailsWindow.className = "hidden";
    chatWindow.className = "hidden";
    usersWindow.className = "hidden";
    characterWindow.className = "hidden";
    settingsWindow.className = "hidden";
    helpWindow.className = "hidden";
    navGameButton.classList.add('grey');
    navChatButton.classList.add('grey');
    navClientsButton.classList.add('grey');
    navPlayerButton.classList.add('grey');
    navSettingsButton.classList.add('grey');
}

if (pageWidth <= 600) {
    hideWindows();
    detailsWindow.classList.remove("hidden");
    navGameButton.classList.remove('grey');
}

// Function for Nav Buttons
function addNavListeners(button, w) {
    button.addEventListener("click", function(){
        if (pageWidth <= 600 && w.classList.contains("hidden")) {
            hideWindows();
            w.classList.remove("hidden");
            button.classList.remove("grey");
            scrollToBottom();
        }
        else if (pageWidth > 600 && w.classList.contains("hidden")) {
            w.classList.remove("hidden");
            button.classList.remove("grey");
            scrollToBottom();
        }
        else if (pageWidth > 600 && !w.classList.contains("hidden")) {
            w.className = "hidden";
            button.classList.add('grey');
        }
    });
};

// adding listeners
addNavListeners(navGameButton, detailsWindow);
addNavListeners(navChatButton, chatWindow);
addNavListeners(navClientsButton, usersWindow);
addNavListeners(navPlayerButton, characterWindow);
addNavListeners(navSettingsButton, settingsWindow);

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
        else if(data.messageType === 'diceRoll') {
            output.innerHTML += '<p class="diceRoll"></p>';
            var rollDetails = data.body.toString().split(/\s:\s/i);
            var rollCount = rollDetails[0].toString().split(/,/i);

            console.log(rollDetails);
            console.log(rollCount.length);

            if (rollCount.length === 1) {
                output.lastChild.innerHTML = data.username +
                ' has rolled a ' + rollDetails[1] +
                ' sided die, with a modifier of ' +
                rollDetails[3] +
                ' for a total of: ';
                output.lastChild.insertAdjacentHTML('afterend','<p class="diceRollTotal">' + rollDetails[4] + '</p>') ;

            } else {
                output.lastChild.innerHTML = data.username +
                ' has rolled ' +
                rollCount.length +
                ', ' +
                rollDetails[1] +
                ' sided dice, with a modifier of ' +
                rollDetails[3] +
                ' for a total of: ';
                output.lastChild.insertAdjacentHTML('afterend','<p class="diceRollTotal">' + rollDetails[4] + '</p>') ;
            }
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
        else if(data.messageType === 'diceRoll') {
            var newP1 = document.createElement("p");
            var newP2 = document.createElement("p");
            newP1.className = "diceRoll";
            newP2.className = "diceRollTotal";

            var rollDetails = data.body.toString().split(/\s:\s/i);
            var rollCount = rollDetails[0].toString().split(/,/i);

            if (rollCount.length === 1) {
                var text1 = document.createTextNode(data.username +' has rolled a ' + rollDetails[1] +' sided die, with a modifier of ' +rollDetails[3] +' for a total of: ');
            } else {
                var text1 = document.createTextNode(data.username +' has rolled '+ rollCount.length +', '+ rollDetails[1] +' sided dice, with a modifier of ' +rollDetails[3] +' for a total of: ');
            }
            var text2 = document.createTextNode(rollDetails[4]);
            newP1.appendChild(text1);
            newP2.appendChild(text2);
            output.insertBefore(newP2, output.firstChild);
            output.insertBefore(newP1, output.firstChild);
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
