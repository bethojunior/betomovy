Mask.setMaskPhone('#tel-enterprise');
Mask.setMaskPhone('#phone-manager');
$("#cnpj").mask("99.999.999/9999-99");

let update = false;
let idCompany;
let dataManager = {};
let dataManagerUser = {};
let dataUsers = [];
let id = '';
let email_now = '';
let email_now_user = '';

Mask.idUrl().then(id => {
    let checkId = isNaN(parseInt(id));
    if (!checkId) {
        idCompany = parseInt(id);
        update = true;
        preload(true);
        init();
    }
});

function init() {
    CompanyController.get(idCompany).then(({status, response}) => {
        if (!status)
            return swal('Erro ao buscar dados da empresa selecionada', 'Contate o suporte', 'info');

        email_now = response.email;

        document.getElementById('name-enterprise').value = response.name;
        document.getElementById('name-fantasy-enterprise').value = response.fantasyName;
        document.getElementById('cnpj').value = response.document;
        document.getElementById('address').value = response.address;
        document.getElementById('estate-id').value = response.stateId;
        selectCityByEstate(response.stateId,response.cityId, true);
        document.getElementById('tel-enterprise').value = response.phone;
        document.getElementById('email-manager').value = response.email;
        document.getElementById('site').value = response.site;
        document.getElementById('instagram').value = response.instagram;
        document.getElementById('facebook').value = response.facebook;
        document.getElementById('voucherLimit').value = Mask.maskMoney(response.voucherLimit);
        document.getElementById('billingDay').value = response.billingDay;
        document.getElementById('purpose-of-travel').value = response.observation;
        document.getElementById('registration-number').value = response.registration;
        preload(false);
    }).finally(() => preload(false));

    elementProperty.getElement(".user-enterprise", element => {
        element.style.display = "none";
    });
}

function selectCityByEstate(estateId, cityId, isUpdatePJ = false){
    return CityController.getByEstateV2(estateId, isUpdatePJ).then((data) => {
        const elementSelect = document.querySelector("#city-id");
        elementSelect.innerHTML = data.response.map(item => {
            return `
                    <option value="${item.id}">${item.nome}</option>
                `;
        }).join('');
        elementSelect.value = cityId;
    });
}

elementProperty.getElement('#estate-id', these => {
    EstateController.getAllV2().then(({status, response}) => {
        let content = '';
        content += response.map(item => {
            return `
                <option value="${item.id}">${item.name}</option>
            `;
        }).join('');
        these.innerHTML = content;
    });
});

elementProperty.addEventInElement('#estate-id', 'onchange', function() {
    let estateId = this.value;
    elementProperty.getElement('#city-id', these => {
        CityController.getByEstateV2(estateId, true).then((data) => {
            let content = '';
            content += data.response.map(item => {
                return `
                    <option value="${item.id}">${item.nome}</option>
                `;
            }).join('');
            these.innerHTML = content;
        });
    });
});

