const User = require('../models/User');
const Game = require('../models/Game');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwtSecret.js');

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {name: '', password: ''};

    // incorrect email
    if (err.message === 'incorrect email'){
        errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password'){
        errors.password = 'That password is incorrect';
    }

    // already spectator
    if (err.message === 'already spectator'){
        errors.password = 'You are already spectating this game';
    }

    // duplicate error code
    if (err.code === 11000) {
        errors.name = 'that game name is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('game validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

module.exports.create_post = async (req, res) => {

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
        const creator = data;
        const { name, password } = req.body;
        try {
            const game = await Game.create({name, players: {email: data, role: 'Dungeon Master'}, password});
            return res.status(201).json({ game: game._id });
            res.redirect('/games');
        }
        catch (err) {
            const errors = handleErrors(err);
            return res.status(400).json({ errors });
        }
    });
}

module.exports.find_post = async (req, res) => {
    const { name } = req.body;
    try {
        const game = await Game.find({name}).select({ name, "players.length": 1});
        res.status(200).json({ game });
    }
    catch (err) {
        const errors = handleErrors(err);
        return res.status(400).json({ errors });
    }
}

module.exports.join_post = async (req, res) => {
    const token = req.cookies.jwt;
    const checkUser = async () => {
        return new Promise((resolve, reject) => {
            if (token) {
                jwt.verify(token, jwtSecret, async (err, decodedToken) => {
                    let user = await User.findById(decodedToken.id);
                    const data = user.email;
                    resolve(data);
                });
            } else { reject('some error')};
        });
    };

    checkUser().then(async (data) => {
        const user = data;
        const { _id, role, password } = req.body;

        try {
            const pass = await Game.pass(_id, password, user, role);
            await pass.players.push({
                'email': user,
                'role': role
            });
            await pass.save();
            res.status(200).json({ _id });
        }
        catch (err) {
            const errors = handleErrors(err);
            return res.status(400).json({ errors });
        }
    });
}

module.exports.play_post = async (req, res) => {
    const token = req.cookies.jwt;
    const checkUser = async () => {
        return new Promise((resolve, reject) => {
            if (token) {
                jwt.verify(token, jwtSecret, async (err, decodedToken) => {
                    let user = await User.findById(decodedToken.id);
                    const data = user.email;
                    resolve(data);
                });
            } else { reject('some error')};
        });
    };

    checkUser().then(async (data) => {
        const user = data;

        const { gameId, playerId } = req.body;
        const game = await Game.findOne({ 'players._id' : playerId, '_id': gameId, 'players.email': user}).select('name players');
        if (game) {
            res.render('gamesPlay', {title: game.name, gameId, playerId});
        };

    });
}
