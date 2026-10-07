
let screenWidth = document.body.clientWidth

window.onresize =  () => {
    screenWidth = document.body.clientWidth
}

function isMobile() {
    if(screenWidth >= 991)
        return false
    return true
}