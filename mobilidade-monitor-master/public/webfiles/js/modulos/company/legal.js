Mask.setMoneyField('#value-voucher');
let idCompany = '';
let userAdd = '';
let timeoutSearch = null;
let id;
let idVoucher;
let data = {
    'method': 'GET',
    'params': ''
};

const STATUS_COMPANY = {
    "ATIVO": "desativar",
    "PENDENTE": "ativar",
    "BLOQUEADO": "ativar"
};

const RELEASE_STATUS = {
    "ativar": "enable",
    "desativar": "block"
};

function pjExcluirCell(companyId) {
    if (!PermissionUser.hasPermission(CLIENTE, "excluir_pj")) {
        return "<td></td>";
    }
    return `
                    <td>
                        <button type="button" 
                            class="btn btn-danger btn-sm delete-company"  
                            data='${JSON.stringify(companyId)}'
                            data-toggle="tooltip" 
                            data-placement="top" 
                            title="Excluir"
                        > 
                            <span class="material-icons">
                                delete_forever
                            </span>
                        </button>
                    </td>`;
}

preload(true);

mountList(data);

elementProperty.addEventInElement('#clear-filter', 'onclick', function () {
    data.params = '';
    preload(true);
    mountList(data);
});

elementProperty.addEventInElement('#add-new-user-company', 'onclick', function () {
    $('#modal-list-user-company').modal('hide');
    $('#modal-add-user-company').modal('show');
    $('#mount-users-company-search').select2();
    mountListUsers();
});

elementProperty.addEventInElement('.add-user-company', 'onclick', function () {
    $('#modal-company').modal('hide');
    $('#modal-list-user-company').modal('show');
    preload(true);
    mountUsersListCompany();
});

elementProperty.addEventInElement('#search-enterprise', 'onclick', function () {
    let valueSearch = document.getElementById('value-search').value;
    if (document.querySelector('input[name="filter-pj"]:checked') == null)
        return swal('Nenhum filtro selecionado', 'Identifique qual tipo de filtro quer aplicar', 'info');
    let filterCostumers = document.querySelector('input[name="filter-pj"]:checked').value;
    filterUser(filterCostumers, valueSearch);
});

function filterUser(filterCostumers, valueSearch) {
    switch (filterCostumers) {
        case 'name' :
            preload(true);
            clearInterval(timeoutSearch);
            data.params = `fantasyName=${valueSearch}`;
            return timeoutSearch = setTimeout(() => {
                mountList(data);
            }, 700);

        case 'cnpj' :
            preload(true);
            clearInterval(timeoutSearch);
            data.params = `document=${valueSearch}`;
            return timeoutSearch = setTimeout(() => {
                mountList(data);
            }, 700);

        case 'phone' :
            return filterPhoneLocal(valueSearch);
    }
}

function filterPhoneLocal(searchValue) {
    if (!searchValue) {
        data.params = '';
        return mountList(data);
    }
    
    preload(true);
    data.params = '';
    
    CompanyController.getAll(data).then(({status, response}) => {
        if (!status) {
            preload(false);
            return swal('Erro ao listar ', 'Contate o suporte', 'error');
        }

        const filteredData = response.filter(item => {
            const phone = item.phone || '';
            return phone.toLowerCase().includes(searchValue.toLowerCase());
        });

        elementProperty.getElement('.mount-here-pj', these => {
            if (filteredData.length === 0) {
                these.innerHTML = '';
                preload(false);
                return swal('Nenhum resultado encontrado', 'Não foram encontradas empresas com esse telefone', 'info');
            }

            let content = filteredData.map(item => {
                let balance = item.balance.tripBalance;
                return `
                    <tr>
                    <td>${item.fantasyName}</td>
                    <td>${Mask.maskPhone(isNull(item.phone))}</td>
                    <td>${item.document}</td>       
                    <td>R$${Mask.maskMoney(balance)}</td>
                     <td>
                        <button type="button" class="btn btn-primary btn-sm edit-status"   id="${item.id}" status="${item.company_register_status.name}" enterprise="${item.name}">${item.company_register_status.name}</button>
                    </td>
                    <td>
                        <button type="button" 
                            class="btn btn-primary btn-sm insert-voucher"  
                            id="${item.id}" 
                            name="${item.fantasyName}" 
                            data-toggle="tooltip" 
                            data-placement="top" 
                            title="Adicionar Voucher"
                        > 
                            <span class="material-icons">
                                add_circle_outline
                            </span>
                        </button>
                    </td>
                    <td>
                        <button type="button" 
                            class="btn btn-info btn-sm data-company"  
                            data='${btoa(unescape(encodeURIComponent((JSON.stringify(item)))))}'  
                            data-toggle="tooltip" 
                            data-placement="top" 
                            title="Editar"
                        > 
                            <span class="material-icons">
                                create
                            </span>
                        </button>
                    </td>
                    ${pjExcluirCell(item.id)}
                </tr>
                `;
            }).join('');
            
            these.innerHTML = content;
            preload(false);
        });
    });
}

