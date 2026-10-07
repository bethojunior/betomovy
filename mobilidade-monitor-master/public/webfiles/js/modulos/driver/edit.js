preload(true);
const elementProperty = new ElementProperty();
const modal = new Modal('#modalPendecies');
let pathImageDefault = '/webfiles/img/svg/paper.svg';
let pathImage = environment.hosts.hostImageDriver;
let pathImageTemp = environment.hosts.hostImageDriverTemp;
let pathDocs = environment.hosts.hostDocs;
let userId = '';
let bankAccountId = '';
let idCar = '';
let userTypeId = false;
let newUserTypeId = '';
let driverId = '';
let DATAUSER;
let statusDocuments = [];
Mask.setMaskPhone('.field-phone');
Mask.setMaskCep('.field-cep');

elementProperty.addEventInElement("#btnRequestDocument", "onclick", function () {
    const docStatusId = document.querySelector("#statusRequestDocument").value;
    const docId = document.querySelector("#requestDocument").value;
    const userId = DATAUSER.userId;

    preload(true);

    DocumentController.requestDocUser(docStatusId, docId, userId).then(({status, response, message}) => {
        if (status === false) {
            SwalCustom.messageDialog("", response, status ? "success" : "info").then(() => {
                if (status)
                    location.reload();
            })
            return;
        }
        SwalCustom.messageDialog("", message, status ? "success" : "info").then(() => {
            if (status)
                location.reload();
        })
    }).finally(() => preload(false))
});

DocumentController.getAll().then(({response}) => {
    document.querySelector("#requestDocument").innerHTML = response.map(item => {
        return `<option value="${item.id}">${item.label}</option>`;
    }).join("");
});

// aqui que é a função principal
DocumentController.getAllStatus().then(({response}) => {

    document.querySelector("#statusRequestDocument").innerHTML = response.map(item => {
        return `<option value="${item.id}">${item.name}</option>`;
    }).join("");

    statusDocuments = response;
    // é aqui que inicia o carregamento dos dados do motorista
    getDataUser();
});

if (Array.isArray(Session.getLocal("driverEditTutorial"))) {
    Session.setLocal("driverEditTutorial", true);
    introJs().start();
}

elementProperty.addEventInElement('#save-new-type-user', 'onclick', function () {
    if (newUserTypeId === '' || newUserTypeId === ' ')
        return swal('Selecione um tipo novo de motorista', '', 'info');

    preload(true);
    let data = {};
    data.userId = userId;
    data.userTypeId = newUserTypeId;
    DriverController.changeTypeUser(data).then(resolve => {
        preload(false);
        $('#modalExemplo').modal('toggle');
        if (resolve.status) {
            getDataUser();
            return swal('', resolve.message, 'success');
        }
        return swal('ops...', resolve.message, 'error');
    });
});

elementProperty.addEventInElement('#release-photo', 'onclick', function () {
    preload(true);
    DriverController.releasePhoto(driverId).then(callback => {
        document.querySelector("#btnRequestUpdateImageProfile").style.display = "none";
        preload(false);
        $('#modal-new-photo').modal('hide');
        if (callback.status)
            return swal('Autorizado com sucesso', '', 'success');

    })
});

elementProperty.addEventInElement('#deny-photo', 'onclick', function () {
    preload(true);
    DriverController.denyPhoto(driverId).then(callback => {
        document.querySelector("#btnRequestUpdateImageProfile").style.display = "none";
        preload(false);
        $('#modal-new-photo').modal('hide');
        if (callback.status)
            return swal('Autorização negada', '', 'success');

    })
});

elementProperty.addEventInElement('#edit-type', 'onclick', function () {
    $('#modalExemplo').modal('show');
    let list = '';
    elementProperty.getElement('#mount-types-user', element => {
        preload(true);
        DriverController.getTypeUsersV2().then(({response}) => {
            list += response.map(data => {
                return `
                    <div data-id="${data.idUserType}" id="${data.idUserType}" class="data">
                        <span>${data.name}</span>
                        <span id="check_type" class="right check-user-type ${showAvaible(data.idUserType)} that_${data.idUserType}"><i class="material-icons">check</i></span>
                    </div>
                `;
            }).join('');
            element.innerHTML = list;
            preload(false);

            elementProperty.addEventInElement('.data', 'onclick', function () {
                let id = this.getAttribute('id');
                elementProperty.getElement('.check-user-type', type => {
                    if (type.classList.contains('show')) {
                        type.classList.remove('show');
                    }
                    type.classList.add('hidden');
                });
                elementProperty.getElement('.that_' + id, that => {
                    that.classList.remove('hidden');
                    that.classList.add('show');
                    newUserTypeId = this.getAttribute('data-id');
                });
            });

        })
    });
});

