function changeLinkHeader(step = null) {

    const elementProperty = new ElementProperty();

    if(isMobile()){
        elementProperty.addEventInElement("input", "onfocus", function () {
            elementProperty.getElement(".btn-add-establishment",
                element => element.classList.add("active"));
            elementProperty.getElement(".container-form",
                element => element.classList.add("active"));
        });
    }
    elementProperty.addEventInElement("input", "onblur", function () {
        elementProperty.getElement(".btn-add-establishment",
            element => element.classList.remove("active"));
        elementProperty.getElement(".container-form",
            element => element.classList.remove("active"));
    });

    document.addEventListener('showkeyboard', function (e) {
        alert("teste")
    });

    if (step === null)
        document.getElementById('back-mobile').href = CURRENT_HOST

    if (step === 'basicInfo') {
        const link = document.getElementById('back-mobile')
        link.removeAttribute('href')
        link.onclick = renderBasicInfo
    }

    if (step === 'generalInfo') {
        const link = document.getElementById('back-mobile')
        link.removeAttribute('href')
        link.onclick = renderGeneralInfo
    }

    if (step === 'contactInfo') {
        const link = document.getElementById('back-mobile')
        link.removeAttribute('href')
        link.onclick = renderContactInfo
    }

    if (step === 'dataUser') {
        const link = document.getElementById('back-mobile')
        link.removeAttribute('href')
        link.onclick = renderGeneralInfo
    }

    if (step === 'bankInfo') {
        const link = document.getElementById('back-mobile')
        link.removeAttribute('href')
        link.onclick = renderBankInfo
    }
}

changeLinkHeader(step = null)


function renderBasicInfo(e = null) {

    if (e !== null)
        e.preventDefault()

    elementProperty
        .getElement('.wrapper-form', element => {
            element.innerHTML = ''
            element.innerHTML += `
            <h3>Informações básicas</h3>

            <div class="container-form">
                    <input type="text" placeholder="Estabelecimento" id="hostel-name" >
                    <input type="text" placeholder="Endereço" id="hostel-address" class="address-hostel">
                       
                    <div class="half-input">
                        <input type="text" placeholder="Número" id="hostel-number"
                               class="number-half" hidden>
                    </div>
                    <input type="text" placeholder="Bairro" id="hostel-neighboor" hidden>
                    <div class="half-input">
                        <input type="text" placeholder="CEP" id="hostel-cep" class="input-cep" hidden>
        
                        <select id="hostel-estate" class="input-uf" hidden>
                            <option value="">Estados</option>
                        </select>
        
                        <select id="hostel-city" hidden>
                            <option value="">Cidades</option>
                        </select>
        
                    </div>

            <a id="btn-basic-info" class="btn-add-establishment">Continuar</a>
            `

            changeLinkHeader()
            initSearchBox()
            applyMaskBasicInfo()
            getEstates()
            autoCompleteBasicInfo()
            addbasicInfo()
            getCoordsCepInput()
        })
}

function autoCompleteBasicInfo() {

    if (establishment.alias !== '') {
        document.getElementById('hostel-name').value = establishment.alias
        document.getElementById('hostel-address').value = establishment.address
        document.getElementById('hostel-number').value = establishment.number
        document.getElementById('hostel-cep').value = establishment.zipcode
        document.getElementById('hostel-neighboor').value = establishment.neighborhood


        const place = JSON.parse(localStorage.getItem("place"));

        setTimeout(function () {
            elementProperty.getElement("#hostel-estate", element => {
                element.value = searchInPlace("administrative_area_level_1", place)

                const estateId = element;

                countryController
                    .getAllCityByIdState(establishment.estateId)
                    .then(({status, data}) => {
                        if (status) {
                            renderCities(data)
                            elementProperty.getElement("#hostel-city",
                                city => city.value = searchInPlace("administrative_area_level_2", place));
                        }
                    })
                    .catch(err => console.log(err))

            });
        }, 500)
    }
}


