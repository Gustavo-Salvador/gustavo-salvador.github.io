var doOnce = 0
var doOnce2 = 1

window.addEventListener('scroll', () => {
    var posY = window.pageYOffset || document.documentElement.scrollTop;
    document.body.style.setProperty('--scroll', posY / (document.body.offsetHeight - window.innerHeight));
    if (window.scrollY >= 314) {     
        if (doOnce == 0) {
            document.getElementById('logo-container').style.position = 'absolute';
            document.getElementById('logo-container').style.top = posY + 'px';
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
        if ((cardElements[i].getBoundingClientRect().top * 1.6) < posY) {
            cardElements[i].style.animationPlayState = 'running';
        }
    }
}, false);