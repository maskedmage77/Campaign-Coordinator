const mongoose = require('mongoose');
const { isEmail } = require('validator');


const characterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name']
    },
    creator: {
        type: String,
        required: true
    },
    class: [{
        name: {
            type: String,
            required: true
        },
        level: {
            type: Number,
            required: true
        },
        subclass: {
            type: String
        }
    }],
    race: {
        type: String,
        required: true
    },
    subrace: {
        type: String
    },
    languages: [{
        name: {
            type: String,
            required: true
        },
        id: {
            type: Number,
            required: true
        }
    }],
    proficiencies: [{
        name: {
            type: String,
            required: true
        },
        id: {
            type: Number,
            required: true
        }
    }],
    traits: [{
        name: {
            type: String,
            required: true
        },
        id: {
            type: Number,
            required: true
        }
    }],
    strength: {
        type: Number,
        required: true
    },
    dexterity: {
        type: Number,
        required: true
    },
    constitution: {
        type: Number,
        required: true
    },
    intelligence: {
        type: Number,
        required: true
    },
    wisdom: {
        type: Number,
        required: true
    },
    charisma: {
        type: Number,
        required: true
    },
    currentHitpoints: {
        type: Number,
        required: true
    },
    maximumHitpoints: {
        type: Number,
        required: true
    },
    temporaryHitpoints: {
        type: Number,
        required: true
    },
    armorClass: {
        type: Number
    },
    initiative: {
        type: Number
    },
    speed: {
        type: Number
    },
    inspiration: {
        type: Number
    },
    proficiencyBonus: {
        type: Number
    },
    age: {
        type: String
    },
    height: {
        type: String
    },
    weight: {
        type: String
    },
    eyes: {
        type: String
    },
    skin: {
        type: String
    },
    hair: {
        type: String
    },
    appearance: {
        type: String
    },
    backstory: {
        type: String
    }
});

const Character = mongoose.model('character', characterSchema);

module.exports = Character;