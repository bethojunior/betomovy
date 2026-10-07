function checkEmail(email) {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
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

function checkCNPJ(cnpj) {

    cnpj = cnpj.replace(/[^\d]+/g, '')

    if (cnpj == '') return false

    if (cnpj.length != 14)
        return false

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false

    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0, tamanho)
    digitos = cnpj.substring(tamanho)
    soma = 0
    pos = tamanho - 7

    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--
        if (pos < 2)
            pos = 9
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1
    numeros = cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7
    for (i = tamanho; i >= 1; i--) {

        soma += numeros.charAt(tamanho - i) * pos--

        if (pos < 2) {
            pos = 9
        }

    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11

    if (resultado != digitos.charAt(1)) {
        return false
    }

    return true
}
