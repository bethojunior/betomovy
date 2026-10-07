document.addEventListener("DOMContentLoaded", function () {
    const selectCity = document.getElementById('citySelect');

    preload(true);
    selectCity.innerHTML += Session.getLocal64("cities").map(({cityId, nome}) => {
        return `<option value='${cityId}'>${nome}</option>`
    }).join("");

    setTimeout(() => {
        preload(false);
    }, 2000);
});

document.getElementById("date-start").valueAsDate = new Date();
document.getElementById("date-end").valueAsDate = new Date();
let driverId = 0;

    $('#mount-drivers').select2({
        placeholder: 'Selecione o responsável',
        width: '100%',
        ajax: {
            url: `${ConnectionServer.HostV2()}driver/list/select2`,
            headers: {
                'token': Session.getValueInSession('user', 'api_token'),
                'userid': Session.getValueInSession('user', 'idUser')
            },
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    'name': params.term,
                };
            },
            processResults: function (result, params) {
                params.page = params.page || 1;
                return {
                    results: result.response.map(user => {
                        return {
                            id: user.id,
                            text: user.text,
                            email: user.email,
                            phone: user.phone
                        }
                    }),
                };
            },
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        minimumInputLength: 1,
        templateResult: formatSelecting,
        templateSelection: formatRepoSelection
    });

function formatSelecting(result) {
    if (result.loading) {
        return "Buscando...";
    }

    return `<div class="item-select2" value="${result.id}">
                    <div>
                        ${result.text}
                    </div>
                    <div>   
                        ${result.email}
                    </div>
                    <div>
                        ${result.phone}
                    </div>
                </div>`;
}

function formatRepoSelection(result) {
    driverId = result.id;
    elementProperty.getElement('#userId', id => {
        id.value   = result.id;
    });

    elementProperty.getElement('#phone-user' , phone => {
        phone.value = result.phone;
    });

    elementProperty.getElement('#name-user' , email => {
        email.value = result.text;
    });

    email_now_user = result.email;

    return result.text;
}

elementProperty.addEventInElement('#btn-do-filter','onclick',function () {
    let data = '';
    const cityId = document.getElementById('citySelect').value;

    if(driverId == 0)
        return swal('Você precisa escolher ao menos um motorista','','info');

    if(!cityId)
        return swal('Você precisa escolher uma cidade','','info');

    let date_start = document.getElementById('date-start').value;
    let date_end = document.getElementById('date-end').value;

    data += 'cityId='+cityId;
    data += '&driverId='+driverId;
    data += '&dateStart='+date_start;
    data += '&dateEnd='+date_end;

    preload(true);
    FinancialController.referralDrivers(data).then(({status,response}) => {
        preload(false);
        if(!status)
            return swal('Erro ao listar relatório de motorista '+response[0],'Contate o suporte','info');

        if(response === null)
            return swal('Não há dados de produção desse motorista para essa data','Tente outra data','info');

        let content = '';
        content+= response.map(item => {
            return `
                <tr> 
                    <th>${item.name}</th>
                    <th>${item.totalTripQuantity}</th>
                    <th>R$${Mask.maskMoney(parseFloat(item.cardPayment))}</th>
                    <th>R$${Mask.maskMoney(parseFloat(item.voucherPayment))}</th>
                    <th>R$${Mask.maskMoney(parseFloat(item.vehiclePayment))}</th>
                    <th>R$${Mask.maskMoney(parseFloat(item.vehicleCardPayment))}</th>
                    <th>R$${Mask.maskMoney(parseFloat(item.taximeterPayment))}</th>
                    <th>R$${Mask.maskMoney(parseFloat(item.paymentFormFee))}</th>
                    <th>R$${Mask.maskMoney(parseFloat(item.appFee))}</th>
                    <th>R$${Mask.maskMoney(parseFloat(item.otherFee))}</th>
                    <th>R$${Mask.maskMoney(parseFloat(item.driverValue))}</th>
                    <th>${item.taxes ? item.taxes.split(',').map(tax => {
                        return `
                        <p>${tax}</p>
                        `;
                    }).join('') : '0,00'}</th>
                        </tr> 
                    `;
        });

        document.getElementById('mount-here-report').innerHTML = content;
        $('#financialDriver').modal('hide')
    });
});