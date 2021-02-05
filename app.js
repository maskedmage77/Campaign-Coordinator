const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const gamesRoutes = require('./routes/gamesRoutes');
const charactersRoutes = require('./routes/charactersRoutes');
const Post = require('./models/Post');
const Game = require('./models/Game');
const Spell = require('./models/Spell');
const User = require('./models/User');
const socketConnections = require('./socketConnections');


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
app.use('/characters', express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cookieParser());

socketConnections(io,Game,User);

// routes
app.get('*', checkUser);

app.get('/', (req, res) => {
    Post.find().sort({ createdAt: -1}).limit(10)
        .then((result) => {
            res.render('index', {title: 'Home', posts: result});
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/account', requireAuth, (req, res) => {
    res.render('account', {title: 'Account'});
});

app.get('/legal', (req, res) => {
    res.render('legal', {title: 'Legal'});
});

app.get('/about', (req, res) => {
    res.render('about', {title: 'About'});
});

app.use(authRoutes);

app.use('/characters', charactersRoutes);

app.use('/games', gamesRoutes);

app.get('/spells/create', requireAuth, (req, res) => {
    res.render('spellsCreate', {title: 'Create Spell'});
})

app.post('/spells/create', requireAuth, async (req, res) => {
    // const { name, password, description } = req.body;
    try {
        const spell = await Spell.create(req.body);
        return res.status(201).json({ spell: spell.name });
        res.redirect('/spells/create');
    }
    catch (err) {
        return res.status(400);
    }
});
