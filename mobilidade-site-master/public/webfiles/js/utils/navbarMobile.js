document.addEventListener('DOMContentLoaded', () => {

    if(document.getElementById('optionMenu') !== null) {

        const menu = document.getElementById('optionMenu')

        menu.addEventListener('click', () => {
        
        const statusMenu = menu.classList
        const optionsMenu =  document.getElementsByClassName('container-menu-options')

        for(let i in statusMenu) {
            
            if(statusMenu[i] === 'open') {
                menu.classList.remove('open')
                optionsMenu[0].classList.remove('active')
                return
            }

            menu.classList.add('open')
        }

        optionsMenu[0].classList.add('active')

        })
    }

})
