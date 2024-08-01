var doOnce = 0
var doOnce2 = 1

window.addEventListener('scroll', () => {
    var posY = document.documentElement.scrollTop;
    var logoPosition = ((window.innerHeight -  ((document.getElementById('logo-container').getBoundingClientRect().bottom - document.getElementById('logo-container').getBoundingClientRect().top) / 2)));
    document.body.style.setProperty('--scroll', posY / logoPosition);
    if (window.scrollY >= ((window.innerHeight -  logoPosition))) {     
        if (doOnce == 0) {
            document.getElementById('logo-container').style.position = 'absolute';
            document.getElementById('logo-container').style.top = logoPosition + 'px';
            doOnce = 1
            doOnce2 = 0
        } 
    } else {
        if (doOnce2 == 0) {
            document.getElementById('logo-container').style.position = 'fixed';
            document.getElementById('logo-container').style.top = '';
            doOnce2 = 1
            doOnce = 0
        }
    }

    var cardElements = document.getElementsByClassName('cardContainer');
    for (var i = 0; i < cardElements.length; i++) {
        if (cardElements[i].getBoundingClientRect().top < (window.innerHeight * 0.8)) {
            cardElements[i].style.animationPlayState = 'running';
        }
    }
}, false);