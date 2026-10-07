document.addEventListener("DOMContentLoaded",function(){
    const elementProperty = new ElementProperty();
    Mask.setMoneyField("#valueManagerMot");
    Mask.setMoneyField("#valueManagerCli");

    const managerList ={
        page:1
    };

    elementProperty.getElement("#listManager",element=>{
        element.innerHTML = '';
    });

    showManagerList();

    const manager = {
        userId:"",
        valueCommission:"",
        valueTypeCommission:"",
    };

    function formatSelecting(result) {
        if (result.loading) {
            return "Buscando...";
        }

        return `<div class="item-select2">
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
        manager.userId = result.userId;
        return result.text;
    }

    function showManagerList(){
        ManagerController.list(managerList.page).then(({ status, response })=>{
            if(!status)
                return;

            elementProperty.getElement("#listManager", element => {
                element.innerHTML +=
                    response.map(manager => {
                        return `<li class="list-group-item">
                    <div class="row">
                        <div class="col-md-3">${manager.user.name}</div>
                        <div class="col-md-2">${Mask.maskPhone(manager.user.phone)}</div>
                        <div class="col-md-3">${manager.user.email}</div>
                        <div class="col-md-1">${Mask.maskMoney(parseFloat(manager.valueCommission))}</div>
                        <div class="col-md-1">${manager.valueTypeCommission}</div>
                        <div class="col-md-2">
                            <button class="btn btn-info btn-sm edit-manager" title="Edit" data-id="${manager.id}">
                                <i class="material-icons" title="Editar">edit</i>
                            </button>
                            <button class="btn btn-danger btn-sm delete-manager" title="Remover" data-id="${manager.id}">
                                <i class="material-icons" title="Remover">delete</i>
                            </button>
                        </div>
                    </div>
                </li>`;
                    }).join("");

                function fillManagerData(managerData) {
                    ManagerController.listSelectAll().then(({ status, response }) => {
                        if (!status) return;

                        let select = document.getElementById('selectManagerEdit');
                        select.innerHTML = '';

                        response.forEach(user => {
                            let option = document.createElement('option');
                            option.value = user.idUser;
                            option.text = user.name;

                            if (user.idUser === managerData.userId) {
                                option.selected = true;
                            }

                            select.appendChild(option);
                        });
                    });

                    document.getElementById('valueManagerMot').value = managerData.valueCommission;
                    document.getElementById('typeMoneyMot').checked = (managerData.valueTypeCommission === '$');
                    document.getElementById('typePercentMot').checked = (managerData.valueTypeCommission === '%');
                    document.getElementById('valueManagerCli').value = managerData.partnerCommission;
                    document.getElementById('typeMoneyCli').checked = (managerData.partnerTypeCommission === '$');
                    document.getElementById('typePercentCli').checked = (managerData.partnerTypeCommission === '%');
                }

                elementProperty.addEventInElement(".edit-manager", "onclick", function () {
                    preload(true);
                    let managerId = this.getAttribute('data-id');

                    ManagerController.getManager(managerId).then(({ status, response, message }) => {
                        if (status) {
                            fillManagerData(response);
                            preload(false);

                            document.getElementById('updateManagerConfirm').setAttribute('data-id', managerId);

                            $('#editManagerModal').modal('show');
                        } else {
                            console.error(message);
                        }
                    });
                });

                elementProperty.addEventInElement("#updateManagerConfirm", "onclick", function () {
                    preload(true);
                    let managerId = this.getAttribute('data-id');

                    // Motorista
                    const motValueTypeCommission = document.querySelector("input[name='typeValueMot']:checked").value;
                    const motValueCommission = Mask.removeMaskMoney(document.getElementById("valueManagerMot").value);

                    // Cliente Comissionado
                    const cliValueTypeCommission = document.querySelector("input[name='typeValueCli']:checked").value;
                    const cliValueCommission = Mask.removeMaskMoney(document.getElementById("valueManagerCli").value);

                    let data = {
                        userId: document.getElementById('selectManagerEdit').value,
                        valueCommission: motValueCommission,
                        valueTypeCommission: motValueTypeCommission,
                        partnerCommission: cliValueCommission,
                        partnerTypeCommission: cliValueTypeCommission
                    };

                    ManagerController.update(data, managerId).then(({ status, response, message }) => {
                        if (!status) {
                            return;
                        }

                        SwalCustom.messageDialog("", message, "success").then(() => {
                            location.href = `/manager`;
                        });
                    }).finally(() => {
                        preload(false);
                    });

                    $('#editManagerConfirm').modal('hide');
                });

                elementProperty.addEventInElement(".delete-manager", "onclick", function () {
                    let managerId = this.getAttribute('data-id');

                    document.getElementById('managerName').innerText = this.closest('.row').querySelector('.col-md-3').innerText;

                    document.getElementById('removeManagerConfirm').setAttribute('data-id', managerId);

                    $('#removeManagerModal').modal('show');
                });

                elementProperty.addEventInElement("#removeManagerConfirm", "onclick", function () {
                    preload(true);
                    let managerId = this.getAttribute('data-id');

                    ManagerController.remove(managerId).then(({ status, response, message }) => {
                        if (!status)
                            return;

                        SwalCustom.messageDialog("", message, "success").then(() => {
                            location.href = `/manager`;
                        });

                    }).finally(() => {
                            preload(false)
                    });

                    $('#removeManagerModal').modal('hide');
                });

                elementProperty.addEventInElement(".show-more", "onclick", function () {
                    this.remove();
                    managerList.page++;
                    showManagerList();
                });
            });
        });
    }
});