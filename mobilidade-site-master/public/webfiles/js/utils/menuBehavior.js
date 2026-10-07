if (PathUrl.getLastUrl() ==  'aplicativo-taxista-em-fortaleza') {
    
    const menu = document.getElementById('navbar')

    excludeItem(menu, 2) 

    const linkPlayStore = 'https://play.google.com/store/apps/details?id=br.com.taxireturn.driver'
    
    addLinkItemMenu(menu,1,linkPlayStore)
    
}

/**
 * 
 * @param {*} menuElement 
 * @param {int} position 
 */
function excludeItem(menuElement, position) {
    
    const itemsmenu = menuElement.getElementsByTagName('LI')

    itemsmenu[itemsmenu.length - position].style.display = 'none'
}

/** 
 * @param {*} menuElement 
 * @param {int} position 
 * @param {string} link 
 */
function addLinkItemMenu(menuElement, position, link) {
    
    const itemsmenu = menuElement.getElementsByTagName('LI')

    const tagA = itemsmenu[itemsmenu.length - position].getElementsByTagName('A')[0]

    tagA.setAttribute('href',link)
    tagA.setAttribute('target','_BLANK')

}