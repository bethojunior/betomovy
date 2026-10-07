const STATUS_ACTIVE_PARTNER = 1;
const STATUS_PENDING_PARTNER = 2;
const STATUS_BLOCKED_PARTNER = 3;

const manager = {
    isRequest: false,
    filter: {
        page: 1,
    },
    lastPage: 1
};

getData();
statusPartner();

function getData() {
    preload(true);
    PartnerController.actionList(manager.filter).then(({response}) => {
        document.getElementById('listPartner').innerHTML = response.data.map(item => {
            return `
            <div class="card">
                <div class="card-header">
                    <div>
                        <h5 class="d-flex">
                            <div class="container-image">
                                <img src="${environment.hosts.hostImageClient}${item.profileImage}" alt="Foto de perfil do parceiro">
                             </div>
                            <div class="container-information">
                                <div class="name-partner">
                                    <p>${item.name}</p>
                                </div>
                                <div>
                                    <label>E-mail: <label class="phone-number">${item.email}</label></label>
                                </div>
                                <div>
                                    <label>Telefone: <label class="phone-number">${item.phone}</label></label>
                                </div>
                                <div id="statusPartner${item.idPartner}">
                                    <label>Status: ${item.partnerRegister}</label>
                                </div>
                            </div> 
                        </h5>
                    </div>
                    <div class="container-button">
                        ${checkStatusPartner(item)}
                    </div>
                </div>
        </div>`;
        }).join('');

        elementProperty.addEventInElement(".change-status-partner", "onclick", function (event) {
            event.stopPropagation();
            this.disabled = true;
            const partner = JSON.parse(this.getAttribute("value"));


            const status = (partner.partnerRegisterStatusId === STATUS_BLOCKED_PARTNER || partner.partnerRegisterStatusId === STATUS_PENDING_PARTNER) ?
                STATUS_ACTIVE_PARTNER : STATUS_BLOCKED_PARTNER;

            PartnerController.changeStatus(partner.idPartner, status).then((result) => {
                responseChangeStatus(result, this, status);
            });

        });
        preload(false);
    })
}

function filter() {
    const typeFilter = document.querySelector('.type-filter:checked').value;
    if (typeFilter == 0){
        return filterName();
    }
    if (typeFilter == 1){
        return filterEmail();
    }
    filterPhoneLocal();
}

function filterPhoneLocal() {
    const itemFilter = document.querySelector('.input-filter').value.toLowerCase();
    const cards = document.querySelectorAll('#listPartner .card');
    
    cards.forEach(card => {
        const phoneLabels = card.querySelectorAll('label');
        let phoneFound = false;
        
        phoneLabels.forEach(label => {
            if (label.textContent.includes('Telefone:')) {
                const phoneText = label.textContent.toLowerCase();
                if (phoneText.includes(itemFilter)) {
                    phoneFound = true;
                }
            }
        });
        
        card.style.display = phoneFound ? 'block' : 'none';
    });
    
    preload(false);
}

function filterName() {
    preload(true);
    const itemFilter = document.querySelector('.input-filter').value;
    const statusPartner = document.querySelector('.select-status-partner').value;
    PartnerController.filterPartnerName(itemFilter, statusPartner).then(({response}) => {
        document.querySelector('#listPartner').innerHTML = response.data.map(item => {
                return `
                 <div class="card">
                    <div class="card-header">
                        <div>
                            <h5 class="d-flex">
                                <div class="container-image">
                                    <img src="${environment.hosts.hostImageClient}${item.profileImage}" alt="Foto de perfil do parceiro">
                                 </div>
                                <div class="container-information">
                                    <div class="name-partner">
                                        <p>${item.name}</p>
                                    </div>
                                     <div>
                                        <label>E-mail: <label class="phone-number">${item.email}</label></label>
                                     </div>
                                    <div>
                                        <label>Telefone: <label class="phone-number">${item.phone}</label></label>
                                    </div>
                                    <div id="statusPartner${item.idPartner}">
                                        <label>Status: ${item.partnerRegister}</label>
                                    </div>
                                </div> 
                            </h5>
                        </div>
                        <div class="container-button">
                            ${checkStatusPartner(item)}
                        </div>
                    </div>
                 </div>
                `;
        }).join('');
        preload(false);
    });
}

