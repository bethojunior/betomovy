$(document).ready(function () {
    if(screen.width <= 798) {

        const brandHome = document.getElementById('home-logo');

        let pageScrollYHome = window.pageYOffset;

        window.onscroll = () => {

            let currentScrollY = window.pageYOffset;

            if(pageScrollYHome > currentScrollY) {
                document.getElementById("navbar-home").classList.add('navbar-bg-white', 'show-navbar');
                document.getElementById("navbar-home").classList.remove('hidden-navbar');
                document.getElementById("navbar-home").style.display = 'block';
                changeImage('color');
                document.getElementById("navbar-home").style.top = "0";;
            } else {
                document.getElementById("navbar-home").style.display = 'none';
                document.getElementById("navbar-home").classList.add('navbar-bg-white','hidden-navbar');
                document.getElementById("navbar-home").classList.remove('navbar-bg-white','show-navbar');
                document.getElementById("navbar-home").style.top = "-100px";
            }

            if (pageScrollYHome <= 50 ) {
                document.getElementById("navbar-home").classList.remove('navbar-bg-white');
                changeImage('white');
            }

            pageScrollYHome = currentScrollY;
        }


        function changeImage(typeImage) {

            if(typeImage === 'white') {
                return brandHome.src = CURRENT_HOST+'webfiles/img/logo-branca.png';
            }

            return brandHome.src = CURRENT_HOST+'webfiles/img/logo-branca.png';

        }

    }
});