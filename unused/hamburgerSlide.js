document.addEventListener("DOMContentLoaded", function(){
    var ham = document.getElementById('Hamburger_icon');
    var content = document.getElementsByClassName('content')[0];
    var navMenu = document.getElementsByClassName('navMenu')[0];
    var hamOpen = false;

    ham.onclick = function() {
        if (hamOpen === false) {
            hamOpen = true;
            console.log('it opened');
            navMenu.classList.add('slideRight');
            content.classList.add('slideRight');
            navMenu.classList.remove('slideLeft');
            content.classList.remove('slideLeft');
        } else {
            hamOpen = false;
            console.log('it closed');
            navMenu.classList.add('slideLeft');
            content.classList.add('slideLeft');
            navMenu.classList.remove('slideRight');
            content.classList.remove('slideRight');
        }
    }
});
