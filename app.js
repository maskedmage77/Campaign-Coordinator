const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const gamesRoutes = require('./routes/gamesRoutes');
const Post = require('./models/Post');
const Game = require('./models/Game');


console.log('Starting Eliscont.');

// create server function
function server() {
    http.listen(80, function(){
        console.log('Connected to mongodb.');
        console.log('listening on port 80.');
    });
};

// connect to mongodb
const nodeCredentials = require('./nodeCredentials');
mongoose.connect(nodeCredentials, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then((result) => {
        server();
    })
    .catch((err) => console.log(err));

// template engine
app.set('view engine', 'ejs');

// middleware & static files
app.use('/', express.static('public'));
app.use('/games', express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cookieParser());


// socket setup
io.on('connection', socket => {

    socket.on('playerJoined', async (e) => {

        // set the objects
        var player = await Game.findOne({ 'players._id' : e.playerId },{'_id': 0,"players.$": 1 });
        var game =  await Game.findOne({ '_id': e.gameId });

        player = player.players[0];

        socket.join(game._id.toString());

        console.log(typeof game);
        socket.emit('message', ({body: 'Welcome to the game '+ game.name + '.', messageType: 'gameInfo'  }));

        socket.to(game._id.toString()).emit('message', ({body: 'The user ' + player.email + ' has joined.', messageType: 'gameInfo' }));

    });

});


// routes
app.get('*', checkUser);

app.get('/', (req, res) => {
    Post.find().sort({ createdAt: -1}).limit(10)
        .then((result) => {
            res.render('index', {title: 'Home', posts: result})
        })
        .catch((err) => {
            console.log(err);
        });
});

app.use(authRoutes);

app.use('/games', gamesRoutes);