function mountList(data) {
    elementProperty.getElement('.mount-here-pj', these => {
        CompanyController.getAll(data).then(({status, response}) => {
            if (!status)
                return swal('Erro ao listar ', 'Contate o suporte', 'error');

            let content = '';
            content += response.map(item => {
                let balance = item.balance.tripBalance;
                return `
                    <tr>
                    <td>${item.fantasyName}</td>
                    <td>${Mask.maskPhone(isNull(item.phone))}</td>
                    <td>${item.document}</td>       
                    <td>R$${Mask.maskMoney(balance)}</td>
                     <td>
                        <button type="button" class="btn btn-primary btn-sm edit-status"   id="${item.id}" status="${item.company_register_status.name}" enterprise="${item.name}">${item.company_register_status.name}</button>
                    </td>
                    <td>
                        <button type="button" 
                            class="btn btn-primary btn-sm insert-voucher"  
                            id="${item.id}" 
                            name="${item.fantasyName}" 
                            data-toggle="tooltip" 
                            data-placement="top" 
                            title="Adicionar Voucher"
                        > 
                            <span class="material-icons">
                                add_circle_outline
                            </span>
                        </button>
                    </td>
                    <td>
                        <button type="button" 
                            class="btn btn-info btn-sm data-company"  
                            data='${btoa(unescape(encodeURIComponent((JSON.stringify(item)))))}'
                            data-toggle="tooltip" 
                            data-placement="top" 
                            title="Editar"
                        > 
                            <span class="material-icons">
                                create
                            </span>
                        </button>
                    </td>
                    ${pjExcluirCell(item.id)}
                </tr>
                `;
            }).join('');
            these.innerHTML = content;
            preload(false);

            elementProperty.addEventInElement('.insert-voucher', 'onclick', function (e) {
                e.stopPropagation();
                let id = this.getAttribute('id');
                idVoucher = id;
                let name = this.getAttribute('name');
                document.getElementById('name-company-again').innerHTML = name;
                $('#modal-voucher-company').modal('show');
            });

            elementProperty.addEventInElement('.data-company', 'onclick', function () {
                let data = JSON.parse(decodeURIComponent(escape(window.atob(this.getAttribute('data')))));
                $('#modal-company').modal('show');
                idCompany = data.id;
                id = data.id;
                document.getElementById('name-company').innerHTML = data.name;
                document.getElementById('name').value = data.name;
                document.getElementById('fantasy-name').value = data.fantasyName;
                document.getElementById('email').value = data.email;
                document.getElementById('address').value = data.address;
                document.getElementById('registration-number').value = data.registration || 'Não informado';
                document.getElementById('puporse-of-travel').value = data.observation || 'Não informado';
            });

            elementProperty.addEventInElement('.edit-status', 'onclick', function (e) {
                e.stopPropagation();
                let id = this.getAttribute('id');
                let status = this.getAttribute('status');
                let enterprise = this.getAttribute('enterprise');

                SwalCustom.confirm('Deseja ' + STATUS_COMPANY[status] + ' a empresa ' + enterprise + '?', '').then(check => {
                    if (!status)
                        return true;

                    preload(true);

                    CompanyController.release(id, RELEASE_STATUS[STATUS_COMPANY[status]]).then(({status, response}) => {
                        preload(false);
                        if (!status)
                            return swal('Erro ao atualizar status', 'Contate o suporte', 'error');

                        swal('Empresa atualizada com sucesso', '', 'success');
                        return mountList(data);
                    });
                });
            });

            elementProperty.addEventInElement(".delete-company", "onclick", function () {
                const id = JSON.parse(this.getAttribute("data"));

                SwalCustom.confirm("Deseja excluir essa empresa?", "").then((status) => {
                    preload(true);
                    CompanyController.delete(id).then(() => {
                        preload(false);
                        mountList(data);
                    })
                });
            });

        });
    });
}