elementProperty.addEventInElement('#add-new-user', 'onclick', function () {
    let data = {};
    data.id = document.getElementById('userId').value;
    data.name = document.getElementById('name-user').value;
    data.email = email_now_user;
    data.phone = document.getElementById('phone-user').value;

    if (data.name === '' || data.email === '' || data.phone === '')
        return swal('Preencha todos os campos de usuários', '', 'info');

    document.getElementById('table-users').style.opacity = '1';

    dataUsers.push(data);

    elementProperty.getElement('#mount-table-users', these => {
        let content = '';
        content += dataUsers.map(item => {
            return `
                <tr id="tr-${item.id}">
                    <td>${item.name}</td>
                    <td>${item.email}</td>
                    <td>${item.phone}</td>
                    <td>
                        <button data='${JSON.stringify(item)}' id="${item.id}" class='btn btn-danger delete-item'>
                            <i class="material-icons">clear_all</i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        these.innerHTML = content;

        elementProperty.addEventInElement('.delete-item', 'onclick', function () {
            let user = JSON.parse(this.getAttribute('data'));
            dataUsers.map(users => {
                if (users.id === user.id) {
                    let index = dataUsers.indexOf(users);
                    dataUsers.splice(index, 1);
                    document.getElementById('tr-' + users.id).style.display = 'none';
                }
            });
        });

    });
});

elementProperty.addEventInElement('.send-data', 'onclick', function () {
    let data = {};

    voucher = document.getElementById('voucherLimit').value;
    voucherLimit = voucher.replace('.', '');
    voucherLimit = voucher.replace(',', '');

    data.voucherLimit = parseFloat(voucherLimit);
    data.fantasyName = document.getElementById('name-fantasy-enterprise').value;
    data.name = document.getElementById('name-enterprise').value;
    data.document = document.getElementById('cnpj').value;
    data.address = document.getElementById('address').value;
    data.phone = document.getElementById('tel-enterprise').value;
    data.billingDay = parseInt(document.getElementById('billingDay').value);
    data.site = document.getElementById('site').value;
    data.facebook = document.getElementById('facebook').value;
    data.instagram = document.getElementById('instagram').value;
    data.observation = document.getElementById('purpose-of-travel').value;
    data.registration = document.getElementById('registration-number').value;

    cityId = document.getElementById('city-id').value;
    data.cityId = cityId;
    if (cityId === '' || cityId === null)
        data.cityId = Session.getValueInSessionLocal("citySelected", "cityId");

    data.workers = [];

    dataUsers.map(item => {
        data.workers.push({"userId": item.id});
    });

    if (data.name === '' || data.fantasyName === '' || data.document === '' || data.address === '' || data.email === ''
        || data.phone === '' || data.billingDay === '' || data.voucherLimit === ''
    ) {
        return swal('Preencha todos os campos obrigatórios', '', 'info');
    }

    if (data.workers.length < 0)
        return swal('Insira algum usuário autorizado', '', 'info');

    preload(true);

    if (!update) {
        data.method = 'POST';
        data.id = id;
        return CompanyController.insert(data).then(({status, response}) => {
            preload(false);
            if (!status)
                return swal('Erro ao inserir cliente jurídico - ' + response[0], 'Se persistir , contate o suporte', 'error');

            swal('Usuário inserido com sucesso', 'Aguarde enquanto atualizamos a sua página', 'success');
            return setTimeout(() => {
                location.reload();
            }, 4000);
        });
    }

    if (email_now !== document.getElementById('email-manager').value) {
        data.email = document.getElementById('email-manager').value;
    }

    data.id = idCompany;

    return CompanyController.update(data).then(({status, response}) => {
        preload(false);
        if (!status) {
            let errors = response[0];
            return swal('Erro ao atualizar cliente jurídico', errors, 'error');
        }
        swal('Usuário atualizado com sucesso', '', 'success').then((status) => {
            if(status)
                return window.location.href = '/client/legal/';
        });
    });
});

$('#mount-users').select2({
    width: '100%',
    ajax: {
        url: `${ConnectionServer.HostV2()}customer`,
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
                results: result.response.data.map(user => {
                    return {
                        id: user.idUser,
                        text: user.name,
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

    id = result.id;

    elementProperty.getElement('#phone-manager', phone => {
        phone.value = result.phone;
    });

    elementProperty.getElement('#email-manager', email => {
        email.value = result.email;
    });

    dataManager = result;

    return `<div class="item-select2" value="${result.idUser}">
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
    return result.text;
}

$('#mount-users-by-email').select2({
    width: '100%',
    ajax: {
        url: `${ConnectionServer.HostV2()}customer`,
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
                results: result.response.data.map(user => {
                    console.log(user);
                    return {
                        id: user.idUser,
                        text: user.name,
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

    return `<div class="item-select2" value="${result.idUser}">
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

    elementProperty.getElement('#userId', id => {
        id.value = result.id;
    });

    elementProperty.getElement('#phone-user', phone => {
        phone.value = result.phone;
    });

    elementProperty.getElement('#name-user', email => {
        email.value = result.text;
    });

    email_now_user = result.email;

    return result.text;
}
