const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name'],
        unique: true
    },
    description: {
      type: String
    },
    players: [{
        email: {
            type: String
        },
        role: {
            type: String
        },
        character: {
            type: String
        }
    }],
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
});

// fire before saved to db
gameSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    next();
    }
});

// static method to
gameSchema.statics.pass = async function(_id, password, user, role, character) {
    let game = await this.findOne({ _id });
    game.players.forEach(i => {
        if (i.email === user && i.role === 'Spectator' && role === 'Spectator') {
            console.log('yeet')
            throw Error('already spectator');
        }
        else if (i.email === user && i.role === 'Player' && i.character === character) {
            console.log('yeet')
            throw Error('character already in game');
        }
    });

    if (game) {
        const auth = await bcrypt.compare(password, game.password);
        if (auth) {
            return this.findOne({ _id });
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect game');
}

const Game = mongoose.model('game', gameSchema);

module.exports = Game;
