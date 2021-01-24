const Message = require('./models/Message');

var userList = [];

function diceRoll (diceCount, diceSides) {
    var rolls = [];
    for (i = 0; i < diceCount; i++) {
        rolls[i] = 1 + Math.floor(Math.random() * diceSides);
    }
    return rolls;
}

const socketConnections = (io,Game,User) => {
    // socket setup
    io.on('connection', socket => {

        // create variables
        var game = {};
        var player = {};

        socket.on('userJoined', async (e) => {

            // set the objects
            var player1 = await Game.findOne({ 'players._id' : e.playerId },{'_id': 0,"players.$": 1 });
            player1 = player1.players[0];
            var username = await User.findOne({ 'email' : player1.email },{'_id': 0,"username":1});
            Object.keys(username).forEach(key => {
                if (username[key] instanceof Object) {
                    player[key] = Object.assign({}, player1[key], username[key]);
                } else {
                    player[key] = username[key];
                }
            });
            player = player._doc;
            game =  await Game.findOne({ '_id': e.gameId });

            // socket joining room
            socket.join(game._id.toString());

            // add newly connected user to userList
            var testboy = player;
            Object.assign(testboy, {game_id: game._id.toString()});
            userList.push(testboy);

            // send userList
            var userListFiltered = userList.filter(user => user.game_id == game._id);
            io.in(game._id.toString()).emit('userListUpdate', ({userList: userListFiltered}));

            // send new player their role
            socket.emit('playerRole', player.role);

            // send game description
            socket.emit('gameDescription', game.description);

            // get previous 20 messages for newly connected user
            var msgs = await Message.find({game: game._id}).sort( [['createdAt', -1]] ).limit(20);

            msgs.forEach((i) => {
                if (i.type === "playerChat") {
                    socket.emit('messageTop', ({body: i.body.toString(), messageType: 'playerChat', username: i.senderUsername, 'createdAt': i.createdAt}));
                }
                else if (i.type === "dmChat") {
                    socket.emit('messageTop', ({body: i.body.toString(), messageType: 'dmChat', username: i.senderUsername, 'createdAt': i.createdAt}));
                }
                else if (i.type === "spectatorChat") {
                    socket.emit('messageTop', ({body: i.body.toString(), messageType: 'spectatorChat', username: i.senderUsername, 'createdAt': i.createdAt}));
                }
                else if (i.type === "diceRoll") {
                    socket.emit('messageTop', ({body: i.body.toString(), messageType: 'diceRoll', username: i.senderUsername, 'createdAt': i.createdAt}));

                }
            });

            // send welcome message to newly connected user
            socket.emit('message', ({body: 'Welcome to the game '+ game.name + '.', messageType: 'gameInfo'  }));

            // send message to other players
            if (player.role === "Spectator") {
                socket.to(game._id.toString()).emit('message', ({body: player.username + ' has joined as a spectator.', messageType: 'gameInfo' }));
            }
            else if (player.role === "Dungeon Master") {
                socket.to(game._id.toString()).emit('message', ({body: player.username + ' has joined as a dungeon master.', messageType: 'gameInfo' }));
            }
        });

        socket.on('gameDescription', async (data) => {
            game.description = data.description;
            await game.save();
            io.in(game._id.toString()).emit('gameDescription', data.description);
        });

        socket.on('messageTop', async (e) => {
            // get 10 messages to add to top of chat
            var msgs = await Message.find({createdAt: {$lt: e.oldestMsg}, game: game._id}).sort( [['createdAt', -1]] ).limit(10);
            msgs.forEach((i) => {
                if (i.type === "playerChat") {
                    socket.emit('messageTop', ({body: i.body.toString(), messageType: 'playerChat', username: i.senderUsername, 'createdAt': i.createdAt}));
                }
                else if (i.type === "dmChat") {
                    socket.emit('messageTop', ({body: i.body.toString(), messageType: 'dmChat', username: i.senderUsername, 'createdAt': i.createdAt}));
                }
                else if (i.type === "spectatorChat") {
                    socket.emit('messageTop', ({body: i.body.toString(), messageType: 'spectatorChat', username: i.senderUsername, 'createdAt': i.createdAt}));
                }
            });
        });

        socket.on('disconnect', (e) => {
            try {
                // remove user from userList
                result = userList.findIndex(function(object) {
                    return object._id === player._id;
                });
                if (result !== -1) {
                    userList.splice(result, 1);
                }

                // send updated userList
                var userListFiltered = userList.filter(user => user.game_id == game._id);
                io.in(game._id.toString()).emit('userListUpdate', ({userList: userListFiltered}));
                socket.to(game._id.toString()).emit('message', ({body: player.username + ' has left.', messageType: 'gameInfo' }));
            }
            catch {

            }

        });

        socket.on('message', async (data) =>{
            if (data.body !== "") {

                // roll command
                if (data.body.toString().match(/^\/(r|roll) /i)) {
                    var roll = data.body.toString().split(/[d|\s|\+|\-]+/i);
                    var rolled = diceRoll(roll[1], roll[2]);
                    var rolledTotal = 0;

                    rolled.forEach((item, i) => {
                        rolledTotal += item;
                    });

                    if (data.body.toString().match(/\+/i)) {
                        var addition = data.body.toString().split(/[d|\s|\+]+/i).slice(-1)[0];
                        var total = rolledTotal + parseInt(addition);
                        var rollMessage = rolled.toString() + ' : ' + roll[2] + ' : ' + rolledTotal + ' : +' + addition + ' : ' + total;
                    }
                    else if (data.body.toString().match(/\-/i)) {
                        var subtraction = data.body.toString().split(/[d|\s|\-]+/i).slice(-1)[0];
                        var total = rolledTotal - parseInt(subtraction);
                        var rollMessage = rolled.toString() + ' : ' + roll[2] + ' : ' + rolledTotal + ' : -' + subtraction + ' : ' + total;
                    }
                    else {
                        var total = rolledTotal;
                        var rollMessage = rolled.toString() + ' : ' + roll[2] + ' : ' + rolledTotal + ' : 0 : ' + total;
                    }

                    console.log(rollMessage);
                    io.in(game._id.toString()).emit('message', ({body: rollMessage, messageType: 'diceRoll', username: player.username}));
                    const message = await Message.create({game: game._id, type: 'diceRoll', senderEmail: player.email, senderUsername: player.username, body: rollMessage})
                }

                // regular chats
                else {
                    if (player.role === "Player") {
                        io.in(game._id.toString()).emit('message', ({body: data.body.toString(), messageType: 'playerChat', username: player.username}));
                        const message = await Message.create({game: game._id, type: 'playerChat', senderEmail: player.email, senderUsername: player.username, body: data.body.toString()})
                    }
                    else if (player.role === "Dungeon Master") {
                        io.in(game._id.toString()).emit('message', ({body: data.body.toString(), messageType: 'dmChat', username: player.username}));
                        const message = await Message.create({game: game._id, type: 'dmChat', senderEmail: player.email, senderUsername: player.username, body: data.body.toString()});

                    }
                    else if (player.role === "Spectator") {
                        io.in(game._id.toString()).emit('message', ({body: data.body.toString(), messageType: 'spectatorChat', username: player.username}));
                        const message = await Message.create({game: game._id, type: 'spectatorChat', senderEmail: player.email, senderUsername: player.username, body: data.body.toString()});
                    }
                }

            }
        });
    });
}

module.exports = socketConnections;
