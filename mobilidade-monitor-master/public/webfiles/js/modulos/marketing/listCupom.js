const elementProperty = new ElementProperty();
Mask.setMoneyField('#value-discount');
Mask.setMoneyField('#limitedTo');
Mask.setMoneyField('#fromValue');
Mask.setMoneyField('#maxDiscountValue');

preload(true);
init();

elementProperty.addEventInElement('.btn-add-coupon', 'onclick', newCoupon);
function checkValueIsNull(content) {
    if(content === null)
        return 'S/ limite';
    return 'R$'+Mask.maskMoney(content)
}

function init() {
    MarketingController.getCupons().then(({status,response}) => {
        if(!status)
            return swal('Erro ao listar cupons','Contate o suporte','info');

        let content = '';

        content += response.map(item => {
            let block = '';
            let remove = '';

            if (checkCouponPermission('bloquear_cupom'))
                block += `
                    <button status="${item.active}" id="${item.id}" class="btn btn-info btn-xs disabled-coupon">
                        <i class="material-icons">${checkStatus(item.active)}</i>
                    </button>`;

            if (checkCouponPermission('excluir_cupom'))
                remove += `
                    <button class="btn btn-danger btn-xs delete-coupon" id="${item.id}" >
                        <i class="material-icons">delete</i>
                    </button>`;

            return `
                <tr id="item-${item.id}"> 
                    <th>${item.code}</th>
                    <th>
                        <div class="date-th">
                            <span>${Mask.setDateCrazy(item.dateStart, true)}</span> 
                            <span> - </span> 
                            <span>${Mask.setDateCrazy(item.dateEnd, true)}</span>      
                        </div>  
                    </th>
                    <th>
                        ${item.valueType === '$' ? 'R$' : ''}${Mask.maskMoney(item.value)}${item.valueType === '%' ? '%' : ''} 
                    </th>
                    <th>${checkValueIsNull(item.maxDiscountValue)}</th>
                    <th>${backName(item.city)}</th>
                    <th>${item.gender.name}</th>
                    <th>${item.trip_payment_form === null ? 'Não informado' : item.trip_payment_form.name}</th>
                    <th>${block}</th>
                    <th>${remove}</th>
                </tr>
            `;
        }).join('');
        document.getElementById('mount-coupon').innerHTML = content;
        preload(false);

        elementProperty.addEventInElement('.delete-coupon','onclick',function () {
            let id = this.getAttribute('id');
            SwalCustom.confirm('Deseja deletar esse cupom?','Essa ação é irreversivel!').then(status => {
                if(!status)
                    return false;
                preload(true);
                MarketingController.deleteCupom(id).then(({status,response}) => {
                    preload(false);
                    if(!status)
                        return swal('Erro ao deletar cupom','Contate o suporte','info');

                    document.getElementById('item-'+id).classList.add('remove-item');
                    swal('Cupom deletado com sucesso','','success');
                    return init();
                });
            });
        });

        elementProperty.addEventInElement('.disabled-coupon','onclick',function () {
            let id = this.getAttribute('id');
            let status = parseInt(this.getAttribute('status'));
            if(status === 1){
                return SwalCustom.confirm('Deseja desabilitar esse cupom?','Voce pode o habilitar quando quiser').then(callback => {
                    if(!callback)
                        return true;
                    preload(true);
                    MarketingController.releaseCupom(id,false).then(({status, response}) =>{
                        preload(false);
                        if(!status)
                            return swal('Erro ao aletrar status do cupom','Contate o suporte','info');
                        swal("Cupom atualizado com sucesso",'Verifique suas mudanças no seu app','success');
                        return init();
                    });
                });
            }
            SwalCustom.confirm('Deseja habilitar esse cupom?','Voce pode o desabilitar quando quiser').then(callback => {
                if(!callback)
                    return true;
                preload(true);
                MarketingController.releaseCupom(id,true).then(({status,response}) => {
                    preload(false);
                    if(!status)
                        return swal('Erro ao aletrar status do cupom','Contate o suporte','info');
                    swal("Cupom atualizado com sucesso",'Verifique suas mudanças no seu app','success');
                    return init();
                });
            });
        });
    });
}

function backName(city) {
    if(city === null)
        return "Todas";

    return city.nome;
}

function checkStatus(status) {
    if(status === 1)
        return 'lock';

    return 'lock_open';
}

function checkCouponPermission(permissionToCheck) {
    let permissions = JSON.parse(localStorage.getItem("@roles")).groups;
    let permissionId = permissions.findIndex((element) => { return element.name === 'promocao'});
    let promotionPermission = permissionId < 0 ? null : permissions[permissionId];

    if (promotionPermission)
        return promotionPermission.permissions
            .findIndex((permission) => { return permission === permissionToCheck }) >= 0;

    return false;
}

