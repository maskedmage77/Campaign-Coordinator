const User = require('../models/User');
const Character = require('../models/Character');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwtSecret.js');
const fs = require('fs');

module.exports.create_post = async (req, res) => {

    const token = req.cookies.jwt;
    const checkUser = async () => {
        return new Promise((resolve, reject) => {
            if (token) {
                jwt.verify(token, jwtSecret, async (err, decodedToken) => {
                    let user = await User.findById(decodedToken.id);
                    const creator = user.email;
                    resolve(creator);
                });
            } else { reject('some error')}
        });
    };

    checkUser().then(async (data) => {
        const creator = data;
        var { name, race, subrace, _class,
            strength, dexterity, constitution, wisdom, intelligence, charisma,
            age, height, weight, eyes, skin, hair, appearance, backstory,
            equipmentSelect, abilitySelect, languageSelect, skillSelect, toolSelect} = req.body;

        var sourceFile = JSON.parse(fs.readFileSync('./public/sources/5th Edition SRD.json'));
        var itemList = JSON.parse(fs.readFileSync('./public/sources/items.json'));
        itemList = itemList.items;

        var abilitiesList = ['strength','dexterity','constitution','wisdom','intelligence','charisma'];

        // function to find count in countInArray
        function countInArray(array, what) {
            return array.filter(item => item == what).length;
        }

        // function to find index
        function finderBoy(array, attr, value) {
            for (var i = 0; i < array.length; i += 1) {
                if (array[i][attr] === value) {
                    return i;
                }
            }
            return -1;
        }

        // function to find array object
        function finderObject(array, attr, value) {
            for (var i = 0; i < array.length; i += 1) {
                if (array[i][attr] === value) {
                    return array[i];
                }
            }
            return -1;
        }

        // function to remove something from array
        function arrayRemove(array,item) {
            for( var i = 0; i < array.length; i++){
                if ( array[i] === item) {
                    array.splice(i, 1);
                }
            }
        }

        // get index of class, race, & subrace
        var raceIndex = finderBoy(sourceFile.races, 'name', race);
        var classIndex = finderBoy(sourceFile.classes, 'name', _class);
        var raceInfo = sourceFile.races[raceIndex];
        var classInfo = sourceFile.classes[classIndex];

        // declare variables from source files
        var speed = parseInt(raceInfo.speed);
        var size = raceInfo.size;
        var languages = raceInfo.languages;
        var inspiration = 0;
        var proficiencyBonus= 2;
        var initiative = 0;

        // setting hit dice
        var hitDice = {};
        hitDice.total = [];
        hitDice.current = [];
        hitDice.total.push({sides: parseInt(classInfo.hitDice), amount: 1});
        hitDice.current = hitDice.total;

        var armorProficiencies = classInfo.armorProficiencies;
        var weaponProficiencies = classInfo.weaponProficiencies;
        var savingThrows = classInfo.savingThrows;

        // languages
        languages = languages.concat(languageSelect);
        arrayRemove(languages,'choice');

        // traits
        var traits = [];
        if (raceInfo.hasOwnProperty('traits')) {
            traits = traits.concat(raceInfo.traits);
        }

        // proficiencies
        var armorProficiencies = [];
        var weaponProficiencies = [];
        var toolProficiencies = [];
        var skillProficiencies = [];

        // add proficiencies
        if (classInfo.hasOwnProperty('armorProficiencies')) {
            armorProficiencies = armorProficiencies.concat(classInfo.armorProficiencies);
        }
        if (classInfo.hasOwnProperty('weaponProficiencies')) {
            weaponProficiencies = weaponProficiencies.concat(classInfo.weaponProficiencies);
        }
        if (classInfo.hasOwnProperty('toolProficiencies')) {
            toolProficiencies = toolProficiencies.concat(classInfo.toolProficiencies);
        }
        toolProficiencies = toolProficiencies.concat(toolSelect);
        if (classInfo.hasOwnProperty('skillProficiencies')) {
            skillProficiencies = skillProficiencies.concat(classInfo.skillProficiencies);
        }
        skillProficiencies = skillProficiencies.concat(skillSelect);

        // add selected ability bonus to total
        if (countInArray(abilitySelect, 'strength') > 0) {strength = parseInt(strength) + countInArray(abilitySelect, 'strength');} else {
            strength = parseInt(strength);
        };
        if (countInArray(abilitySelect, 'dexterity') > 0) {dexterity = parseInt(dexterity) + countInArray(abilitySelect, 'dexterity');} else {
            dexterity = parseInt(dexterity);
        };
        if (countInArray(abilitySelect, 'constitution') > 0) {constitution = parseInt(constitution) + countInArray(abilitySelect, 'constitution');} else {
            constitution = parseInt(constitution);};
        if (countInArray(abilitySelect, 'wisdom') > 0) {wisdom = parseInt(wisdom) + countInArray(abilitySelect, 'wisdom');} else {
            wisdom = parseInt(wisdom);
        };
        if (countInArray(abilitySelect, 'intelligence') > 0) {intelligence = parseInt(intelligence) + countInArray(abilitySelect, 'intelligence');} else {
            intelligence = parseInt(intelligence);
        };
        if (countInArray(abilitySelect, 'charisma') > 0) {charisma = parseInt(charisma) + countInArray(abilitySelect, 'charisma');} else {
            charisma = parseInt(charisma);
        };

        // add race ability score bonus
        if (raceInfo.abilityScoreIncrease) {
            if (raceInfo.abilityScoreIncrease.strength) {
                strength = strength + parseInt(raceInfo.abilityScoreIncrease.strength);
            }
            if (raceInfo.abilityScoreIncrease.dexterity) {
                dexterity = dexterity + parseInt(raceInfo.abilityScoreIncrease.dexterity);
            }
            if (raceInfo.abilityScoreIncrease.constitution) {
                constitution = constitution + parseInt(raceInfo.abilityScoreIncrease.constitution);
            }
            if (raceInfo.abilityScoreIncrease.wisdom) {
                wisdom = wisdom + parseInt(raceInfo.abilityScoreIncrease.wisdom);
            }
            if (raceInfo.abilityScoreIncrease.intelligence) {
                intelligence = intelligence + parseInt(raceInfo.abilityScoreIncrease.intelligence);
            }
            if (raceInfo.abilityScoreIncrease.charisma) {
                charisma = charisma + parseInt(raceInfo.abilityScoreIncrease.charisma);
            }
        }

        // subrace additions
        if (sourceFile.races[raceIndex].subraces) {
            var subraceIndex = finderBoy(sourceFile.races[raceIndex].subraces, 'name', subrace);
            var subraceInfo = sourceFile.races[raceIndex].subraces[subraceIndex];

            if (subraceInfo.hasOwnProperty('languages')) {
                languages = languages.concat(subraceInfo.languages);
                arrayRemove(languages,'choice');
            }

            if (subraceInfo.hasOwnProperty('traits')) {
                traits = traits.concat(subraceInfo.traits);
                arrayRemove(languages,'choice');
            }

            if (subraceInfo.hasOwnProperty('abilityScoreIncrease')) {
                if (subraceInfo.abilityScoreIncrease.strength) {
                    strength = strength + parseInt(subraceInfo.abilityScoreIncrease.strength);
                }
                if (subraceInfo.abilityScoreIncrease.dexterity) {
                    dexterity = dexterity + parseInt(subraceInfo.abilityScoreIncrease.dexterity);
                }
                if (subraceInfo.abilityScoreIncrease.constitution) {
                    constitution = constitution + parseInt(subraceInfo.abilityScoreIncrease.constitution);
                }
                if (subraceInfo.abilityScoreIncrease.wisdom) {
                    wisdom = wisdom + parseInt(subraceInfo.abilityScoreIncrease.wisdom);
                }
                if (subraceInfo.abilityScoreIncrease.intelligence) {
                    intelligence = intelligence + parseInt(subraceInfo.abilityScoreIncrease.intelligence);
                }
                if (subraceInfo.abilityScoreIncrease.charisma) {
                    charisma = charisma + parseInt(subraceInfo.abilityScoreIncrease.charisma);
                }
            }
        }

        // add class features to combined traits list
        if (classInfo.hasOwnProperty('features')) {
            classInfo.features.forEach((feature, i) => {
                if (feature.level.isArray) {
                    if (feature.level.includes(1)) {
                        traits = traits.concat(feature);
                    }
                }
                else {
                    if (feature.level === 1) {
                        traits = traits.concat(feature);
                    }
                }
            });
        }

        traits.forEach(function(v){ delete v.shown });
        traits.forEach(function(v){ delete v.level });

        // calculate hitpoints
        var conMod = Math.floor((constitution - 10) / 2);
        var maximumHitpoints = parseInt(classInfo.hitDice) + conMod;
        var currentHitpoints = maximumHitpoints;
        var temporaryHitpoints = 0;

        // initialize _class
        var classStuff = {name: _class, level: 1};
        _class = [classStuff];

        // initialize proficiencies
        var proficiencies = [];
        armorProficiencies.forEach((proficiency, i) => {
            proficiencies.push({name: proficiency, type: 'armor'});
        });
        weaponProficiencies.forEach((proficiency, i) => {
            proficiencies.push({name: proficiency, type: 'weapon'});
        });
        toolProficiencies.forEach((proficiency, i) => {
            proficiencies.push({name: proficiency, type: 'tool'});
        });
        skillProficiencies.forEach((proficiency, i) => {
            proficiencies.push({name: proficiency, type: 'skill'});
        });
        savingThrows.forEach((proficiency, i) => {
            proficiencies.push({name: proficiency, type: 'savingThrow'});
        });

        // initialize inventory
        var inventory = [];

        // add items from class
        classInfo.equipment.forEach((item, i) => {
            if (item.hasOwnProperty('quantity')) {
                var result = itemList.filter(item2 => {
                    return item2.id === item.id;
                });
                if (result[0].type === "armor") {
                    result[0].equiped = true;
                };
                result[0].quantity = item.quantity;
                inventory = inventory.concat(result);
            }
            else {
                var result = itemList.filter(item2 => {
                    return item2.id === item.id;
                });
                if (result[0].type === "armor") {
                    result[0].equiped = true;
                };
                result[0].quantity = 1;
                inventory = inventory.concat(result);
            }
        });

        // add selected items
        equipmentSelect.forEach((selection, i) => {
            items = classInfo.equipmentSelect[i].options[selection].items;
            items.forEach((item, i) => {
                if (item.hasOwnProperty('quantity')) {
                    var result = itemList.filter(item2 => {
                        return item2.id === item.id;
                    });
                    if (result[0].type === "armor") {
                        result[0].equiped = true;
                    };
                    result[0].quantity = item.quantity;
                    inventory = inventory.concat(result);
                }
                else {
                    var result = itemList.filter(item2 => {
                        return item2.id === item.id;
                    });
                    if (result[0].type === "armor") {
                        result[0].equiped = true;
                    };
                    result[0].quantity = 1;
                    inventory = inventory.concat(result);
                }
            });
        });

        // initializing armor class
        var armorClass = 10;
        var dexMod = Math.floor((dexterity - 10) / 2);
        var isArmor = false;
        inventory.forEach((item, i) => {
            if (item.type === 'armor') {
                armorClass = item.armorClass.base;
                if (item.armorClass.modMax) {
                    isArmor = true;
                    var modifier = Math.min(item.armorClass.modMax, dexMod);
                    armorClass = armorClass + modifier;
                }
                else {
                    isArmor = true;
                    armorClass = armorClass + dexMod;
                }
            }
        });
        if (!isArmor) {
            armorClass = armorClass + dexMod;
            traits.forEach((trait, i) => {
                if (trait.name === "unarmored defence") {
                    armorClass = 10 + dexMod + conMod;
                }
            });
        }

        try {
            const character = await Character.create({
                name,
                creator,
                _class,
                race,
                languages,
                proficiencies,
                traits,
                strength,
                dexterity,
                constitution,
                wisdom,
                intelligence,
                charisma,
                hitDice,
                currentHitpoints,
                maximumHitpoints,
                temporaryHitpoints,
                armorClass,
                initiative,
                speed,
                inspiration,
                proficiencyBonus,
                age,
                height,
                weight,
                eyes,
                skin,
                hair,
                appearance,
                backstory,
                inventory
                });
            return res.status(201).json({ character });
            res.redirect('/characters');
        }
        catch (err) {
            console.log(err)
            return res.status(400);
        }
    });
}
