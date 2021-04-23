const router = require('express').Router();
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const gamesController = require('../controllers/gamesController');
const Game = require('../models/Game');
const User = require('../models/User');
const Character = require('../models/Character');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwtSecret.js');

router.get('/', requireAuth, (req, res) => {
    const token = req.cookies.jwt;
    const checkUser = async () => {
        return new Promise((resolve, reject) => {
            if (token) {
                jwt.verify(token, jwtSecret, async (err, decodedToken) => {
                    let user = await User.findById(decodedToken.id);
                    const data = user.email;
                    resolve(data);
                });
            } else { reject('some error')}
        });
    };

    checkUser().then(async (data) => {
        var player = data;
        Game.find({'players.email': player}).select('name players')
        .then(async (result) => {

        var bob = await Character.findOne({creator: 'asd@asd.com'}).select('name');

        console.log();

        res.render('games', {title: 'Games', games: result});

        })
        .catch((err) => {
            console.log(err);
        });
    });
});

router.get('/create', requireAuth, (req, res) => {
    res.render('gamesCreate', {title: 'Create Game'});
});

router.post('/create', requireAuth, gamesController.create_post);

router.get('/join/spectator', requireAuth, (req, res) => {
    res.render('gamesJoinSpectator', {title: 'Join Game as Spectator'});
});

router.post('/join/spectator', requireAuth, gamesController.join_spectator_post);

router.get('/join/select', requireAuth, (req, res) => {
    const token = req.cookies.jwt;
    const checkUser = async () => {
        return new Promise((resolve, reject) => {
            if (token) {
                jwt.verify(token, jwtSecret, async (err, decodedToken) => {
                    let user = await User.findById(decodedToken.id);
                    const data = user.email;
                    resolve(data);
                });
            } else { reject('some error')}
        });
    };

    checkUser().then(async (data) => {
        const player = data;
        Character.find({'creator': player})
        .then((result) => {
            res.render('gamesJoinSelect', {title: 'Characters', characters: result});
        })
        .catch((err) => {
            console.log(err);
        });
    });
});

router.get('/join/player', requireAuth, (req, res) => {
    var character = req.query.character;
    console.log(req.query.character);
    res.render('gamesJoinPlayer', {title: 'Join Game as Player', character});
});

router.post('/join/player', requireAuth, gamesController.join_player_post);

router.post('/find', requireAuth, gamesController.find_post);

router.post('/play', requireAuth, gamesController.play_post);

module.exports = router;
