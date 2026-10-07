$(document).ready(function () {

    $('#inf-cep').mask('00000-000')

    $('#inf-cnpj').mask('00.000.000.0000/00')

    $('.mask-money').maskMoney({allowNegative: true, thousands:'.', decimal:',', affixesStay: false})

    $('.mask-cpf').mask('000.000.000-00')

    document.getElementById('documentType').onchange = element => {

        const selectDocument = element.target.options[element.target.selectedIndex].getAttribute('value')

        if(selectDocument === 'cpf') {
            $('#bankDocument').mask('000.000.000-00')
            return
        }

        $('#bankDocument').mask('00.000.000.0000/00')
        return
    }

    $('.mask-telefone').mask(function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    }, {
        onKeyPress: function (val, e, field, options) {
            field.mask(function (val) {
                return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
            }.apply({}, arguments), options);
        }
    });

})