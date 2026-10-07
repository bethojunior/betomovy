class FormatNumber {

    static formatReal(value) {

        let newValue = parseFloat(value)

        newValue = newValue.toFixed(2)


        newValue = newValue.toString()

        newValue = newValue.replace('.',',')

        return 'R$ '+newValue

    }

    static formatLastNumbersCreditCard(cardNumber) {
        return  cardNumber.slice(cardNumber.length - 4)
    }

    static numberToReal(number){
        var numero = parseFloat(number);
        var numero = numero.toFixed(2).split('.');
        numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    }
}