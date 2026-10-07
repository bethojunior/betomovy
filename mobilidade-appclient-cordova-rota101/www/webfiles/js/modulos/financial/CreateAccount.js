class CreateAccount {
    constructor() {
        this.elementProperty = new ElementProperty();
        this.bankController = new BankController();
        this.bankAccountController = new BankAccountController();

        this.userLogged = Session.get("user");

        this.bank = null;

        this.bankController.getAll().then(({status, data}) => {
            if (!status)
                return;

            const autocomplete = new Autocomplete();
            autocomplete.initAutocomplete("#bankAccount", data, "bankName", ["bankName"]);

            autocomplete.getItemSelected(bank => {
                this.bank = bank;
            });
        });
    }

    createSignUpAccount(callback,edit = false,idBankAccount) {

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

        this.elementProperty.addEventInElement("#closeModalBankAccount","onclick", ()=>{
            this.elementProperty.getElement(".modal-bank-account", element => {
                element.classList.remove("active");
            });
        });

        /*this.elementProperty.getElement(".modal-bank-account", element => {
            setTimeout(function(){
                element.getElementsByClassName("select-wrapper")[0].classList.add("typeAccount");
            },500)
        });*/

        this.elementProperty.addEventInElement("#opBank","onfocus",()=>{
            this.elementProperty.getElement("#btnSaveAccountBank", element => {
                element.classList.add("active");
            });
            this.elementProperty.getElement(".modal-bank-account", element => {
                setTimeout(function(){
                    element.scrollTo(0, element.scrollHeight);
                },200)
            })
        });

        window.addEventListener('keyboardDidShow', () => {
            if(document.getElementById("opBank") !== document.activeElement)
                return;

            this.elementProperty.getElement("#btnSaveAccountBank", element => {
                element.classList.add("active");
            });

            this.elementProperty.getElement(".modal-bank-account", element => {
                setTimeout(function(){
                    element.scrollTo(0, element.scrollHeight);
                },200)
            })
        });

        window.addEventListener('keyboardDidHide', () => {
            this.elementProperty.getElement("#btnSaveAccountBank", element => {
                element.classList.remove("active");
            })
        });

        this.elementProperty.addEventInElement("#btnSaveAccountBank","onclick",()=>{
            this.elementProperty.getObjectByForm("#formSignupAccount").then(object=>{
                if(!this.validateAccount(object))
                    return;
                object['userId'] = parseInt(this.userLogged.idUser);
                object['bankId'] = parseInt(this.bank['idBank']);

                this.elementProperty.getElement(".modal-bank-account", element => {
                    element.classList.remove("active");
                });

                if(edit){
                    this.editAccountBank(object,idBankAccount,callback);
                    return;
                }
                preload(true);
                this.bankAccountController.insert(object).then(({status})=>{
                    preload(false);
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
        preload(true);
        this.bankAccountController.edit(account).then(({status})=>{
            preload(false);
            if(!status){
                SwalCustom.messageDialog("Ocorreu um problema ao tentar atualizar conta","atenção",()=>{},"warning");
                return;
            }

            callback();
        });
    }

}