elementProperty.getElement('#mount-cities',these => {
    CityController.getActives().then(({status,data}) => {
        if(!status)
            return swal('Erro ao buscar cidades para atuação do cupom','Contate o suporte','error');
        let content = '';
        content += data.map(item => {
            return `
                <option value="${item.cityId}">${item.nome}</option>
            `;
        }).join('');
        these.innerHTML += content;
    });
});

elementProperty.getElement('#mount-type-payment',these => {
    TripPaymentFormController.getV2().then(({status,response: data}) => {
        if(!status)
            return swal("Erro ao listar formas de pagamento","Contate o suporte","error");
        let content = '';
        content += data.map(item => {
            return `
            <option name="tripPaymentFormId" value="${item.idTripPaymentForm}"> ${item.name} </option>
            `;
        }).join('');
        these.innerHTML += content;
    });
});

elementProperty.addEventInElement('#do-coupon','onclick',function () {
    let uniqueUse   = $("input[name='uniqueUse']:checked").val();
    let bonusDriver = $("input[name='bonusDriver']:checked").val();
    let data = {};
    data.uniqueUse   = false;
    data.bonusDriver = true;

    if(uniqueUse === 'true')
        data.uniqueUse = true;

    if(bonusDriver === 'true')
        data.bonusDriver = false;

    if(document.getElementById('coupon-name').value === '')
        return swal('Insira um nome pro cupom de desconto','','info');

    if(document.getElementById('value-discount').value === '0,00')
        return swal('Insira um valor para o desconto','','info');

    if(document.getElementById('fromValue').value === '0,00')
        return swal('Insira um valor base para o desconto');

    if(document.getElementById('limitedTo').value === '0,00')
        return swal('Insira um valor limite para o desconto');

    if(Mask.removeMaskMoney(document.getElementById('fromValue').value) >= Mask.removeMaskMoney(document.getElementById('limitedTo').value))
        return swal('O valor inicial deve ser menor que o final');

    if(document.getElementById('date-initial').value >= document.getElementById('date-end').value)
        return swal('A data inicial deve ser menor do que a data final');

    data.code = document.getElementById('coupon-name').value;
    data.maxDiscountValue = Mask.removeMaskMoney(document.getElementById('maxDiscountValue').value);
    data.limitedTo = Mask.removeMaskMoney(document.getElementById('limitedTo').value);
    data.fromValue = Mask.removeMaskMoney(document.getElementById('fromValue').value);
    data.value = Mask.removeMaskMoney(document.getElementById('value-discount').value);
    data.cityId = document.getElementById('mount-cities').value;
    data.valueType = $("input[name='valueType']:checked").val();
    data.genderId  = $("input[name='genderId']:checked").val();
    data.tripPaymentFormId = document.getElementById('mount-type-payment').value;
    data.dateStart = document.getElementById('date-initial').value;
    data.dateEnd   = document.getElementById('date-end').value;
    preload(true);

    MarketingController.insertCupom(data).then(({status}) => {
        preload(false);
        if(!status)
            return swal("Ops.. Ocorreu um erro ao criar um novo cupom, reveja seus parâmetros e tente novamente", "", "error");

        return swal('Cupom inserido com sucesso','Confira suas mudanças no seu app','success').then(() => {
            $('#couponModal').modal('hide');
            document.getElementById('coupon-name').value = " ";
            document.getElementById('limitedTo').value = "0,00";
            document.getElementById('fromValue').value = "0,00";
            document.getElementById('mount-cities').value = "";
            document.getElementById('mount-type-payment').value = "";
            document.getElementById('maxDiscountValue').value = '0,00';
            document.getElementById('value-discount').value = '0,00';
            init()
        })
    })
});

function newCoupon() {
    preload(true);
    $('#couponModal').modal('show');
    elementProperty.getElement(".time-coupon", element => {
        const date = new Date();
        element.value = DateCustom.getDateTimeInput(date);
    });

    elementProperty.addEventInElement('.check-label-discount', 'onchange', function () {
        let valueMax = document.querySelector('#maxDiscountValue');
        $("input[name='valueType']:checked").val() === '$' ? valueMax.disabled = true : valueMax.disabled = false;
    });

    elementProperty.addEventInElement('.value-type', 'onclick', function () {
        document.getElementById('value-discount').value = '0,00';
        document.getElementById('maxDiscountValue').value = '0,00';

        elementProperty.addEventInElement('#value-discount', 'onkeyup', function () {
            if($("input[name='valueType']:checked").val() === '$')
                return document.getElementById('maxDiscountValue').value = document.getElementById('value-discount').value
        })
    })

    CustomerController.gender().then(({status,response}) => {
        let content = '';
        content += response.map(item => {
            return `
        <div class="form-check col-lg-12">
            <input class="form-check-input" type="radio" name="genderId" id="gender-${item.id}" value="${item.id}">
            <label class="form-check-label" for="gender-${item.id}">${item.name}</label>
        </div>
        `;
        }).join('');
        document.getElementById('mount-type-gender').innerHTML = content;
        document.querySelector('#gender-1').checked = true;
        preload(false);
    });
}