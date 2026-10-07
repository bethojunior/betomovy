preload(true);
let elementProperty = new ElementProperty();
let user = Session.get('user');
let id_selected = 0;
Mask.setMoneyField('.value-comission');
let id_control = 0;



$('#myList a').on('click', function (e) {
    e.preventDefault()
    $(this).tab('show')
});

$(document).ready(function() {
    $('.js-example-basic-multiple').select2();
});

const Monetization = PermissionUser.hasPermission(FINANCEIRO, "criar_monetizacao_todas_cidades");

elementProperty.addEventInElement('#openCommissionModal', 'onclick', function() {

    Monetization
    ? document.querySelector('.cities').innerHTML = `
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="cities" id="inlineRadio1" value="0" checked>
            <label class="form-check-label" for="inlineRadio1">Cidade selecionada</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="cities" id="inlineRadio1" value="1">
            <label class="form-check-label" for="inlineRadio1">Todas as cidades</label>
        </div>
    `
    : ''

    $('#insertMonetization').modal('show')
})

let selectedItems = [];
elementProperty.getElement('#mount-trip-types' , these => {
    let citySelected = Session.getValueInSessionLocal('citySelected', 'cityId')
    TripTypeController.getAllByCity(citySelected).then(callback => {
        if (!callback.status) {
            return swal('Erro ao buscar listagem de tipo de viagens', 'Contate o suporte', 'error')
        }

        let options = '';
        options += callback.response.map(option => {
            return `
        <option value="${option.trip_type.idTripType}">
          ${option.trip_type.type}
        </option>
      `;
        }).join('');
        these.innerHTML = options;

        $(these).select2({
            placeholder: "Selecione",
            multiple: true,
        });

            $(these).on('change', function() {
                let selectedValues = $(this).val();

                selectedValues.forEach(value => {
                    let option = callback.response.find(option => option.idTripType === value);
                    selectedItems.push(option);
                });

                selectedItems = [...new Set(selectedValues)];
            });

    });
});

showCommissions();

if (Monetization) {
    document.querySelector('#listAllMonetization').style.display = '';
}

let showAllCities = false

elementProperty.addEventInElement('#listAllMonetization','onclick',function(){
    if (showAllCities == false) {
        return showCommissionsAllCities();
    }
    return showCommissions();
});

elementProperty.addEventInElement('.insertCommission','onclick',function(){
    let data = {};
    let isAllCities = $("input[name='cities']:checked").val();
    let citySelected = Session.getValueInSessionLocal('citySelected', 'cityId')

    data.label = document.getElementById('name-commission').value;
    data.indications = document.getElementById('indications-comission').value;
    data.method = METHOD_REQUISITION['inserir'];
    data.cityId = isAllCities == '0'|| isAllCities == undefined ? citySelected : null;

    let value_commission  = document.getElementById('value-comission').value;
    let valueType = $("input[name='valueType']:checked").val();
    let backToTripBalance = $("input[name='backToTripBalance']:checked").val();
    value_commission = value_commission.replace(",", ".");

    if (selectedItems.length == 0) {
        let tripTypeId = document.getElementById('mount-trip-types').value;
        data.tripTypes = [{
            'value': value_commission,
            'valueType': valueType,
            'tripTypeId': tripTypeId,
            'backToTripBalance': backToTripBalance
        }];
    } else {
        let tripTypeId = selectedItems;

        let typeTrip = [];
        tripTypeId.forEach(id => {
            typeTrip.push({
                'value': value_commission,
                'valueType': valueType,
                'tripTypeId': id,
                'backToTripBalance': backToTripBalance
            });
        });
        data.tripTypes = typeTrip;
    }

    if(id_control > 0){
        for(let i = 0; i < id_control ; i++){
            data.tripTypes.push(
                {
                    'value'      : document.getElementById('value-comission-'+[i]).value,
                    'valueType'  : $(`input[name='valueType_${i}']:checked`).val(),
                    'tripTypeId' : document.getElementById('mount-trip-types-'+[i]).value,
                    'backToTripBalance' :  $(`input[name='backToTripBalance_${i}']:checked`).val()
                }
            )
        }
    }

    if(valueType === undefined){
        return swal('Atenção','Selecione um tipo de valor a ser cobrado','info')
    }

    if(backToTripBalance === undefined) {
        return swal('Atenção', 'Selectione um Destino do bônus', 'info')
    }

    if(value_commission === ''){
        return swal('Atenção','Insira um valor válido','info');
    }

    if(data.indications === '' || data.indications === ' '){
        return swal('Atenção','Insira uma quantidade de indicações','info');
    }

    if(data.label === '' || data.label === ' '){
        return swal('Atenção','Insira uma classe','info');
    }

    preload(true);

    FinancialController.referralMonetization(data).then(({status,response,message,paramError}) => {
        preload(false);
        if(status){
            $('#insertMonetization').modal('hide');
            swal('Inserido com sucesso',message,'success');
            return showCommissions();
        }
        if(paramError){
            let content_errors = '';
            for(let i in response){
                content_errors += `${response[i]}\n`;
            }
            return swal(message,content_errors,'info');
        }
    });

});

