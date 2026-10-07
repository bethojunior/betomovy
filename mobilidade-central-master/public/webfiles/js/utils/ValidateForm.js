class ValidateForm {

    static validateNameComplete(name){
        return name.split(" ").length > 1;
    }

    static validateEmail(email){
        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    }

    static validatePhone(phone){
        const regex = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/;
        return regex.test(phone);
    }

    static validateCpf(cpf){
        cpf = cpf.replace(/\D/g, '');

        let sum = 0;
        let rest;
        let i;

        if (cpf === "00000000000") return false;

        for (i=1; i<=9; i++) sum = sum + parseInt(cpf.substring(i-1, i)) * (11 - i);
        rest = (sum * 10) % 11;

        if ((rest === 10) || (rest === 11))  rest = 0;
        if (rest !== parseInt(cpf.substring(9, 10)) ) return false;

        sum = 0;
        for (i = 1; i <= 10; i++) sum = sum + parseInt(cpf.substring(i-1, i)) * (12 - i);
        rest = (sum * 10) % 11;

        if ((rest === 10) || (rest === 11))  rest = 0;
        if (rest !== parseInt(cpf.substring(10, 11) ) ) return false;
        return true;
    }

    static validateCnpj(cnpj) {

        cnpj = cnpj.replace(/[^\d]+/g,'');

        if(cnpj === '') return false;

        if (cnpj.length !== 14)
            return false;

        // Elimina CNPJs invalidos conhecidos
        if (cnpj === "00000000000000" ||
            cnpj === "11111111111111" ||
            cnpj === "22222222222222" ||
            cnpj === "33333333333333" ||
            cnpj === "44444444444444" ||
            cnpj === "55555555555555" ||
            cnpj === "66666666666666" ||
            cnpj === "77777777777777" ||
            cnpj === "88888888888888" ||
            cnpj === "99999999999999")
            return false;

        // Valida DVs
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0,tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        let i;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(0), 10))
            return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0,tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(1), 10))
            return false;

        return true;

    }


}