function showAvaible(id) {
    if (id === userTypeId)
        return 'show';

    return 'hidden';
}

function getDataUser() {
    DriverController.getById(getIdByUrl()).then(res => {
        let data = res.response;
        DATAUSER = res.response;

        userTypeId = data.userTypeId;
        bankAccountId = data.bankAccountId;
        userId = data.userId;
        idCar = data.idCar;
        driverId = data.idDriver;

        const cities = Session.getLocal64('cities');

        elementProperty.getElement('#city', city => {
            let content = '';
            content += cities.map(item => {
                return `    
                    <option value="${item.cityId}">${item.nome}</option>
                `;
            }).join('');

            city.innerHTML = content;
        });

        elementProperty.getElement('#editCity', city => {
            let content = '';
            content += cities.map(item => {
                return `
                    <option value="${item.cityId}">${item.nome}</option>
                `;
            }).join('');

            city.innerHTML = content;
        });

        elementProperty.getElement('#imageDriver', profile => {
            profile.src = environment.hosts.hostImageDriver + data.profileImage;
        });

        if (data.profileImageTemp !== null) {
            document.getElementById('new-photo').src = environment.hosts.hostImageDriverTemp + data.profileImageTemp;
            document.querySelector("#btnRequestUpdateImageProfile").style = "";
        } else {
            document.querySelector("#btnRequestUpdateImageProfile").style.display = "none";
        }

        elementProperty.getElement('#name', name => {
            name.value = data.name;
        });

        elementProperty.getElement('#nickname', nickname => {
            nickname.value = data.nickname;
        });

        elementProperty.getElement('#dateOfBirth', dateOfBirth => {
            dateOfBirth.value = data.dateOfBirth;
        });

        elementProperty.getElement('#email', email => {
            email.value = data.email;
        });

        elementProperty.getElement('#phone', phone => {
            phone.value = data.phone;
        });

        elementProperty.getElement('#document', document => {
            document.value = Mask.readCpfAndCnpj(data.document);
        });

        if (bankAccountId !== null) {
            elementProperty.getElement('#numberAccount', numberAccount => {
                numberAccount.value = data.numberAccount;
            });

            elementProperty.getElement('#agency', agency => {
                agency.value = data.agency;
            });

            elementProperty.getElement('#bankId', bankId => {
                bankId.value = data.bankId;
            });
            elementProperty.getElement('#mount-bank', bankId => {
                bankId.value = data.bankId;
            });

            elementProperty.getElement('#numberAccountDigit', numberAccountDigit => {
                numberAccountDigit.value = data.numberAccountDigit;
            });

            elementProperty.getElement('#nameBank', nameBank => {
                nameBank.innerHTML = data.bankName;
            });

            elementProperty.getElement('#op', op => {
                op.value = data.op;
            });

            elementProperty.getElement('#pixAccountDigit', pixAccountDigit => {
                pixAccountDigit.value = data.pix || '';
            });

            elementProperty.getElement('#typeAccount', typeAccount => {
                typeAccount.value = data.typeAccount;
            });

            elementProperty.getElement('#bankAccountDocument', bankAccountDocument => {
                bankAccountDocument.value = data.bankAccountDocument;
            });

            elementProperty.getElement('#editNumberAccount', numberAccount => {
                numberAccount.value = data.numberAccount;
            });

            elementProperty.getElement('#editAgency', agency => {
                agency.value = data.agency;
            });

            elementProperty.getElement('#editMountBank', bankId => {
                bankId.value = data.bankId;
            });

            elementProperty.getElement('#editNumberAccountDigit', numberAccountDigit => {
                numberAccountDigit.value = data.numberAccountDigit;
            });

            elementProperty.getElement('#editOperation', op => {
                op.value = data.op;
            });

            elementProperty.getElement('#editTypeAccount', typeAccount => {
                typeAccount.value = data.typeAccount;
            });

            elementProperty.getElement('#editBankAccountDocument', bankAccountDocument => {
                bankAccountDocument.value = data.bankAccountDocument;
            });
        }

        elementProperty.getElement('#cnh', cnh => {
            cnh.value = data.cnh || "Não informado";
        });

        elementProperty.getElement('#selectGender', select => {
            select.innerHTML = `
             <option ${data.gender == null && "selected"} value="">Selecione um gênero</option>
             <option ${data.gender === "masculino" && "selected"} value="masculino">masculino</option>
             <option ${data.gender === "feminino" && "selected"} value="feminino">feminino</option>
           `
        });

        elementProperty.getElement('#editSelectGender', select => {
            select.innerHTML = `
             <option ${data.gender == null && "selected"} value="">Selecione um gênero</option>
             <option ${data.gender === "masculino" && "selected"} value="masculino">masculino</option>
             <option ${data.gender === "feminino" && "selected"} value="feminino">feminino</option>
           `
        });

        elementProperty.getElement('#editName', name => {
            name.value = data.name;
        });

        elementProperty.getElement('#editNickname', nickname => {
            nickname.value = data.nickname;
        });

        elementProperty.getElement('#editEmail', email => {
            email.value = data.email;
        });

        elementProperty.getElement('#editPhone', phone => {
            phone.value = data.phone;
        });

        elementProperty.getElement('#editDocument', document => {
            document.value = Mask.readCpfAndCnpj(data.document);
        });

        elementProperty.getElement('#editCnh', cnh => {
            cnh.value = data.cnh || "";
        });

        elementProperty.getElement('#editDateOfBirth', dateOfBirth => {
            dateOfBirth.value = data.dateOfBirth || "";
        });

        elementProperty.getElement('#editSelectGender', select => {
            select.value = data.gender || "";
        });

        elementProperty.getElement('#model', model => {
            model.value = data.model;
        });

        elementProperty.getElement('#brand', brand => {
            brand.value = data.brand;
        });

        elementProperty.getElement('#color', color => {
            color.value = data.color;
        });

        elementProperty.getElement('#year', year => {
            year.value = data.year;
        });

        elementProperty.getElement('#plate', plate => {
            plate.value = data.plate;
        });

        elementProperty.getElement('#renavam', renavam => {
            renavam.value = data.renavam || "Não indentificado";
        });

        elementProperty.getElement('#editModel', model => {
            model.value = data.model;
        });

        elementProperty.getElement('#editBrand', brand => {
            brand.value = data.brand;
        });

        elementProperty.getElement('#editColor', color => {
            color.value = data.color;
        });

        elementProperty.getElement('#editYear', year => {
            year.value = data.year;
        });

        elementProperty.getElement('#editPlate', plate => {
            plate.value = data.plate;
        });

        elementProperty.getElement('#editRenavan', renavam => {
            renavam.value = data.renavam;
        });

        elementProperty.getElement('#cnhImage', cnhImage => {
            if (data.cnhPicture === null) {
                cnhImage.src = pathImageDefault;
                return;
            }
            cnhImage.src = environment.hosts.hostDocs + data.cnhPicture;
        });

        elementProperty.getElement('#crlvImage', crlv => {
            if (data.crlvPicture === null) {
                crlv.src = pathImageDefault;
                return;
            }
            crlv.src = environment.hosts.hostDocs + data.crlvPicture;
        });

        elementProperty.getElement('#alvaraPictureImage', alvara => {
            if (data.alvaraPicture === null) {
                alvara.src = pathImageDefault;
                return;
            }
            alvara.src = environment.hosts.hostDocs + data.alvaraPicture;
        });


        elementProperty.getElement('#cnhImg', cnhImage => {
            if (data.cnhPicture === null) {
                cnhImage.src = pathImageDefault;
                return;
            }
            cnhImage.src = environment.hosts.hostDocs + data.cnhPicture;
        });

        elementProperty.getElement('#crlvImg', crlv => {
            if (data.crlvPicture === null) {
                crlv.src = pathImageDefault;
                return;
            }
            crlv.src = environment.hosts.hostDocs + data.crlvPicture;
        });

        elementProperty.getElement('#alvaraPicturImg', alvara => {
            if (data.alvaraPicture === null) {
                alvara.src = pathImageDefault;
                return;
            }
            alvara.src = environment.hosts.hostDocs + data.alvaraPicture;
        });

        elementProperty.getElement('#proofOfResidence', proofOfResidence => {
            if (data.proofOfResidence === null) {
                proofOfResidence.src = pathImageDefault;
                return;
            }
            proofOfResidence.src = environment.hosts.hostDocs + data.proofOfResidence;
        });

        // fill driver address
        if (data.driver_address) {
            elementProperty.getElement('#cep', cep => {
                cep.value = data.driver_address.zipCode;
            });

            elementProperty.getElement('#street', street => {
                street.value = data.driver_address.street;
            });

            elementProperty.getElement('#number', number => {
                number.value = data.driver_address.number;
            });

            elementProperty.getElement('#complement', complement => {
                complement.value = data.driver_address.complement;
            });

            elementProperty.getElement('#neighborhood', neighborhood => {
                neighborhood.value = data.driver_address.neighborhood;
            });

            elementProperty.getElement('#city', city => {
                const cityId = cities.find(item => item.nome === data.driver_address.city).cityId;
                
                city.value = cityId;
            });

            elementProperty.getElement('#state', state => {
                state.value = data.driver_address.state;
            });

            elementProperty.getElement('#editCep', cep => {
                cep.value = data.driver_address.zipCode;
            });

            elementProperty.getElement('#editStreet', street => {
                street.value = data.driver_address.street;
            });

            elementProperty.getElement('#editNumber', number => {
                number.value = data.driver_address.number;
            });

            elementProperty.getElement('#editComplement', complement => {
                complement.value = data.driver_address.complement;
            });

            elementProperty.getElement('#editNeighborhood', neighborhood => {
                neighborhood.value = data.driver_address.neighborhood;
            });

            elementProperty.getElement('#editCity', city => {
                const cityId = cities.find(item => item.nome === data.driver_address.city).cityId;

                city.value = cityId;
            });

            elementProperty.getElement('#editState', state => {
                state.value = data.driver_address.state;
            });

            Mask.setMaskCep('.field-cep');
        }

        elementProperty.addEventInElement('#editCep', 'onblur', function (e) {
            const cep = this;
            const zipCode = cep.value.replace('-', '');
            const url = `https://viacep.com.br/ws/${zipCode}/json/`;

            preload(true);

            fetch(url).then(res => res.json()).then(res => {
                if (res.erro) {
                    preload(false);
                    return swal('ops', 'CEP não encontrado', 'error');
                }

                elementProperty.getElement('#editStreet', street => {
                    street.value = res.logradouro;
                });

                elementProperty.getElement('#editNeighborhood', neighborhood => {
                    neighborhood.value = res.bairro;
                });

                elementProperty.getElement('#editCity', city => {
                    const cityId = cities.find(item => item.nome === res.localidade).cityId;

                    city.value = cityId;
                });

                elementProperty.getElement('#editState', state => {
                    state.value = res.uf;
                });

                preload(false);
            })
        });

        elementProperty.addEventInElement('#btnSaveEditDriverAddress', 'onclick', function () {
            preload(true);

            const data = {};

            elementProperty.getElement('#editCep', cep => {
                data.zipCode = cep.value;
            });

            elementProperty.getElement('#editStreet', street => {
                data.street = street.value;
            });

            elementProperty.getElement('#editNumber', number => {
                data.number = number.value;
            });

            elementProperty.getElement('#editComplement', complement => {
                data.complement = complement.value;
            });

            elementProperty.getElement('#editNeighborhood', neighborhood => {
                data.neighborhood = neighborhood.value;
            });

            elementProperty.getElement('#editCity', city => {
                data.cityId = city.value;
            });

            DriverController.updateDriverAddress(data, driverId).then(({status, response, message, paramError}) => {
                preload(false);
                if (status) {
                    swal('', message, 'success');
                    $('#driverAddressEditData').modal('hide');

                    return getDataUser();
                }

                if (paramError === true) {
                    return swal('ops', response[0], 'error');
                }

                swal('ops', 'Ocorreu um erro ao atualizar o endereço do motorista. Tente novamente mais tarde', 'error');
            });
        });

        elementProperty.addEventInElement("#cnhImage", "onmouseover", function () {
            imageZoom("cnhImage", "myresult");
        });

        elementProperty.addEventInElement("#alvaraPicture", "onmouseover", function () {
            imageZoom("alvaraPicture", "myresult");
        });

        elementProperty.addEventInElement("#crlv", "onmouseover", function () {
            imageZoom("crlv", "myresult");
        });

        preload(false);

        elementProperty.getElement('#aboutDriver', element => {
            let status = data.registerStatus;
            let valorBloqueado = data.blockedBalance;
            let balance = data.balance;

            txt = `
                <span class="${checkStatus(status)}"><b>Status: </b>${status}</span><br>
                <span><b>Saldo : </b>R$${Mask.maskMoney(parseFloat(balance))}</span><br>
                <span><b>Bloqueado :</b> R$${Mask.maskMoney(parseFloat(valorBloqueado))}</span>
            `;

            element.innerHTML = txt;
        });

        elementProperty.addEventInElement('.pendencies', 'onclick', function (e) {
            preload(true);
            modal.open();
            elementProperty.getElement('#typePendencies', element => {
                DriverController.getPendencies().then(res => {
                    let data = res.data;
                    let list = '';
                    data.map(res => {
                        list += `
                        <input class="typePendencie" type="checkbox" name="${res.name}" value="${res.idPendencyReasonsType}"> ${res.name}<br>
                   `;
                    });
                    element.innerHTML = list;
                    preload(false);
                });
            });
        });

        elementProperty.addEventInElement('#sendPendecies', 'onclick', function () {
            let data = {};
            data.pendenciesReasonsTypeIds = [];
            elementProperty.getElement('.typePendencie', element => {
                if (element.checked) {
                    data.pendenciesReasonsTypeIds.push(element.getAttribute("value"));
                }
            });
            DriverController.insertPendencies(getIdByUrl(), data).then(res => {
                modal.close();
                if (res.status)
                    return swal('', res.message, 'success');

                swal('ops', res.message, 'error');
            });
        });

        elementProperty.getElement("#listDocumentDriver", element => {
            const documents = data.docs_user.filter((item) => item.deleted_at == null)
            element.innerHTML = documents.map(item => {
                return `<li>
                            <span>${item.label}</span>
                            <select class="custom-select select-document-status">
                                ${showOptionDocument(item)}
                            </select>
                            <div class="container-img-document" style="background-image: ${`url(${item.image})` || ""}" object='${JSON.stringify(item)}'></div>
                            <input type="text" value="${item.text || ""}" disabled/>
                            ${item.pdf != null ? `<a class="text-center" href="${item.pdf}" target="_blank">Ver documento PDF</a>` : ""}
                        </li>`;
            }).join("");

            elementProperty.addEventInElement(".select-document-status", "onchange", function () {
                this.setAttribute("changeStatus", "true");
                document.querySelector("#btnSaveUpdateDocument").style.display = "block";
            });

            elementProperty.addEventInElement(".container-img-document", "onclick", function () {
                const item = JSON.parse(this.getAttribute("object"));

                document.querySelector("#modalImage").setAttribute("src", item.image);

                $("#modalDocumentView").modal('show');
            });
        });

        elementProperty.addEventInElement("#btnSaveUpdateDocument", "onclick", function () {
            document.querySelector("#btnSaveUpdateDocument").style.display = "none";

            document.querySelectorAll("*[changeStatus='true']").forEach((element) => {
                preload(true);

            const allSelectedValueIsOne = Array.from(document.querySelectorAll(".select-document-status")).every((element) => element.value == 1);

            if (allSelectedValueIsOne) {
                DriverController.activateRegister(getIdByUrl()).then((res) => {
                            if (res.status) {
                                swal("", "Motorista Desbloqueado", "success").then(() => {
                                    window.location.reload();
                                });
                            } else {
                                swal("", res.message, "error");
                            }
                        });
            }

                const option = element.selectedOptions[0];

                DocumentController.changeStatusDoc({
                    id: option.getAttribute("docId"),
                    docStatusId: option.getAttribute("value")
                }).finally(() => {
                    preload(false);
                });
                option.removeAttribute("changeStatus");
            });
        });

        elementProperty.addEventInElement("#btnRequestImageProfile", "onclick", function () {
            SwalCustom.dialogConfirm("Deseja solicitar uma nova foto para o motorista ?", "", status => {
                if (!status)
                    return;
                SwalCustom.dialogConfirm("Bloquear motorista até alteração da foto?", "Caso sim, o mesmo não poderá receber chamada até a atualização dos dados", status => {
                    DriverController.requestNewProfileImage(data.idDriver, status).then(({message}) => {
                        Toastr.success(message)
                    });
                });
            });
        });

        loadDriverSplitConfig(driverId, data.driver_split_config);
    });

}


