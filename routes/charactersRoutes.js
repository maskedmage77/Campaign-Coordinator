const router = require('express').Router();
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const gamesController = require('../controllers/gamesController');
const Character = require('../models/Character');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwtSecret.js');
const fs = require('fs');

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
        Character.find({'creator': player})
        .then((result) => {
            res.render('characters', {title: 'Characters', characters: result});
        })
        .catch((err) => {
            console.log(err);
        });
    });
});

router.get('/create', requireAuth, (req, res) => {
    res.render('charactersCreate', {title: 'Create Character'});
});


module.exports = router;
