const mongoose = require('mongoose');

const spellSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ritual: {
        type: Boolean,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    school: {
        type: String,
        required: true
    },
    castingTime: {
        type: String,
        required: true
    },
    range: {
        type: String,
        required: true
    },
    components: {
        v: {
            type: Boolean,
            required: true
        },
        s: {
            type: Boolean,
            required: true
        },
        m: {
            type: Boolean,
            required: true
        },
        material: {
            type: String
        }
    },
    duration: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    atHigherLevel: {
        type: String
    },
    classes: [{
        type: String,
        required: true
    }],
    source: {
        type: String,
        required: true
    }
});

const Spell = mongoose.model('spell', spellSchema);

module.exports = Spell;