function filterEmail() {
    preload(true);
    const itemFilter = document.querySelector('.input-filter').value;
    const statusPartner = document.querySelector('.select-status-partner').value;
    PartnerController.filterPartnerEmail(itemFilter, statusPartner).then(({response}) => {
        document.querySelector('#listPartner').innerHTML = response.data.map(item => {
            return `
                 <div class="card">
                    <div class="card-header">
                        <div>
                            <h5 class="d-flex">
                                <div class="container-image">
                                    <img src="${environment.hosts.hostImageClient}${item.profileImage}" alt="Foto de perfil do parceiro">
                                 </div>
                                <div class="container-information">
                                    <div class="name-partner">
                                        <p>${item.name}</p>
                                    </div>
                                    <div>
                                        <label>E-mail: <label class="phone-number">${item.email}</label></label>
                                     </div>
                                    <div>
                                        <label>Telefone: <label class="phone-number">${item.phone}</label></label>
                                    </div>
                                    <div id="statusPartner${item.idPartner}">
                                        <label>Status: ${item.partnerRegister}</label>
                                    </div>
                                </div> 
                            </h5>
                        </div>
                        <div class="container-button">
                            ${checkStatusPartner(item)}
                        </div>
                    </div>
                 </div>
                `;
        }).join('');
        preload(false);
    });
}



function statusPartner() {
    PartnerController.getStatusPartner().then(({response}) => {
        document.querySelector('.select-status-partner').innerHTML += response.map(item => {
            return `
                <option value="${item.id}">${item.text}</option>
            `;
        }).join('');
    });
}

elementProperty.addEventInElement('.select-status-partner', 'onchange', function () {
    preload(true);
    const statusPartner = document.querySelector('.select-status-partner').value;
    const itemFilter = document.querySelector('.input-filter').value;

    if(itemFilter != ""){
        return filter();
    }

    PartnerController.filterPartnerStatus(statusPartner).then(({response}) => {
        document.querySelector('#listPartner').innerHTML = response.data.map(item => {
            return `
            <div class="card">
                <div class="card-header">
                    <div>
                        <h5 class="d-flex">
                            <div class="container-image">
                                <img src="${environment.hosts.hostImageClient}${item.profileImage}" alt="Foto de perfil do parceiro">
                             </div>
                            <div class="container-information">
                                <div class="name-partner">
                                    <p>${item.name}</p>
                                </div>
                                <div>
                                    <label>E-mail: <label class="phone-number">${item.email}</label></label>
                                </div>
                                <div>
                                    <label>Telefone: <label class="phone-number">${item.phone}</label></label>
                                </div>
                                <div id="statusPartner${item.idPartner}">
                                    <label>Status: ${item.partnerRegister}</label>
                                </div>
                            </div> 
                        </h5>
                    </div>
                    <div class="container-button">
                        ${checkStatusPartner(item)}
                    </div>
                </div>
        </div>`;
        }).join('');
        preload(false);
    });
});

function checkStatusPartner(item) {
    if (item.partnerRegisterStatusId === STATUS_BLOCKED_PARTNER || item.partnerRegisterStatusId === STATUS_PENDING_PARTNER) {
        return `
                <button value='${JSON.stringify(item)}' type="button" class="btn btn-success change-status-partner">LIBERAR</button>
                `;
    } else {
        return `
                <button value='${JSON.stringify(item)}' type="button" class="btn btn-danger change-status-partner">BLOQUEAR</button>
                `;
    }
}

function responseChangeStatus({status, data, error}, element, newStatus) {
    if (!status) {
        SwalCustom.messageDialog(error, "Ocorreu um erro na mudança de status do parceiro", "info");
        return;
    }

    element.disabled = false;

    const partner = JSON.parse(element.getAttribute("value"));
    partner.partnerRegisterStatusId = newStatus;

    element.setAttribute("value", JSON.stringify(partner));

    if (partner.partnerRegisterStatusId === STATUS_BLOCKED_PARTNER || partner.partnerRegisterStatusId === STATUS_PENDING_PARTNER) {
        element.innerHTML = `LIBERAR`;
        partner.partnerRegister = "BLOQUEADO";
        element.classList.remove("btn-danger");
        element.classList.add("btn-success");
    } else {
        element.innerHTML = `BLOQUEAR`;
        partner.partnerRegister = "ATIVO";
        element.classList.remove("btn-success");
        element.classList.add("btn-danger");
    }


    elementProperty.getElement(`#statusPartner${partner.idPartner}`, elementStatus => {
        elementStatus.innerHTML = partner.partnerRegister;
    })
}