function returnType(types) {
    let content = '';
    content += types.map(item => {
        return item.type;
    });
    return content;
}

async function showCommissions(){
   const total = await TripTypeController.getAll().then(callback => {
        return callback.response.length;
    });

    preload(true);
    elementProperty.getElement('#mount-list-levels', these => {
        let data = {};
        data.method = METHOD_REQUISITION['list'];
        FinancialController.referralMonetization(data).then( ({status,response,message}) => {
            if(!status) {
                return preload(false); 
            }
            document.getElementById('listAllMonetization').innerHTML = 'Listar todas monetizações'
            showAllCities = false

            const cityId = JSON.parse(localStorage.getItem('citySelected')).cityId 
            
            let content = '';
            content += response.map(item => {
                return `
                    <tr>
                        <th scope="row">${item.label}</th>
                        <th>${item.indications}</th>
                        <th>${item.trip_types.length != total ? returnType(item.trip_types) : 'Todos'}</th>
                        <th>${Mask.maskMoney(item.trip_types[0].pivot.value || 0)}</th>
                        <th>${item.trip_types[0].pivot.valueType}</th>
                        <th>${item.city ? item.city.cityName : 'Todas'}</th>
                        <th>${item.trip_types[0].backToTripBalance == '0' ? 'Saldo em Conta' : 'Voucher'}</th>
                        <th>${new Date(item.updated_at).toLocaleTimeString()} ${new Date(item.updated_at).toLocaleDateString()}</th>
                        <th>${Monetization || item.cityId == cityId
                        ? `<button id="${item.id}" class="btn btn-danger delete"><i  class="material-icons">delete</i></button>` 
                        : ''}
                        </th>
                    </tr>
                `;
            }).join('');
            these.innerHTML = content;
            preload(false);

            elementProperty.addEventInElement('.edit','onclick',function(){
                $('#modal-edit-commission').modal('show');
                id_selected = this.getAttribute('id');
            });

            elementProperty.addEventInElement('.delete','onclick',function(){
                SwalCustom.confirm('Realmente deseja deletar esse tipo de monetização?','Essa ação é irreversivel').then(check => {
                    if(check){
                        preload(true);
                        let data = {};
                        data.method = METHOD_REQUISITION['deletar'];
                        data.id = this.getAttribute('id');
                        FinancialController.referralMonetizationId(data).then((status,response,message) => {
                            showCommissions();
                            preload(false);
                            if(status){
                                return swal('','Excluido com sucesso','success');
                            }
                        });
                        return true;
                    }
                });
            });
            preload(false);
        });
    });
}

function showCommissionsAllCities(){
    preload(true);
    elementProperty.getElement('#mount-list-levels', these => {
        let data = {};
        data.method = METHOD_REQUISITION['list'];

        FinancialController.referralMonetizationAllCities(data).then( ({status,response,message}) => {
            if(!status) {
                return preload(false); 
            }
            document.getElementById('listAllMonetization').innerHTML = 'Listar monetização da cidade selecionada'
            showAllCities = true
            const cityId = JSON.parse(localStorage.getItem('citySelected')).cityId

            let content = '';
            content += response.map(item => {
                return `
                    <tr>
                        <th scope="row">${item.label}</th>
                        <th>${item.indications}</th>
                        <th>${returnType(item.trip_types)}</th>
                        <th>${Mask.maskMoney(item.trip_types[0].pivot.value || 0)}</th>
                        <th>${item.trip_types[0].pivot.valueType}</th>
                        <th>${item.city ? item.city.cityName : 'Todas'}</th>
                        <th>${item.trip_types[0].backToTripBalance == '0' ? 'Saldo em Conta' : 'Voucher'}</th>
                        <th>${new Date(item.updated_at).toLocaleTimeString()} ${new Date(item.updated_at).toLocaleDateString()}</th>
                        <th>${Monetization || item.cityId == cityId
                        ? `<button id="${item.id}" class="btn btn-danger delete"><i  class="material-icons">delete</i></button>` 
                        : ''}
                        </th>
                    </tr>
                `;
            }).join('');
            these.innerHTML = content;
            preload(false);

            elementProperty.addEventInElement('.edit','onclick',function(){
                $('#modal-edit-commission').modal('show');
                id_selected = this.getAttribute('id');
            });

            elementProperty.addEventInElement('.delete','onclick',function(){
                SwalCustom.confirm('Realmente deseja deletar esse tipo de monetização?','Essa ação é irreversivel').then(check => {
                    if(check){
                        preload(true);
                        let data = {};
                        data.method = METHOD_REQUISITION['deletar'];
                        data.id = this.getAttribute('id');
                        FinancialController.referralMonetizationId(data).then((status,response,message) => {
                            showCommissions();
                            preload(false);
                            if(status){
                                return swal('','Excluido com sucesso','success');
                            }
                        });
                        return true;
                    }
                });
            });
            preload(false);
        });
    });
}

