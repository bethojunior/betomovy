waitClickStars()

function waitClickStars() {
    elementProperty
        .addEventInElement('.start', 'onclick', element => {
            paintStars(element.srcElement.getAttribute('value'))
            establishment.rating = (parseInt(element.srcElement.getAttribute('value')) + 1)
        })

}

function paintStars(numStar) {

    const stars = document.getElementsByClassName('start')

    clearStars()

    Object.keys(stars).map((star,index) => {
       if(index <= numStar)
           stars[index].style.color = 'rgb(233, 153, 26)'
   })

}

function clearStars() {
    elementProperty
        .getElement('.start', element => element.style.color = '#666')
}