elementProperty.addEventInElement('.width-input-inf-media-minima','onchange', () => calcAverageValue())
elementProperty.addEventInElement('.width-input-inf-media-maxima','onchange', () => calcAverageValue())

function calcAverageValue() {

    let inputMinValue = document.getElementsByClassName('width-input-inf-media-minima')[0].value
    inputMinValue = inputMinValue.replace(',','.')

    let inputMaxValue = document.getElementsByClassName('width-input-inf-media-maxima')[0].value
    inputMaxValue = inputMaxValue.replace(',','.')

    const minValue = inputMinValue !== '' ? inputMinValue : 0
    const maxValue = inputMaxValue !== '' ? inputMaxValue : 0

    const averageValue = (parseFloat(minValue) + parseFloat(maxValue)) / 2

    elementProperty
        .getElement('.width-input-inf-media', element => element.value = parseFloat(averageValue).toFixed(2))
}




