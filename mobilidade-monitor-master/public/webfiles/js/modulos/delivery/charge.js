let enterprise = {
    id: null,
};
let page = 1;
let companyId = null;
Mask.setMoneyField("#valueCharge");

getData();
getNameFantasy();

elementProperty.addEventInElement('.btn-filter-charge', 'onclick', function () {
    const idFilter = document.querySelector('#select-filter-charge').value;
    page = 1;
    companyId = idFilter === '' ? null : idFilter;
    getData();
})

function getData() {
    preload(true);
    DeliveryChargeController.getCharges(page, companyId).then(({response}) => {
        const { data } = response;
        document.querySelector('.btn-next-page').disabled = (response.next_page_url == null);
        document.querySelector('.btn-prev-page').disabled = (response.prev_page_url == null);

        document.querySelector('.listCharges').innerHTML = data.map(item => {
            return `<tr>
                        <td>${item.company.fantasyName}</td>
                        <td>${item.description}</td>
                        <td>${Mask.maskMoney(item.value)}</td>
                        <td>${new Date(item.created_at).toLocaleString()}</td>
                        <td>${item.status_payment.description}</td>
                        ${checkEventPayment(item)}
                    </tr>`;
        }).join('');

        preload(false);

        elementProperty.addEventInElement('.btn-delete-charge', 'onclick', function (){
            const id = this.id;
            SwalCustom.confirm('Deseja realmente excluir esta cobrança?', 'Esta ação é irreversível').then(status => {
                if(status)
                DeliveryChargeController.deleteCharge(id).then((status) => {
                    if(!status)
                        return SwalCustom.messageDialog('', 'Ocorreu um erro ao excluir sua cobrança.', 'error');

                    SwalCustom.messageDialog('', 'Cobrança excluída com sucesso!', 'success').then(() => {
                        preload(true);
                        getData();
                    })
                });
            });
        });

        elementProperty.addEventInElement('.approveCharge', 'onclick', function () {
            const id = this.id;
            SwalCustom.confirm('Deseja realmente aprovar esta cobrança?', 'Esta ação é irreversível').then(status => {
                if (status)
                    DeliveryChargeController.approvePaymentCharge(id).then((status) => {
                        if (!status)
                            return SwalCustom.messageDialog('', 'Ocorreu um erro ao aprovar sua cobrança.', 'error');

                        SwalCustom.messageDialog('', 'Cobrança aprovada com sucesso!', 'success').then(() => {
                            preload(true);
                            getData();
                        })
                    });
            });
        });

        elementProperty.addEventInElement('.refuseCharge', 'onclick', function () {
            const id = this.id;
            SwalCustom.confirm('Deseja realmente recusar esta cobrança?', 'Esta ação é irreversível').then(status => {
                if (status)
                    DeliveryChargeController.refusePaymentCharge(id).then((status) => {
                        if (!status)
                            return SwalCustom.messageDialog('', 'Ocorreu um erro ao recusar sua cobrança.', 'error');

                        SwalCustom.messageDialog('', 'Cobrança recusada com sucesso!', 'success').then(() => {
                            preload(true);
                            getData();
                        })
                    });
            });
        });
    });
}

elementProperty.addEventInElement('.btn-prev-page', 'onclick', function () {
    page--;
    getData();
});

elementProperty.addEventInElement('.btn-next-page', 'onclick', function () {
    page++;
    getData();
});

function checkEventPayment(item) {
    if(item.statusPaymentId != 1)
        return `
            <td></td>
            <td></td>
            <td></td>
        `;
    return `
           <td><button class="btn btn-success material-icons btn-options approveCharge" id="${item.id}">done</button></td>
           <td><button class="btn btn-dark material-icons btn-options refuseCharge" id="${item.id}">block</button></td>
           <td><button class="btn btn-danger material-icons btn-options btn-delete-charge" id="${item.id}">delete</button></td>
    `;
}

function getNameFantasy() {
    $('.selectFantasyName').select2({
        placeholder: 'Busque o nome fantasia',
        width: '20vw',
        allowClear: true,
        ajax: {
            url: environment.hosts.hostRequestNew + 'company?cityId=' + Session.getValueInSessionLocal("citySelected", "cityId"),
            headers: {
                'token': Session.getValueInSession('user', 'api_token'),
                'userid': Session.getValueInSession('user', 'idUser')
            },
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    'fantasyName': params.term,
                };
            },
            processResults: function (result, params) {
                params.page = params.page || 1;

                return {
                    results: result.response.map(data => {
                        return {
                            id: data.id,
                            text: data.fantasyName,
                            phone: data.phone,
                            document: data.document
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
}

function formatSelecting(result) {
    if (result.loading) {
        return "Buscando...";
    }

    return `<div class="item-select2">
                    <div>
                        Nome: ${result.text}
                    </div>
                    <div>
                        Telefone:${result.phone}
                    </div>
                    <div>
                        CNPJ: ${result.document}
                    </div>
                </div>`;
}

function formatRepoSelection(result) {
    enterprise.id = result.id;
    return result.text;
}

elementProperty.addEventInElement("#btnCreateNewCharge", "onclick", function () {

    const data = {
        "companyId":  document.querySelector('#createChargeModal > div > div > div.modal-body > select').value,
        "value": Mask.removeMaskMoney(document.querySelector("#valueCharge").value),
        "description": document.querySelector("#descriptionCharge").value
    };

    if (data.companyId == null || data.companyId == '')
        return SwalCustom.messageDialog("", 'Informe o estabelecimento', 'info');

    if (data.value == null || data.value == '')
        return SwalCustom.messageDialog("", 'Informe o valor da cobrança', 'info');

    if (data.description == null || data.description == '')
        return SwalCustom.messageDialog("", 'Informe o valor da cobrança', 'info');

        preload(true);

        DeliveryChargeController.createCharge(data).then(({status}) => {
            preload(false);
            if(!status)
               return SwalCustom.messageDialog('', 'Ocorreu um erro ao criar a nova cobrança', 'error');

            SwalCustom.messageDialog('', 'Cobrança criada com sucesso!', 'success').then(() => {
                preload(true);
                document.querySelector('#descriptionCharge').value = '';
                document.querySelector('#valueCharge').value = '0,00';
                $('#createChargeModal').modal('hide')
                getData();
            })
        });
});
