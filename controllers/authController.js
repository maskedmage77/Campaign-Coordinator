const User = require('../models/User');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwtSecret.js');

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {email: '', password: ''};

    // incorrect email
    if (err.message === 'incorrect email'){
        errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password'){
        errors.password = 'That password is incorrect';
    }

    // duplicate error code

    if (err.code === 11000) {
        if (Object.keys(err.keyPattern)[0] === "email") {
            errors.email = 'that email is already registered';
        }
        if (Object.keys(err.keyPattern)[0] === "username") {
            errors.username = 'that username is already registered';
        }
        return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

// in seconds
const maxAge = 3 * 24 * 60 * 60;

// this will create a token
const createToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: maxAge
    });
}

module.exports.signup_get = (req, res) => {
    res.render('signup', {title: 'Signup'});
}

module.exports.login_get = (req, res) => {
    res.render('login', {title: 'Login'});
}

module.exports.signup_post = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        const user = await User.create({email, username, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
        return res.status(201).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        return res.status(400).json({ errors });
    }

    res.send('new signup');
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
}
