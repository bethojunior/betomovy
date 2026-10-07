const brandImage = document.getElementById('brand-menu');
let pageScrollY = window.pageYOffset;

window.onscroll = () => {

    let currentScrollY = window.pageYOffset;
    
    if(pageScrollY > currentScrollY) {
        document.getElementById("navbar").classList.add('navbar-bg-white');
        changeImage('color')
        document.getElementById("navbar").style.top = "0";
    } else {
        document.getElementById("navbar").classList.remove('navbar-bg-white');
        document.getElementById("navbar").style.top = "-100px";
    }

    if (pageScrollY <= 50 ) {
        document.getElementById("navbar").classList.remove('navbar-bg-white');
        changeImage('white')
    }

    pageScrollY = currentScrollY;
} 


function changeImage(typeImage) {

    if(typeImage === 'white') {
        return brandImage.src = CURRENT_HOST+'webfiles/img/logo/logo_conceito.png';
    }

    return brandImage.src = CURRENT_HOST+'webfiles/img/logo/logo_conceito.png';

}