elementProperty.addEventInElement('.edit-commission','onclick',function(){

    let data = {};
    data.method = METHOD_REQUISITION['editar'];
    data.id = id_selected;
    let value_commission  = document.getElementById('new-value-comission').value;
    data.indications = document.getElementById('new-indications-comission').value;
    data.label = document.getElementById('new-classe-commission').value;
    data.valueType = $("input[name='new-valueType']:checked").val();

    if(data.valueType === undefined){
        return swal('Atenção','Selecione um tipo de valor a ser cobrado','info')
    }

    if(value_commission === '0,00'){
        return swal('Atenção','Insira um valor válido','info');
    }

    if(data.indications === '' || data.indications === ' '){
        return swal('Atenção','Insira uma quantidade de indicações','info');
    }

    if(data.label === '' || data.label === ' '){
        return swal('Atenção','Insira uma classe','info');
    }

    preload(true);
    value_commission = value_commission.replace(",", ".");
    data.value = value_commission;

    FinancialController.referralMonetizationId(data).then(({status,response,message,paramError}) => {
        preload(false);
        if(status){
            $('#modal-edit-commission').modal('hide');
            showCommissions();
            return swal('Atualizado com sucesso',message,'success');
        }
        if(paramError){
            let content_errors = '';
            for(let i in response){
                content_errors += response[i];
            }
            return swal(message,content_errors,'info');
        }
    });
});

elementProperty.addEventInElement('.more-types','onclick',function () {
    preload(true);
    id_control++;
    let content = '';
    content += `
        <div class="col-lg-12"><hr></div>
        <div class="row col-lg-12">     
            <div style="margin-top: 2.3vw" class="col-lg-3">
                <select class="custom-select mount-trip-types" id="mount-trip-types-${id_control}">
                </select>
            </div>
            <div class="col-lg-3">
            <div class="form-group">
            <label for="value-comission-${id_control}">Valor</label>
            <input type="number" class="form-control" id="value-comission-${id_control}" aria-describedby="emailHelp">
            <small id="value-comission" class="form-text text-muted">Valor da comissão</small>
            </div>
            </div>
            <div class="col-lg-1 type-value">
                <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="customRadioInline1_${id_control}" name="valueType_${id_control}" class="custom-control-input" value="$">
                <label class="custom-control-label" for="customRadioInline1_${id_control}">$</label>
                </div>
                <br>
                <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="type_${id_control}" name="valueType_${id_control}" class="custom-control-input" value="%">
                <label class="custom-control-label" for="type_${id_control}">%</label>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="form-group">
                    <label for="backToTripBalance_${id_control}">Destino do bônus:</label>
                    <div class="col-lg-12">
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="opt-balance_${id_control}" name="backToTripBalance_${id_control}" class="custom-control-input" value="0">
                            <label class="custom-control-label" for="opt-balance_${id_control}">Saldo Conta</label>
                        </div>
                        <br>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="opt-voucher_${id_control}" name="backToTripBalance_${id_control}" class="custom-control-input" value="1">
                            <label class="custom-control-label" for="opt-voucher_${id_control}">Voucher</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('mount-types').innerHTML += content;

    elementProperty.getElement('.mount-trip-types' , these => {
        TripTypeController.getAllV2().then((callback) => {
            if(!callback.status){
                return swal('Erro ao buscar listagem de tipo de viagens','Contate o suporte', 'error')
            }
            let options = '';
            options += callback.response.map(option => {
                return `
                <option value="${option.idTripType}">
                    ${option.type}
                </option>
            `;
            }).join('');
            these.innerHTML = options;
        });
    });

    preload(false);
});