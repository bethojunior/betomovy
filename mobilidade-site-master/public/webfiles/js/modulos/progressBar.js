
    const inputs  = document.getElementsByTagName('INPUT')

    Object.keys(inputs).map(index => {

        inputs[index].onfocus = () =>
            document.getElementsByClassName('progress-content')[0].style.position = 'relative'

        inputs[index].onblur = () =>
            document.getElementsByClassName('progress-content')[0].style.position = 'absolute'

    })

