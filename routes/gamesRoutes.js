const router = require('express').Router();
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const gamesController = require('../controllers/gamesController');
const Game = require('../models/Game');
const User = require('../models/User');
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
        const player = data;
        Game.find({'players.email': player})
        .then((result) => {
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

router.get('/find', requireAuth, (req, res) => {
    res.render('gamesFind', {title: 'Find Game'});
});

router.post('/find', requireAuth, gamesController.find_post);

router.post('/join', requireAuth, gamesController.join_post);

router.post('/play', requireAuth, gamesController.play_post);

module.exports = router;
