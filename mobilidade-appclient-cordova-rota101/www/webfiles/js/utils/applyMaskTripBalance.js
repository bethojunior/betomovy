$(document).ready(function(){
    // $('#initial-credits').on('input', function (element) {
    //     element.target.value = numberToReal(element.target.value)
    // })
    //
    $('#buy-value').maskMoney()

    $('#number-card').mask('0000 0000 0000 0000')

    $('#validate-card').mask('00/0000')

    $('#cvv-card').mask('0000')

    $('#cpf-owner').mask('000.000.000-00')
})



function numberToReal(num) {
    var numero = parseFloat(num);
    numero = numero.toFixed(2).split('.');
    numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
}