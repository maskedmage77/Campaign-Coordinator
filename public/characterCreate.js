
var converter = new showdown.Converter();
var distanceUnit = 'feet';

// function to find index
function finderBoy(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
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

// function to capitalize first letter of string passed in
function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
}

// function to update ability score bonuses
function abilityScoreBonusUpdater(bonuses,subBonus,abilitySelect) {
    var abilitiesBonus = ['strengthBonus','dexterityBonus','constitutionBonus','wisdomBonus','intelligenceBonus','charismaBonus'];
    var strengthBonus = 0, dexterityBonus = 0, constitutionBonus = 0, wisdomBonus = 0, intelligenceBonus = 0, charismaBonus = 0;

    // wipe clean
    abilitiesBonus.forEach((ability, i) => {
        document.getElementById(ability).innerHTML = '';
    });

    // race bonuses
    if (bonuses.strength) {
        strengthBonus = parseInt(bonuses.strength);
    }
    if (bonuses.dexterity) {
        dexterityBonus = parseInt(bonuses.dexterity);
    }
    if (bonuses.constitution) {
        constitutionBonus = parseInt(bonuses.constitution);
    }
    if (bonuses.wisdom) {
        wisdomBonus = parseInt(bonuses.wisdom);
    }
    if (bonuses.intelligence) {
        intelligenceBonus = parseInt(bonuses.intelligence);
    }
    if (bonuses.charisma) {
        charismaBonus = parseInt(bonuses.charisma);
    }

    // race choice bonus
    abilitySelect.forEach((choice, i) => {
        if (choice === 'strength') {
            strengthBonus += 1;
        }
        if (choice === 'dexterity') {
            dexterityBonus += 1;
        }
        if (choice === 'constitution') {
            constitutionBonus += 1;
        }
        if (choice === 'wisdom') {
            wisdomBonus += 1;
        }
        if (choice === 'intelligence') {
            intelligenceBonus += 1;
        }
        if (choice === 'charisma') {
            charismaBonus += 1;
        }
    });

    // subrace bonus
    if (subBonus.strength) {
        strengthBonus += parseInt(subBonus.strength);
    }
    if (subBonus.dexterity) {
        dexterityBonus += parseInt(subBonus.dexterity);
    }
    if (subBonus.constitution) {
        constitutionBonus += parseInt(subBonus.constitution);
    }
    if (subBonus.wisdom) {

        wisdomBonus += parseInt(subBonus.wisdom);
        console.log(wisdomBonus);
    }
    if (subBonus.intelligence) {
        intelligenceBonus += parseInt(subBonus.intelligence);
    }
    if (subBonus.charisma) {
        charismaBonus += parseInt(subBonus.charisma);
    }

    // update UI
    if (strengthBonus) {
        document.getElementById('strengthBonus').innerHTML = '+ ' + strengthBonus;
    }
    if (dexterityBonus) {
        document.getElementById('dexterityBonus').innerHTML = '+ ' + dexterityBonus;
    }
    if (constitutionBonus) {
        document.getElementById('constitutionBonus').innerHTML = '+ ' + constitutionBonus;
    }
    if (wisdomBonus) {
        document.getElementById('wisdomBonus').innerHTML = '+ ' + wisdomBonus;
    }
    if (intelligenceBonus) {
        document.getElementById('intelligenceBonus').innerHTML = '+ ' + intelligenceBonus;
    }
    if (charismaBonus) {
        document.getElementById('charismaBonus').innerHTML = '+ ' + charismaBonus;
    }
}

// fetch the required json files
async function fetchGameData() {
  const [itemsResponse, dataResponse] = await Promise.all([ fetch('./sources/items.json'), fetch('./sources/5th Edition SRD.json')]);
  const placeholder = await itemsResponse.json();
  const data = await dataResponse.json();
  items = placeholder.items;

  return {
    items,
    data
  };
}

