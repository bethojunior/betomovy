function addGeneralInfo(){
    elementProperty
        .addEventInElement('#btn-geral-info','onclick', () => {
            const minValue = document.getElementById('minValue').value
            establishment.minDailyRate = minValue !== '' ? parseFloat(minValue.replace(',','.')) : null

            const maxValue = document.getElementById('maxValue').value
            establishment.maxDailyRate = maxValue !== '' ? parseFloat(maxValue.replace(',','.')) : null

            const averageValue =  document.getElementById('averageValue').value
            establishment.averageValue = averageValue !== '' ? parseFloat(averageValue.replace(',','.')) : null

            const indication = document.getElementById('indication-discount').value
            establishment.indicationDiscount = indication !== '' ? parseFloat(indication.replace(',','.')) : null

            validateEmptyGeneralInfo(establishment)
        })
}

function validateEmptyGeneralInfo(establishment) {

    if(establishment.rating === '' || establishment.rating === null) {
        swal('Informe a quantidade de estrelas do hotel','','warning')
        return
    }

    if(establishment.minDailyRate === '' || establishment.minDailyRate === null) {
        swal('Informe o valor mínimo da diária','','warning')
            .then(() => document.getElementById('minValue').focus())
        return
    }

    if(establishment.maxDailyRate === '' || establishment.maxDailyRate === null) {
        swal('Informe o valor máximo da diária','','warning')
            .then(() => document.getElementById('maxValue').focus())
        return
    }

    if(establishment.indicationDiscount === '' || establishment.indicationDiscount === null) {
        swal('Informe o valor do desconto','','warning')
            .then(() => document.getElementById('indication-discount').focus())
        return
    }

    renderContactInfo()
}

function calcAverageValue() {

    let inputMinValue = (document.getElementById('minValue').value).toString()
    inputMinValue = inputMinValue.replace(',','.')

    let inputMaxValue = (document.getElementById('maxValue').value).toString()
    inputMaxValue = inputMaxValue.replace(',','.')

    const minValue = inputMinValue !== '' ? inputMinValue : 0
    const maxValue = inputMaxValue !== '' ? inputMaxValue : 0

    const averageValue = (parseFloat(minValue) + parseFloat(maxValue)) / 2

    elementProperty
        .getElement('#averageValue', element => element.value = parseFloat(averageValue).toFixed(2))
}