function renderGeneralInfo(e = null) {
    if (e !== null)
        e.preventDefault()

    changeLinkHeader('basicInfo')

    elementProperty
        .getElement('.wrapper-form', element => {
            element.innerHTML = ''
            element.innerHTML += `
                <div class="wrapper-form">
                    <h3>Visão geral</h3>            
                    <div class="container-form">
                        <div class="group-input-item">
                            <label class="label-ranking">Classificação</label>
                            <div class="content-stars">
                                <i class="fas fa-star start" value="0"></i>
                                <i class="fas fa-star start" value="1"></i>
                                <i class="fas fa-star start" value="2"></i>
                                <i class="fas fa-star start" value="3"></i>
                                <i class="fas fa-star start" value="4"></i>
                            </div> 
                        </div>
                        
                        <input type="text" placeholder="Diária mínima" id="minValue" class="mask-money">
                        <input type="text" placeholder="Diária máxima" id="maxValue" class="mask-money">
                        <input type="text" disabled placeholder="Média" id="averageValue" class="mask-money">
                        <input type="text" placeholder="Desconto por indicação %" id="indication-discount" class="mask-money">
           
                        <a id="btn-geral-info" class="btn-add-establishment">Continuar</a>
            
                    </div>
            
                </div>
            `
            applyMaskGeneralInfo()
            autoCompleteGeneralInfo()
            waitClickStars()
            addGeneralInfo()
        })

    elementProperty.addEventInElement('#minValue', 'onchange', () => calcAverageValue())
    elementProperty.addEventInElement('#maxValue', 'onchange', () => calcAverageValue())
}

function autoCompleteGeneralInfo() {

    if (establishment.minDailyRate !== '') {

        document.getElementById('minValue').value = establishment.minDailyRate

        document.getElementById('maxValue').value = establishment.maxDailyRate

        document.getElementById('averageValue').value = establishment.averageValue

        document.getElementById('indication-discount').value = establishment.indicationDiscount

        paintStars(establishment.rating - 1)

    }
}

function renderContactInfo(e = null) {

    if (e !== null)
        e.preventDefault()

    changeLinkHeader('generalInfo')

    elementProperty
        .getElement('.wrapper-form', element => {
            element.innerHTML = ''
            element.innerHTML += `
                <div class="wrapper-form">
                    <h3>Contato</h3>            
                    <div class="container-form">
                        <input type="email" placeholder="Email comercial" id="comercial-email">
                        <input type="tel" placeholder="Telefone Comercial" id="comercial-phone" class="mask-telefone">
                        <input type="email" placeholder="Email administrativo" id="admin-email" >
                        <input type="tel" placeholder="Telefone administrativo"  id="admin-phone" class="mask-telefone">
           
                        <a id="btn-contact-info" class="btn-add-establishment">Continuar</a>
            
                    </div>
            
                </div>
            `
        })

    applyMaskPhone()
    addContactInfo()
    autoCompleteContactInfo()
}

function autoCompleteContactInfo() {
    if (establishment.commercialEmail !== '') {
        document.getElementById('comercial-email').value = establishment.commercialEmail
        document.getElementById('admin-email').value = establishment.administratorEmail
        document.getElementById('comercial-phone').value = establishment.commercialPhone
        document.getElementById('admin-phone').value = establishment.administratorPhone
    }
}

function renderBankInfo(e = null) {

    if (e !== null)
        e.preventDefault()

    elementProperty
        .getElement('.wrapper-form', element => {
            element.innerHTML = ''
            element.innerHTML += `
                <div class="wrapper-form">
                    <h3>Dados bancários</h3>            
                    <div class="container-form">
                        <!--<select  id="banks">
                            <option value="">Bancos</option>
                        </select>-->
                        <div class="half-input">
                            <input type="text" id="banks" placeholder="nome do banco"/>
                        </div>
                        <div class="half-input">
                            <input type="text" placeholder="Agência" id="bank-agency">
                            <input type="text" placeholder="Conta" id="bank-account">
                        </div>
                        
                        <div class="half-input">
                        <input type="text" placeholder="Dígito" id="account-dv">
                            <input type="text" placeholder="Operação" id="op">
                        </div>
                        
                        <select  id="bank-types">
                            <option value="">Tipo</option>
                            <option value="corrente">Corrente</option>
                            <option value="poupanca">Poupança</option>
                        </select>
                        
                        <input type="text" placeholder="Titular da conta" id="holder-account">
                        
                        <div class="half-input">
                            <select  id="document-bank-type">
                                <option value="">Tipo de documento</option>
                                <option value="cpf">CPF</option>
                                <option value="cnpj">CNPJ</option>
                            </select>
                            
                            <input type="tel" placeholder="Documento" id="document-bank">
                        </div>
           
                        <a id="btn-bank-info" class="btn-add-establishment">Continuar</a>
            
                    </div>
            
                </div>
            `

            changeLinkHeader('basicInfo')
            bankController
                .getAll(({status, data}) => {
                    if (status) {
                        renderLoadedBanks(data)
                        applyMaksBankDocument()
                        autoCompleteBankInfo()
                        addBankInfo()
                    }
                })
        })
}

