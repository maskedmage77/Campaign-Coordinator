const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name']
    },
    creator: {
        type: String,
        required: true
    },
    _class: [{
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
        type: String
    }],
    proficiencies: [{
        name: {
            type: String,
            required: true,
            lowercase: true
        },
        type: {
            type: String,
            required: true
        }
    }],
    traits: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
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
    wisdom: {
        type: Number,
        required: true
    },
    intelligence: {
        type: Number,
        required: true
    },
    charisma: {
        type: Number,
        required: true
    },
    hitDice: {
        total: [{
            sides: {
                type: Number,
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        }],
        current: [{
            sides: {
                type: Number,
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        }]
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
    },
    inventory: [{
        name: {
            type: String,
            required: true
        },
        id: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        weight: {
            type: Number,
            required: true
        },
        description: {
            type: String
        },
        type: {
            type: String
        },
        subType: {
            type: String
        },
        equiped: {
            type: Boolean
        },
        damage: [{
            amount: {
                type: String
            },
            type: {
                type: String
            }
        }],
        properties: [{
            type: String
        }],
        charges: {
            type: Number
        },
        armorClass: {
            type: {
                type: String
            },
            mod: {
                type: String
            },
            modMax: {
                type: Number
            },
            base: {
                type: Number
            }
        },
        stealthDisadvantage: {
            type: Boolean
        },
        strenthRequirement: {
            type: Number
        }

    }]
});

const Character = mongoose.model('character', characterSchema);

module.exports = Character;
