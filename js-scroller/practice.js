var container = document.getElementById('container');
var stickyImage = document.getElementById('stickyImage');
var tempY;
window.addEventListener('scroll', (e) => {
//watch how image moves with scrolleing
    if (window.pageYOffset >= container.offsetTop && window.pageYOffset <= container.offsetTop + container.offsetHeight - window.innerHeight){
        console.log('slinding');
        stickyImage.style.position = 'fixed';
        stickyImage.style.top = '0vh';
        stickyImage.style.marginTop = '';
        tempY = window.pageYOffset;
    } else if (window.pageYOffset <= container.offsetTop){
        console.log('top sxcreen');
        stickyImage.style.position = 'absolute';
        stickyImage.style.top = '';
        stickyImage.style.marginTop = '';       
    } else {
        console.log('stop');
        stickyImage.style.position = 'absolute';
        stickyImage.style.marginTop = tempY + 'px';         
    }
//change images while scroll
    if (window.pageYOffset < document.getElementById('change1').offsetTop){
        stickyImage.textContent = '🍓🍓🍓';
    }
    if (window.pageYOffset > document.getElementById('change1').offsetTop){
        stickyImage.textContent = '🍌🍌🍌';
    }
    if (window.pageYOffset > document.getElementById('change2').offsetTop){
        stickyImage.textContent = '🍏🍏🍏';
    }   
});