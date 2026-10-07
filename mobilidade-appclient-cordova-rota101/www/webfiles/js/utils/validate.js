const lenghtResidencialNumber = 15
let statusValidate = false

function validatePhone(elementsPhone) {

    Object.keys(elementsPhone).map(index => {
        if(elementsPhone[index].value.length < lenghtResidencialNumber) {
            swal('Número de telefone inválido','','warning')
            elementsPhone[index].focus()
            statusValidate = false
            return statusValidate
        }

        statusValidate = true
    })

    return statusValidate
    
}

function validatePhoneValue(phone) {

    if(phone.length < lenghtResidencialNumber) {
        swal('Número de telefone inválido','','warning')
        statusValidate = false
        return false
    }

    return true

}


function checkCPF(cpf) {

    let sum = 0;
    var remainder;
    cpf = cpf.replace(/[^\d]+/g, '')

    if (cpf == "00000000000") return false

    for (i = 1; i <= 9; i++) {
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i)
    }

    remainder = (sum * 10) % 11

    if ((remainder == 10) || (remainder == 11)) {
        remainder = 0
    }

    if (remainder != parseInt(cpf.substring(9, 10))) {
        return false
    }

    sum = 0;

    for (i = 1; i <= 10; i++) {
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i)
    }

    remainder = (sum * 10) % 11

    if ((remainder == 10) || (remainder == 11)) {
        remainder = 0
    }

    if (remainder != parseInt(cpf.substring(10, 11))) {
        return false
    }

    return true
}