function showOptionDocument(document) {
    return statusDocuments.map(item => {
        return `<option value='${item.id}' ${item.name === document.docStatus ? "selected" : ""} docId="${document.id}">${item.name}</option>`
    }).join("");
}

elementProperty.addEventInElement('#formDataDriver', 'onsubmit', function (event) {
    event.preventDefault();
    const data = {};
    const gender = document.getElementById('editSelectGender').value;
    const name = document.getElementById('editName').value;
    const nickname = document.getElementById('editNickname').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;
    const documentUser = document.getElementById('editDocument').value;
    const cnh = document.getElementById('editCnh').value;
    const dateOfBirth = document.getElementById('editDateOfBirth').value;

    const parsedPhone = phone.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '');

    const userDocument =  Mask.removeDotandDash(documentUser)

    if (gender === "")
        return swal('Campo obrigatório', 'Selecione o gênero do(a) motorista!', 'info');

    if (parsedPhone.length !== 11)
        return swal('', 'Digite o telefone com todos os digitos!', 'info');

    if (userDocument.length !== 14 && userDocument.length !== 11)
        return swal('Campo obrigatório', 'Digite o CPF/CNPJ do(a) motorista!', 'info');

    data.gender = gender;
    data.name = name;
    data.email = email;
    data.nickname = nickname;
    data.phone = phone;
    data.document = userDocument;
    data.gender = gender;
    data.cnh = cnh;
    data.dateOfBirth = dateOfBirth;

    sendUpdate(data);
});

