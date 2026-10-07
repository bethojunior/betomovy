class CreateAccount {
    constructor() {
        this.elementProperty = new ElementProperty();
        this.bankController = new BankController();
        this.bankAccountController = new BankAccountController();

        this.userLogged = Session.get("user");

        const _that = this;

        this.bank = null;

        this.bankController.getAll().then(({status, data}) => {
            if (!status)
                return;

            /*_that.elementProperty.getElement("#bankAccount", element => {
                element.innerHTML = "<option value='' disabled selected>SELECIONE UM BANCO</option>"
                    .concat(data.map(bank => {
                        return `<option value="${bank.idBank}">${bank.bankName}</option>`;
                    }).join());
            });*/

            const autocomplete = new Autocomplete();
            autocomplete.initAutocomplete("#bankAccount", data, "bankName", ["bankName"]);

            autocomplete.getItemSelected(bank => {
                _that.bank = bank;
            });

            $('select').material_select();
        });
    }

    createSignUpAccount(callback,edit = false,idBankAccount) {
        const _that = this;

        Mask.setMaskCpf("#documentBank");

        this.elementProperty.getElement("#titleBankAccount", element => {
            element.innerHTML = 'Cadastro de conta';
            if(edit)
                element.innerHTML = 'Alteração de conta';
        });
        this.elementProperty.getElement("#closeModalBankAccount", element => {
            element.style.display = "none";
            if(edit)
                element.style.display = "block";
        });
        this.elementProperty.getElement(".modal-bank-account", element => {
            element.classList.add("active");
        });

        this.elementProperty.addEventInElement("#closeModalBankAccount","onclick", function(){
            _that.elementProperty.getElement(".modal-bank-account", element => {
                element.classList.remove("active");
            });
        });

        this.elementProperty.getElement(".modal-bank-account", element => {
            setTimeout(function(){
                element.getElementsByClassName("select-wrapper")[0].classList.add("typeAccount");
            },500)
        });

        this.elementProperty.addEventInElement("#opBank","onfocus",function(){
            _that.elementProperty.getElement("#btnSaveAccountBank", element => {
                element.classList.add("active");
            });
            _that.elementProperty.getElement(".modal-bank-account", element => {
                setTimeout(function(){
                    element.scrollTo(0, element.scrollHeight);
                },200)
            })
        });

        this.elementProperty.addEventInElement("#cepBank","onfocus",function(){
            // Removendo cep de mascara Mask.setMaskCep("#cepBank");
            _that.elementProperty.getElement("#btnSaveAccountBank", element => {
                element.classList.add("active");
            });
            _that.elementProperty.getElement(".modal-bank-account", element => {
                setTimeout(function(){
                    element.scrollTo(0, element.scrollHeight);
                },200)
            })
        });

        this.elementProperty.addEventInElement("#cepBank","onblur",function(){
            const cep = document.getElementById("cepBank").value;
            if(cep.length === 0)
                return;
            if (/^(.)\1+$/.test(cep))
                return;

            const url = `https://viacep.com.br/ws/${cep}/json/`;

            fetch(url).then(response => {
                return response.json();
            }).then(data => {
                if(data.erro){
                    SwalCustom.messageDialog("CEP não encontrado","Atenção",()=>{},"warning");
                    return;
                }
                
                document.getElementById("streetBank").value = data?.logradouro;
                document.getElementById("neighborhoodBank").value = data?.bairro;
                document.getElementById("cityBank").value = data?.localidade;
                document.getElementById("stateBank").value = data?.uf;
            });
        });
        

        this.elementProperty.addEventInElement("#date-birthday","onfocus",function(){
            Mask.setMaskDateBirthday("#date-birthday");
            _that.elementProperty.getElement("#btnSaveAccountBank", element => {
                element.classList.add("active");
            });
            _that.elementProperty.getElement(".modal-bank-account", element => {
                setTimeout(function(){
                    element.scrollTo(0, element.scrollHeight);
                },200)
            })
        });
            
        window.addEventListener('keyboardDidShow', (event) => {
            if(document.getElementById("opBank") !== document.activeElement)
                return;

            _that.elementProperty.getElement("#btnSaveAccountBank", element => {
                element.classList.add("active");
            });

            _that.elementProperty.getElement(".modal-bank-account", element => {
                setTimeout(function(){
                    element.scrollTo(0, element.scrollHeight);
                },200)
            })
        });

        window.addEventListener('keyboardDidHide', () => {
            _that.elementProperty.getElement("#btnSaveAccountBank", element => {
                element.classList.remove("active");
            })
        });

        this.elementProperty.addEventInElement("#btnSaveAccountBank","onclick",function(){
            _that.elementProperty.getObjectByForm("#formSignupAccount").then(object=>{
                if(!_that.validateAccount(object))
                    return;
                object['userId'] = parseInt(_that.userLogged.idUser);
                object['driverId'] = parseInt(_that.userLogged.idDriver);
                object['bankId'] = parseInt(_that.bank['idBank']);
                if(object?.['dateOfBirth']) {
                    object['dateOfBirth'] = Mask.replaceDateBirth(object['dateOfBirth']);
                }

                _that.elementProperty.getElement(".modal-bank-account", element => {
                    element.classList.remove("active");
                });

                if(edit){
                    _that.editAccountBank(object,idBankAccount,callback);
                    return;
                }

                _that.bankAccountController.insert(object).then(({status,data})=>{
                    if(!status){
                        SwalCustom.messageDialog("Ocorreu um problema ao tentar cadastra conta","atenção",()=>{},"warning");
                        return;
                    }

                    callback();

                })

            })
        })
    }


    validateAccount(account){
        if(account.holderName.length === 0){
            SwalCustom.messageDialog("Informe o nome do responsavel","Atenção",()=>{},"warning");
            return false;
        }
        if(account.numberAccount.length === 0){
            SwalCustom.messageDialog("Informe o numero da conta ","Atenção",()=>{},"warning");
            return false;
        }
        if(account.agency.length === 0){
            SwalCustom.messageDialog("Informe o numero da agência ","Atenção",()=>{},"warning");
            return false;
        }
        /*if(account.agencyDigit.length === 0){
            SwalCustom.messageDialog("Informe o numero do digito da agência ","Atenção",()=>{},"warning");
            return false;
        }*/
        if(account.bankId.length === 0){
            SwalCustom.messageDialog("Selecione um banco","Atenção",()=>{},"warning");
            return false;
        }

        if(!ValidateForm.validateCpf(account.document.replace(/\D/g, ''))){
            SwalCustom.messageDialog("CPF invalido","Atenção",()=>{},"warning");
            return false;
        }
        /*if(account.numberAccountDigit.length === 0){
            SwalCustom.messageDialog("Informe o numero do digito da conta","Atenção",()=>{},"warning");
            return false;
        }*/
        if(account.typeAccount.length === 0){
            SwalCustom.messageDialog("Informe o tipo de conta","Atenção",()=>{},"warning");
            return false;
        }
        if(this.bank === null){
            this.elementProperty.getElement("#bankAccount",element=>{
                element.value = "";
                element.focus();
            });
            SwalCustom.messageDialog("Banco não informado","Atenção",()=>{},"warning");
            return false;
        }

        return true;
    }

    editAccountBank(account,idBankAccount,callback){

        account['idBankAccount'] = idBankAccount;

        this.bankAccountController.edit(account).then(({status,data})=>{
            if(!status){
                SwalCustom.messageDialog("Ocorreu um problema ao tentar atualizar conta","atenção",()=>{},"warning");
                return;
            }

            callback();
        });
    }

}