function mountUsersListCompany() {
    CompanyController.getWorkers(idCompany).then(({status, response}) => {
        if (!status) {
            $('#modal-company').modal('show');
            $('#modal-list-user-company').modal('hide');
            return swal('Erro ao listar usuários cadastrado da empresa', 'Contate o suporte', 'info');
        }

        let content = '';
        content += response.map(user => {
            return `
                <tr> 
                    <th>${user.user.name}</th>
                    <th>${user.user.email}</th>
                    <th>${user.user.phone}</th>
                    <th> 
                        <button id="${user.id}" class="btn btn-danger delete-user"><i class="material-icons">delete</i></button>
                    </th>
                </tr>
                
            `;
        }).join('');
        document.getElementById('mount-users-company').innerHTML = content;
        preload(false);
        elementProperty.addEventInElement('.delete-user', 'onclick', function () {
            let id = this.getAttribute('id');
            SwalCustom.confirm("Você deseja deletar esse usuário?", "Essa ação é irreversivel").then(status => {
                if (!status)
                    return false;

                preload(true);
                CompanyController.deleteWorker(id).then(({status, response}) => {
                    preload(false);
                    if (!status)
                        return swal("Erro ao excluir usuário", "Contate o suporte", "error");

                    sendPush("Usuário excluido com sucesso");
                    return mountUsers();
                });
            });
        });
    });
}

function mountListUsers() {
    $('#mount-users-company-search').select2({
        placeholder: 'Selecione o responsável',
        width: '100%',
        ajax: {
            url: `${ConnectionServer.Host()}customer`,
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
        userAdd = result.id;
        document.getElementById('email-add-user').value = result.email;
        document.getElementById('phone-add-user').value = result.phone;
        return result.text;
    }
}

function isNull(field) {
    if (field === null || field === '' || field === undefined) {
        return 'Não informado';
    }
    return field;
}

elementProperty.addEventInElement('.add-new-value-voucher', 'onclick', function () {
    $('#modal-company').modal('toggle');
    $('#modal-company-voucher').modal('show');
});

elementProperty.addEventInElement('.edit-company', 'onclick', function () {
    window.location.href = '/client/insertLegal/' + id;
});

elementProperty.addEventInElement('.save-voucher', 'onclick', function () {
    preload(true);
    let valueVoucher = document.getElementById('value-voucher').value;
    const removeOrInsert = document.getElementById('remove-or-insert').value;
    voucher = Mask.removeMaskMoney(valueVoucher);
    data.id = idVoucher;
    data.value = parseFloat(removeOrInsert == '1' ? -voucher : voucher);
    CompanyController.insertVoucher(data).then(({status, response}) => {
        preload(false);
        $('#modal-voucher-company').modal('hide');
        if (!status)
            return swal('Erro ao inserir voucher', 'Você está tentando adicionar um valor maior que o limite', 'error');

        swal('Voucher inserido com sucesso', '', 'success');
        return mountList(data);
    });
    document.getElementById('value-voucher').value = '0,00';
});

elementProperty.addEventInElement('#mount-users-by-email-company', 'oninput', function () {
    let key = this.value;
    ClientController.getCustomer(1, key).then(({status, data}) => {
        if (!status)
            return swal('Erro na listagem de usuários', 'Contate o suporte', 'info')

        elementProperty.getElement('#users-search', these => {
            let content = '';
            these.innerHTML = content;
            content += data.data.map(item => {
                return `
                    <option data="${item}" value='${JSON.stringify(item)}'>${item.name}</option>
                `;
            }).join('');
            these.innerHTML += content;
        });
    });
});

elementProperty.addEventInElement('#users-search', 'onchange', function () {
    let content = JSON.parse(this.value);
    document.getElementById('email-add-user').value = content.email;
    document.getElementById('phone-add-user').value = content.phone;
    userAdd = content.idUser;
});

elementProperty.addEventInElement('#add-this-user-company', 'onclick', function () {
    preload(true);
    let data = {};
    data.userId = userAdd;
    data.companyId = idCompany;
    CompanyController.insertWorker(data).then(({status, response, message}) => {
        preload(false);
        document.getElementById('email-add-user').value = '';
        document.getElementById('phone-add-user').value = '';
        if (!status)
            return swal('Erro ao inserir usuário, ' + response, 'Contate o suporte', 'info');

        swal('Adionado com sucesso', '', 'success');
    });
});

elementProperty.addEventInElement('#comeback', 'onclick', function () {
    $('#modal-list-user-company').modal('show');
    $('#modal-add-user-company').modal('hide');
    mountUsersListCompany();
});