function sendUpdate(data) {
    SwalCustom.dialogConfirm("Deseja realmente alterar os dados do(a) motorista?", "Confira os dados antes de confirmar!", status => {
        if (!status)
            return;
        preload(true);
        DriverController.updateDriver(data, driverId).then(res => {
            if (res.status) {
                preload(false);
                $('#driverEditData').modal('hide');
                swal('', res.message, 'success');
                return getDataUser();
            }
            swal('ops', res.message, 'error');
        });
    });
}

elementProperty.addEventInElement('.btn-edit-car-data', 'onclick', function () {
    $('#carEditData').modal('show');
});

DriverController.getBanks().then(response => {
    elementProperty.getElement('#mount-bank', these => {
        let content = '';
        content += response.response.map(item => {
            return `    
                <option value="${item.idBank}">${item.bankName}</option>
            `;
        }).join('');
        these.innerHTML = '<option value="" disabled selected>Selecione o banco do motorista</option>' + content;
    });
});

elementProperty.addEventInElement('#formDataCarDriver', 'onsubmit', function (event) {
    event.preventDefault();
    const data = {};

    elementProperty.getElement('#editModel', model => {
        data.model = model.value;
    });

    elementProperty.getElement('#editPlate', plate => {
        data.plate = plate.value;
    });

    elementProperty.getElement('#editColor', color => {
        data.color = color.value;
    });

    elementProperty.getElement('#editBrand', brand => {
        data.brand = brand.value;
    });

    elementProperty.getElement('#editRenavan', renavam => {
        data.renavam = renavam.value;
    });

    elementProperty.getElement('#editYear', year => {
        data.year = year.value;
    });

    SwalCustom.dialogConfirm("Deseja realmente alterar os dados do carro do(a) motorista?", "Confira os dados antes de confirmar!", status => {
        if (!status)
            return;
        preload(true);
        DriverController.updateDataCar(data, idCar).then(resolve => {
            if (resolve.status) {
                preload(false);
                $('#carEditData').modal('hide');
                swal('', resolve.message, 'success');
                return getDataUser();
            }
            preload(false);
            swal('ops', resolve.message, 'error');
        });
    });
});

