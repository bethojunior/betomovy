$(document).ready(function () {

    $('#hostel-cep').mask('00000-000')

    $('#hostel-cnpj').mask('00.000.000/0000-00')

    // $('.mask-cpf').mask('000.000.000-00')
    //
    // document.getElementById('documentType').onchange = element => {
    //
    //     const selectDocument = element.target.options[element.target.selectedIndex].getAttribute('value')
    //
    //     if(selectDocument === 'cpf') {
    //         $('#bankDocument').mask('000.000.000-00')
    //         return
    //     }
    //
    //     $('#bankDocument').mask('00.000.000.0000/00')
    //     return
    // }
})

function applyMaskBasicInfo() {
    $('#hostel-cep').mask('00000-000')

    $('#hostel-cnpj').mask('00.000.000.0000/00')
}

function applyMaskGeneralInfo() {

   // $('.mask-money').maskMoney({allowNegative: true, thousands:'.', decimal:',', affixesStay: false})
    MaskService.setMoneyField(".mask-money");
}

function applyMaskPhone() {
    $('.mask-telefone').mask(function (val) {
            return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    }, {
        onKeyPress: function (val, e, field, options) {
            field.mask(function (val) {
                return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
            }.apply({}, arguments), options);
        }
    });
}

function applyMaksBankDocument() {
    document.getElementById('document-bank-type').onchange = element => {

        const selectDocument = element.target.options[element.target.selectedIndex].getAttribute('value')

        if(selectDocument === 'cpf') {
            $('#document-bank').mask('000.000.000-00')
            return
        }

        $('#document-bank').mask('00.000.000/0000-00')
        return
    }
}

function applyMasksAddEmployee() {

    //$('.mask-money').maskMoney({allowNegative: true, thousands:'.', decimal:',', affixesStay: false})
    MaskService.setMoneyField('.mask-money')

    $('#cpf-employee').mask('000.000.000-00')

    applyMaskPhone()

}