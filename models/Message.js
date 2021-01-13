const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    game: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    sender: {
        type: String
    },
    recipient: {
        type: String
    },
    body: {
        type: String
        required: true
    }
}, {timestamps: true});

const Message = mongoose.model('message', messageSchema);

module.exports = Message;