function loadDriverSplitConfig(driverId, driverSplitConfig) {
    if (Session.get('enable_driver_split_payment') !== '1') {
        document.getElementById('card-split').innerHTML = ``;

        return;
    }

    if (driverSplitConfig == null) {

        document.getElementById('driver-split-config-content').innerHTML = `
            <div class="text-center">
                <p class="text-center">O motorista ainda não possui uma configuração de split de pagamentos.
                Clique no botão abaixo para criar uma.</p>
                <button class="btn btn-primary" onclick="createDriverSplitConfig(${driverId})">
                    Criar configuração de divisão de ganhos
                </button>
            </div>
        `;

        return;
    }

    if (driverSplitConfig.status !== 'Ativo') {
        document.getElementById('driver-split-config-content').innerHTML = `
            <div class="text-center">
                <p class="text-center">O motorista possui uma configuração de split de pagamentos, mas ela ainda esta pendente de aprovação. O processo por levar até 7 dias para ser aprovado.</p>
            </div>
        `;

        return;
    }

    document.getElementById('driver-split-config-content').innerHTML = `
        <div class="text-center">
            <p class="text-center">O motorista possui split de pagamentos ativo.</p>
        </div>
    `;
}

function createDriverSplitConfig(driverId) {
    SwalCustom.dialogConfirm("Deseja realmente solicitar o split de pagamentos para o motorista?", "", status => {
        if (!status) {
            return;
        }

        preload(true);
        DriverController.createDriverSplitConfig(driverId).then(({status, response, message, paramError}) => {
            preload(false);

            if (status) {
                swal("", message, "success");
                return getDataUser();
            }
            
            if (paramError === true) {
                return swal("ops", response[0], "error");
            }

            swal("ops", message, "error");
        });
    });
}