function autoCompleteBankInfo() {
    if(establishment.user.bankAccount === undefined){
        establishment.user.bankAccount = {};
        return;
    }
    if (establishment.user.bankAccount.bankId !== '') {
        const bankId = document.getElementById('banks')
        bankId.selectedIndex = establishment.user.bankAccount.bankId

        const typeAccount = document.getElementById('bank-types')
        typeAccount.selectedIndex = establishment.user.bankAccount.typeAccount

        document.getElementById('bank-agency').value = establishment.user.bankAccount.agency
        document.getElementById('bank-account').value = establishment.user.bankAccount.numberAccount
        establishment.user.bankAccount.numberAccountDigit = document.getElementById('account-dv').value !== '' ? document.getElementById('account-dv').value : null
        establishment.user.bankAccount.op = document.getElementById('op').value !== '' ? document.getElementById('op').value : null
        establishment.user.bankAccount.holderName = document.getElementById('holder-account').value !== '' ? document.getElementById('holder-account').value : null
        establishment.user.bankAccount.document = document.getElementById('document-bank').value !== '' ? document.getElementById('document-bank').value : null

    }
}

function renderLoadedBanks(arrayBanks) {

    /* const list = arrayBanks.map(bank => {
         return `<option value='${bank.idBank}'>${bank.bankName}</option>`
     }).join()

     elementProperty
         .getElement('#banks', element => {
             element.innerHTML = ''
             element.innerHTML += list
         })*/

    const autocomplete = new Autocomplete();

    autocomplete.initAutocomplete('#banks', arrayBanks, 'bankName', ['bankName']);

    autocomplete.getItemSelected(bank => {
        localStorage.setItem("bank", JSON.stringify(bank));
    });
}

function renderAddImages(e = null) {

    if (e !== null)
        e.preventDefault()

    elementProperty
        .getElement('.wrapper-form', element => {
            element.innerHTML = ''
            element.innerHTML += `
                <div class="wrapper-form">
                    <h3>Adicionar fotos</h3>      
                    <div class="content-images"></div>      
                    <div class="container-form">
                        <div class="content-images">
                            <div class="main-image">
                            <label for="image-1"><img src='${CURRENT_HOST}webfiles/img/picture.png'  alt="Imagem 1" id="image-1-hostel"></label>
                            <input type="file" id="image-1" class="get-image">
                        </div>
                        <div class="alternative-images">
                            <div class="block-image">
                                <label for="image-2"><img src='${CURRENT_HOST}webfiles/img/ICON_MAIS.png' alt="Imagem 2" id="image-2-hostel"></label>
                                <input type="file" id="image-2" class="get-image">
                            </div>
                
                            <div class="block-image">
                                <label for="image-3"><img src='${CURRENT_HOST}webfiles/img/ICON_MAIS.png' alt="Imagem 3" id="image-3-hostel" ></label>
                                <input type="file" id="image-3" class="get-image">
                            </div>
                
                            <div class="block-image">
                                <label for="image-4"><img src='${CURRENT_HOST}webfiles/img/ICON_MAIS.png' alt="Imagem 4" id="image-4-hostel"></label>
                                <input type="file" id="image-4" class="get-image">
                            </div>
                
                            <div class="block-image">
                                <label for="image-5"><img src='${CURRENT_HOST}webfiles/img/ICON_MAIS.png' alt="Imagem 5" id="image-5-hostel"></label>
                                <input type="file" id="image-5" class="get-image">
                            </div>
                        </div>
                        </div>
                        <a id="btn-images-info" class="btn-add-establishment">Continuar</a>
            
                    </div>
            
                </div>
            `

            changeLinkHeader('bankInfo')
            clickInputImage()
            addImages()
            autoCompleteImages()
        })
}