// here is the meat of the page
fetchGameData().then(({ items, data }) => {

    // query the dom for required elements
    var raceMenu = document.getElementById('raceMenu');
    var subraceMenu = document.getElementById("subraceMenu");
    var raceTraitsP = document.getElementById("raceTraitsP");
    var subraceTraitsP = document.getElementById("subraceTraitsP");
    var classInfo = document.getElementById('classInfo');
    var classMenu = document.getElementById('classMenu');
    var abilityScoreItem = document.getElementsByClassName("abilityScoreItem");
    var form = document.querySelector('form');
    var abilitiesList = ['strength','dexterity','constitution','wisdom','intelligence','charisma'];
    var languageList = data.languages;
    var abilitySelect = [];
    var languageSelect = [];
    var skillSelect = [];


    // this will add the options
    if (data.races.length > 0) {
        data.races.forEach(race => {
            var newOption = document.createElement('option');
            newOption.setAttribute('value', race.name);
            newOption.innerHTML = race.name;
            raceMenu.append(newOption);
        });
    }

    // this will add the class options
    if (data.classes.length > 0) {
        data.classes.forEach(class_ => {
            var newOption = document.createElement('option');
            newOption.setAttribute('value', class_.name);
            newOption.innerHTML = class_.name;
            classMenu.append(newOption);
        });
    }


    subraceMenu.addEventListener("change", function() {
        var i = finderBoy(data.races, 'name', raceMenu.value);
        var x = finderBoy(data.races[i].subraces, 'name', subraceMenu.value);

        abilityScoreBonusUpdater(data.races[i].abilityScoreIncrease,data.races[i].subraces[x].abilityScoreIncrease,abilitySelect);

        if (data.races[i].subraces[x].abilityScoreIncrease) {
            subraceTraitsP.removeAttribute("hidden");
            for (var key of Object.keys(data.races[i].subraces[x].abilityScoreIncrease)) {

                if (key === "choice") {
                    var abilScoreP = document.createElement('p');
                    abilScoreP.innerHTML = '<span class="traitName">Increase your choice of ability scores by: </span><span class="traitDescription">' + data.races[i].subraces[x].abilityScoreIncrease[key] + '</span>';
                    subraceTraitsP.append(abilScoreP);
                } else {
                    var abilScoreP = document.createElement('p');
                    abilScoreP.innerHTML = '<span class="traitName">'+capitalizeFirstLetter(key)+' increases by: </span><span class="traitDescription">' + data.races[i].subraces[x].abilityScoreIncrease[key] + '</span>';
                    subraceTraitsP.append(abilScoreP);
                }
            };
        }

        if (data.races[i].subraces[x].traits) {
            subraceTraitsP.removeAttribute("hidden");
            data.races[i].subraces[x].traits.forEach(trait => {
                var newP = document.createElement('p');
                newP.innerHTML = '<span class="traitName">' + trait.name + '.</span><span class="traitDescription"> ' + converter.makeHtml(trait.description) + '</span>';
                subraceTraitsP.append(newP);

                if (trait.name === 'Extra Language') {
                    var newChoiceMenu = document.createElement('select');
                    newChoiceMenu.setAttribute('name', 'languageSelect');
                    newChoiceMenu.classList.add('languageSelect');
                    newChoiceMenu.setAttribute('required', '');

                    var option = document.createElement('option');
                    option.setAttribute('value', '');
                    option.setAttribute('disabled', '');
                    option.setAttribute('selected', '');
                    option.innerHTML = 'Select a language';
                    newChoiceMenu.append(option);

                    languageList.forEach((language, i) => {
                        var option = document.createElement('option');
                        option.setAttribute('value', language);
                        option.innerHTML = capitalizeFirstLetter(language);
                        newChoiceMenu.append(option);
                    });

                    subraceTraitsP.append(newChoiceMenu);

                    newChoiceMenu.addEventListener('change', function() {
                        languageSelect = [];
                        document.querySelectorAll("select.languageSelect").forEach((choice, i) => {
                            languageSelect.push(choice.value);
                        });
                        abilityScoreBonusUpdater(data.races[i].abilityScoreIncrease,'',abilitySelect);
                    });
                }

            });
        }
        if (data.races[i].subraces[x].languages) {
            var message = '<span class="traitName">Languages: </span><span class="traitDescription">';
            subraceTraitsP.removeAttribute("hidden");
            var kk = document.createElement('p');
            data.races[i].subraces[x].languages.forEach((language, i) => {
                if (i !== 0) {
                    message = message + ',';
                }
                if (language === "choice") {
                    message = message + ' <i>Player Choice</i>';
                    kk.innerHTML = message;
                } else {
                    message = message + ' ' + capitalizeFirstLetter(language);
                    kk.innerHTML = message;
                }
            });
            subraceTraitsP.append(kk);
        }
    });

    raceMenu.addEventListener("change", function() {
        var i = finderBoy(data.races, 'name', raceMenu.value);

        subraceMenu.selectedIndex = 0;
        subraceTraitsP.innerHTML = '';
        subraceTraitsP.setAttribute("hidden", "");
        raceTraitsP.innerHTML = '';
        raceTraitsP.setAttribute("hidden", "");
        abilitySelect = [];
        languageSelect = [];

        abilityScoreBonusUpdater(data.races[i].abilityScoreIncrease,'',abilitySelect);

        if (data.races[i].size) {
            raceTraitsP.removeAttribute("hidden");
            var f = document.createElement('p');
            f.innerHTML = '<span class="traitName">Size: </span><span class="traitDescription">' + capitalizeFirstLetter(data.races[i].size) + '</span>';
            raceTraitsP.append(f);
        }

        if (data.races[i].speed) {
            raceTraitsP.removeAttribute("hidden");
            var f = document.createElement('p');
            f.innerHTML = '<span class="traitName">Speed: </span><span class="traitDescription">' + data.races[i].speed +' '+ distanceUnit + '</span>';
            raceTraitsP.append(f);
        }

        if (data.races[i].abilityScoreIncrease) {
            raceTraitsP.removeAttribute("hidden");
            for (var key of Object.keys(data.races[i].abilityScoreIncrease)) {
                if (key === "choice") {
                    var abilScoreP = document.createElement('p');
                    abilScoreP.innerHTML = '<span class="traitName">Increase your choice of ability scores by: </span><span class="traitDescription">' + data.races[i].abilityScoreIncrease[key] + '</span>';
                    raceTraitsP.append(abilScoreP);

                    // this will add select elements to choose what abilities will get a increase
                    var choiceAmount = data.races[i].abilityScoreIncrease[key];

                    while (choiceAmount > 0) {
                        var newChoiceMenu = document.createElement('select');
                        newChoiceMenu.setAttribute('name', 'abilitySelect');
                        newChoiceMenu.classList.add('abilitySelect');
                        newChoiceMenu.setAttribute('required', '');

                        var option = document.createElement('option');
                        option.setAttribute('value', '');
                        option.setAttribute('disabled', '');
                        option.setAttribute('selected', '');
                        option.innerHTML = 'Select an ability to increase by 1';
                        newChoiceMenu.append(option);

                        abilitiesList.forEach((ability, i) => {
                            var option = document.createElement('option');
                            option.setAttribute('value', ability);
                            option.innerHTML = capitalizeFirstLetter(ability);
                            newChoiceMenu.append(option);
                        });

                        raceTraitsP.append(newChoiceMenu);
                        choiceAmount -= 1;
                        newChoiceMenu.addEventListener('change', function() {
                            abilitySelect = [];
                            document.querySelectorAll("select.abilitySelect").forEach((choice, i) => {
                                abilitySelect.push(choice.value);
                            });
                            abilityScoreBonusUpdater(data.races[i].abilityScoreIncrease,'',abilitySelect);
                        });

                    }

                } else {
                    var abilScoreP = document.createElement('p');
                    abilScoreP.innerHTML = '<span class="traitName">'+capitalizeFirstLetter(key)+' increases by: </span><span class="traitDescription">' + data.races[i].abilityScoreIncrease[key] + '</span>';
                    raceTraitsP.append(abilScoreP);
                }

            };
        }

        if (data.races[i].traits) {
            raceTraitsP.removeAttribute("hidden");
            data.races[i].traits.forEach(trait => {
                var newP = document.createElement('p');
                newP.innerHTML = '<span class="traitName">' + trait.name + '.</span><span class="traitDescription"> ' + trait.description + '</span>';
                raceTraitsP.append(newP)
            });
        }

        if (data.races[i].languages) {
            var choiceAmount = 0;
            var message = '<span class="traitName">Languages: </span><span class="traitDescription">';
            raceTraitsP.removeAttribute("hidden");
            var kk = document.createElement('p');
            data.races[i].languages.forEach((language, i) => {
                if (i !== 0) {
                    message = message + ',';
                }

                if (language === "choice") {
                    message = message + ' <i>Player Choice</i>';
                    kk.innerHTML = message;
                    choiceAmount += 1;
                } else {
                    message = message + ' ' + capitalizeFirstLetter(language);
                    kk.innerHTML = message;
                }
            });

            raceTraitsP.append(kk);

            while (choiceAmount > 0) {
                var newChoiceMenu = document.createElement('select');
                newChoiceMenu.setAttribute('name', 'languageSelect');
                newChoiceMenu.classList.add('languageSelect');
                newChoiceMenu.setAttribute('required', '');

                var option = document.createElement('option');
                option.setAttribute('value', '');
                option.setAttribute('disabled', '');
                option.setAttribute('selected', '');
                option.innerHTML = 'Select a language';
                newChoiceMenu.append(option);

                languageList.forEach((language, i) => {
                    var option = document.createElement('option');
                    option.setAttribute('value', language);
                    option.innerHTML = capitalizeFirstLetter(language);
                    newChoiceMenu.append(option);
                });

                raceTraitsP.append(newChoiceMenu);
                choiceAmount -= 1;

                newChoiceMenu.addEventListener('change', function() {
                    languageSelect = [];
                    document.querySelectorAll("select.languageSelect").forEach((choice, i) => {
                        languageSelect.push(choice.value);
                    });
                    abilityScoreBonusUpdater(data.races[i].abilityScoreIncrease,'',abilitySelect);
                });
            }

        }

        if (data.races[i].subraces) {
            var firstElementChild = subraceMenu.firstElementChild;
            subraceMenu.innerHTML = '';
            subraceMenu.append(firstElementChild);
            subraceMenu.setAttribute('required', 'true');

            data.races[i].subraces.forEach(subrace => {
                var option = document.createElement("option");
                option.setAttribute("value", subrace.name);
                option.innerHTML = subrace.name;
                subraceMenu.append(option);
            });

            subraceMenu.removeAttribute("hidden");
        }
        else {
            subraceMenu.removeAttribute('required');
            subraceMenu.setAttribute("hidden", "");
            var firstElementChild = subraceMenu.firstElementChild;
            subraceMenu.innerHTML = '';
            subraceMenu.append(firstElementChild);
        }
    });

    classMenu.addEventListener("change", function() {
        var i = finderBoy(data.classes, 'name', classMenu.value);
        classInfo.setAttribute("hidden", "");
        classInfo.innerHTML = '';
        skillSelect = [];

        // display hit dice for selected class
        var hitDiceDisplay = document.createElement('p');
        hitDiceDisplay.innerHTML = '<span ="traitName"> Hit dice:</span><span class="traitDescription"> D' + data.classes[i].hitDice + '</span>';
        classInfo.append(hitDiceDisplay);

        // display saving throws
        if (data.classes[i].savingThrows) {
            var hitDiceDisplay = document.createElement('p');
            var armorProficiencies = '';
            data.classes[i].savingThrows.forEach((ability, i) => {
                if (i !== 0) {
                    armorProficiencies += ', ' + capitalizeFirstLetter(ability);
                }
                else {
                    armorProficiencies = capitalizeFirstLetter(ability);
                }
            });
            hitDiceDisplay.innerHTML = '<span ="traitName">Saving Throws:</span><span class="traitDescription"> ' + armorProficiencies + '</span>';
            classInfo.append(hitDiceDisplay);
        }

        // display armor proficiencies
        if (data.classes[i].armorProficiencies) {
            var hitDiceDisplay = document.createElement('p');
            var armorProficiencies = '';
            data.classes[i].armorProficiencies.forEach((proficiency, i) => {
                if (i !== 0) {
                    armorProficiencies += ', ' + proficiency;
                }
                else {
                    armorProficiencies = proficiency;
                }
            });
            hitDiceDisplay.innerHTML = '<span ="traitName">Armor proficiencies:</span><span class="traitDescription"> ' + armorProficiencies + '</span>';
            classInfo.append(hitDiceDisplay);
        }

        // display weapon proficiencies
        if (data.classes[i].weaponProficiencies) {
            var hitDiceDisplay = document.createElement('p');
            var weaponProficiencies = '';
            data.classes[i].weaponProficiencies.forEach((proficiency, i) => {
                if (i !== 0) {
                    weaponProficiencies += ', ' + proficiency;
                }
                else {
                    weaponProficiencies = proficiency;
                }
            });
            hitDiceDisplay.innerHTML = '<span ="traitName">Weapon proficiencies:</span><span class="traitDescription"> ' + weaponProficiencies + '</span>';
            classInfo.append(hitDiceDisplay);
        }

        // display tool proficiencies
        if (data.classes[i].toolProficiencies) {
            var hitDiceDisplay = document.createElement('p');
            var toolProficiencies = '';
            data.classes[i].toolProficiencies.forEach((proficiency, i) => {
                if (i !== 0) {
                    toolProficiencies += ', ' + proficiency;
                }
                else {
                    toolProficiencies = proficiency;
                }
            });
            hitDiceDisplay.innerHTML = '<span ="traitName">Tool proficiencies:</span><span class="traitDescription"> ' + toolProficiencies + '</span>';
            classInfo.append(hitDiceDisplay);
        }

        // run if there is equipment to select exists
        if (data.classes[i].equipmentSelect) {

            // runs for each question
            data.classes[i].equipmentSelect.forEach((z, y) => {
                var itemSelectMenu = document.createElement('select');
                itemSelectMenu.setAttribute("name", 'equipmentSelect');
                itemSelectMenu.classList.add('equipmentSelect');
                itemSelectMenu.setAttribute('required', '');
                var newDefaultOption = document.createElement('option');
                newDefaultOption.innerHTML = "Select Item";
                newDefaultOption.setAttribute("value","");
                newDefaultOption.setAttribute("disabled",'');
                newDefaultOption.setAttribute("selected",'');
                itemSelectMenu.append(newDefaultOption);

                // runs for each option to the question
                z.options.forEach((option, x) => {
                    var newOption = document.createElement('option');

                    if (option.name) {
                        newOption.innerHTML = capitalizeFirstLetter(option.name);
                        newOption.setAttribute("value", x);
                        itemSelectMenu.append(newOption);
                    }
                    else {
                        if (option.items[0].quantity > 1) {
                            newOption.innerHTML = "(" + option.items[0].quantity + ") " + capitalizeFirstLetter(items[option.items[0].id].name);
                            newOption.setAttribute("value", x);
                            itemSelectMenu.append(newOption);
                        }
                        else {
                            newOption.innerHTML = capitalizeFirstLetter(items[option.items[0].id].name);
                            newOption.setAttribute("value", x);
                            itemSelectMenu.append(newOption);
                        }
                    }
                });
                classInfo.append(itemSelectMenu);
            });
        }

        // run if there are skills to select exists
        if (data.classes[i].skillSelect) {

            var quantity = parseInt(data.classes[i].skillSelect.quantity);

            var skillSelectMenu = document.createElement('div');
            skillSelectMenu.classList.add('skillSelectMenu');

            var skillSelectInfo = document.createElement('p');
            skillSelectInfo.innerHTML = 'As a ' + capitalizeFirstLetter(data.classes[i].name) + ' you can select <span class="accentColor">' + quantity + '</span> skills to be proficient in.'
            classInfo.append(skillSelectInfo);

            data.classes[i].skillSelect.skills.forEach((skill, i) => {
                var newOption = document.createElement('div');
                newOption.innerHTML = capitalizeFirstLetter(skill);
                newOption.setAttribute("data-value",skill);
                skillSelectMenu.append(newOption);

                var selected = false;
                newOption.addEventListener('click', function(){
                    if (selected) {
                        arrayRemove(skillSelect,skill);
                        selected = false;
                        newOption.classList.remove('selected');
                    }
                    else if (skillSelect.length < quantity) {
                        skillSelect.push(skill);
                        selected = true;
                        newOption.classList.add('selected');
                    }

                });
            });
            classInfo.append(skillSelectMenu);
        }

        classInfo.removeAttribute("hidden");
    });

    // increase ablity score
    function increaseScore() {
        if (parseInt(this.parentElement.getElementsByTagName("input")[0].value) < 18) {
            this.parentElement.getElementsByTagName("input")[0].setAttribute("value",
            parseInt(this.parentElement.getElementsByTagName("input")[0].value) + 1);
        }
    };

    // decrease ability score
    function decreaseScore() {
        if (parseInt(this.parentElement.getElementsByTagName("input")[0].value) > 3) {
            this.parentElement.getElementsByTagName("input")[0].setAttribute("value",
            parseInt(this.parentElement.getElementsByTagName("input")[0].value) - 1);
        }
    };

    // add listeners for each ability score type
    for (var i = 0; i < abilityScoreItem.length; i++) {
        abilityScoreItem[i].getElementsByTagName("img")[0].addEventListener('click', increaseScore, false);
        abilityScoreItem[i].getElementsByTagName("img")[1].addEventListener('click', decreaseScore, false);
        abilityScoreItem[i].getElementsByTagName("img")[0].addEventListener('touch', increaseScore, false);
        abilityScoreItem[i].getElementsByTagName("img")[1].addEventListener('touch', decreaseScore, false);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // get the values
        const name = form.name.value;
        const race = form.race.value;
        const subrace = form.subrace.value;
        const _class = form.class.value;
        const strength = form.strength.value;
        const dexterity = form.dexterity.value;
        const constitution = form.dexterity.value;
        const wisdom = form.dexterity.value;
        const intelligence = form.intelligence.value;
        const charisma = form.charisma.value;
        const age = form.age.value;
        const height = form.height.value;
        const weight = form.weight.value;
        const eyes = form.eyes.value;
        const skin = form.skin.value;
        const hair = form.hair.value;
        const appearance = form.appearance.value;
        const backstory = form.backstory.value;
        var equipmentSelect = [];

        // set equipmentSelect
        document.querySelectorAll('select.equipmentSelect').forEach((choice, i) => {
            equipmentSelect.push(choice.value);
        });

        // try to post this character
        try {
            const res = await fetch('/characters/create', {
                method: 'POST',
                body: JSON.stringify({ name, race, subrace, _class,
                strength, dexterity, constitution, wisdom, intelligence, charisma,
                age, height, weight, eyes, skin, hair, appearance, backstory, equipmentSelect,
                abilitySelect, languageSelect, skillSelect}),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (data.character) {
                location.assign('/games');
            }
        }
        catch (err) {
            console.log(err);
        }

    });
});