function imageZoom(imgID, resultID) {
    var img, lens, result, cx, cy;
    img = document.getElementById(imgID);
    result = document.getElementById(resultID);
    /* Create lens: */
    lens = document.createElement("DIV");
    lens.setAttribute("class", "img-zoom-lens");
    /* Insert lens: */
    img.parentElement.insertBefore(lens, img);
    /* Calculate the ratio between result DIV and lens: */
    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;
    /* Set background properties for the result DIV */
    result.style.backgroundImage = "url('" + img.src + "')";
    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
    /* Execute a function when someone moves the cursor over the image, or the lens: */
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);
    /* And also for touch screens: */
    lens.addEventListener("touchmove", moveLens);
    img.addEventListener("touchmove", moveLens);

    function moveLens(e) {
        var pos, x, y;
        /* Prevent any other actions that may occur when moving over the image */
        e.preventDefault();
        /* Get the cursor's x and y positions: */
        pos = getCursorPos(e);
        /* Calculate the position of the lens: */
        x = pos.x - (lens.offsetWidth / 2);
        y = pos.y - (lens.offsetHeight / 2);
        /* Prevent the lens from being positioned outside the image: */
        if (x > img.width - lens.offsetWidth) {
            x = img.width - lens.offsetWidth;
        }
        if (x < 0) {
            x = 0;
        }
        if (y > img.height - lens.offsetHeight) {
            y = img.height - lens.offsetHeight;
        }
        if (y < 0) {
            y = 0;
        }
        /* Set the position of the lens: */
        lens.style.left = x + "px";
        lens.style.top = y + "px";
        /* Display what the lens "sees": */
        result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    }

    function getCursorPos(e) {
        var a, x = 0, y = 0;
        e = e || window.event;
        /* Get the x and y positions of the image: */
        a = img.getBoundingClientRect();
        /* Calculate the cursor's x and y coordinates, relative to the image: */
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /* Consider any page scrolling: */
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return {x: x, y: y};
    }

}