function autoCompleteImages() {
    if (images.length > 0) {
        console.log('implements autocomplete image')
    }
}

function renderAddEmployee(e = null) {

    if (e !== null)
        e.preventDefault()

    changeLinkHeader('imageInfo')

    elementProperty
        .getElement('.wrapper-form', element => {
            element.innerHTML = ''
            element.innerHTML += `
                <h3>Cadastro de colaborador</h3>            
                    <div class="container-form add-employees">
                    
                        <input type="text" placeholder="Nome" id="name-employee">
                        
                        <div class="half-input">
                            <input type="text" placeholder="Apelido" id="nickname-employee">
                            <input type="tel" placeholder="CPF" id="cpf-employee">
                        </div>
                        
                        <div class="half-input">
                            <input type="tel" placeholder="Celular" id="phone-employee" class="mask-telefone">
                            <input type="email" placeholder="Email" id="email-employee">
                        </div>
                        
                        <select  id="occupation-type">
                            <option value="1">Gestor da plataforma</option>
                            <option value="2">Colaborador</option>
                        </select>
                        
                        <input type="text" placeholder="Cargo" id="occupation"> 
                        <input type="password" placeholder="Senha" id="password-employee">
                        
                        <div class="btns">
                            <a id="btn-employee-info" class="btn-add-establishment">Adiconar colaborador</a>
                            <a id="btn-employees-info" class="btn-add-establishment hide-element">Continuar</a>
                        </div>
                    </div>
            `

            if (establishment.employees.length > 0) {
                document.getElementById('btn-employees-info').classList.remove('hide-element')
            }

            applyMasksAddEmployee()
            addEmployee()

        })
}


function renderEmployees() {
    console.log(establishment.employees)
    elementProperty
        .getElement('.wrapper-form', element => {
            element.innerHTML = ''
            element.innerHTML += `
                <h3>Cadastro de colaborador</h3>            
                <div class="container-form add-employees">
                    <table id="table-employees">
                        <thead>
                            <tr>
                                <th>Cod</th>
                                <th>Nome</th>
                                <th>Função</th>
                                <th>Ações</th> 
                            </tr>
                        </thead>
                        <tbddy>
                        ${establishment.employees.map((employee, index) => {
                return (`
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${employee.name}</td>
                                    <td>${employee.occupation}</td>
                                    <td>
                                        <a class="remove-employee" value='${index}'><i class="far fa-trash-alt"></i></a>                                       
                                    </td> 
                                </tr>
                            `)
            }).join()}
                        </tbddy>
                    </table>
                    
                    <div class="btns-table-employee">
                        <a id="btn-new-employee-info" class="btn-add-establishment">Adiconar colaborador</a>
                        <a id="btn-save-info" class="btn-add-establishment">Salvar</a>
                    </div>
                    
                </div>            
            `

            removeEmployee()
            saveEstablishment()
            addEmployeeAgain()
        })
}

function renderDataUser() {
    elementProperty
        .getElement('.wrapper-form', element => {
            element.innerHTML = ''
            element.innerHTML += `
                <h3>Dados do Usuário</h3>            
                    <div class="container-form add-employees">
                    
                        <input type="text" placeholder="Nome Completo" id="name-user">
                        <div class="half-input">
                        <input type="tel" placeholder="CPF" id="cpf-user">
                        <input type="tel" placeholder="Celular" id="phone-user" class="mask-telefone">
                        </div>
                        <input type="email" placeholder="Email" id="email-user">
                        <input type="password" placeholder="Senha" id="password-user">
                        <input type="password" placeholder="Confirme a senha" id="confirm-password-user">
                          
                       <a id="btn-user-info" class="btn-add-establishment">SALVAR</a>
                    </div>
            `
        })
    changeLinkHeader('dataUser')
    getMaskDataUser();
    addEventDataUser();
}


function removeEmployee() {
    elementProperty
        .addEventInElement('.remove-employee', 'onclick', element => {

            element.srcElement.closest('TR').remove()

            const index = element.srcElement.closest('A').getAttribute('value')
            establishment.employees.splice(index, 1)

        })
}

