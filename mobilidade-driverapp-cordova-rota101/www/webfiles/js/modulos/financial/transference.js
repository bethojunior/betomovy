viewController.setObserver("transference", function () {

    $('.modal').modal();

    const elementProperty = new ElementProperty();

    const driverController = new DriverController();
    const withdrawController = new WithdrawController();
    const createAccount = new CreateAccount();

    const userLogged = Session.get("user");

    const dataBank = {
        idBankAccount: ''
    };

    let balanceDrive = 0;

    let isTransfered = false;

    Mask.setMoneyField("#valueTransference");
    Mask.setMaxValue("#valueTransference", 2000);

    clearData();
    updateInfoDriver();

    PreloaderCustomer.show();

    window.addEventListener('keyboardDidShow', function () {
        elementProperty.getElement("#imgTransference", element => {
            element.style.display = "none";
        });

        elementProperty.getElement(".container-value-transference", element => {
            element.classList.add("active");
        });
    });

    window.addEventListener('keyboardDidHide', function () {
        elementProperty.getElement("#imgTransference", element => {
            element.style.display = "";
        });

        elementProperty.getElement(".container-value-transference", element => {
            element.classList.remove("active");
        });
    });

    elementProperty.addEventInElement(".back-to", "onclick", function () {
        Route.backPage();
    });

    elementProperty.getElement("#nameCPFTransference", element => {
        element.innerHTML = userLogged.document;
    });

    elementProperty.getElement("#nameClientTransference", element => {
        element.innerHTML = userLogged.name;
    });

    elementProperty.getElement(".description-type", element => {
        element.innerHTML = CityConfig.getTypeCoin();
    });

    elementProperty.addEventInElement('#btnIconMoney', "onclick", function() {
        elementProperty.addClass(".icon-moeda", "active");
        elementProperty.getElement("#valueTransference", input => {
            const valueTransference = Mask.removeMaskMoney(input.value);

            if (valueTransference <= 0) {
                SwalCustom.messageDialog("Informe o valor de transferência", "Atenção", () => {
                    isTransfered = false;
                }, "info");
                return;
            }

            if (balanceDrive < valueTransference) {
                SwalCustom.messageDialog("Valor solicitado ultrapassa o saldo atual", "Atenção", () => {
                    isTransfered = false;
                }, "info");
                return;
            }

            requestTransference(valueTransference);
        });
    })

    elementProperty.addEventInElement(".close-modal-transference", "onclick", function () {
        elementProperty.getElement("#containerReceiptTransference", element => {
            element.classList.remove("active");
        });
    });

    elementProperty.getElement("#dateTransference", element => {
        element.innerHTML = DateCustom.formatDate(DateCustom.getBusinessDay());
    });

    function openModalWithNoAddress(driver, callback) {
        if (!driver.zipCode) {
            SwalCustom.messageDialog("",
            "Seu cadastro precisa de alguns dados, preencha para continuar!", undefined,
            "warning");
            if(callback)
            callback();
        }
    }

    function updateInfoDriver() {
        preload(true);
        driverController.findWithAccountInfo(userLogged.idDriver).then(({status, data}) => {
            preload(false);
            PreloaderCustomer.hidden();
            if (!status) {
                createAccount.createSignUpAccount(updateInfoDriver);
                return;
            }

            openModalWithNoAddress(data, () => createAccount.createSignUpAccount(updateInfoDriver, true, data.idBankAccount));

            sessionStorage.setItem('bank-name', data.bankName)

            document.querySelector('.input-customer-bank').value = data.holderName;
            document.querySelector('#documentBank').value = data.document;
            document.querySelector('.agency-bank').value = data.agency;
            document.querySelector('.op-bank').value = data.op;
            document.querySelector('.number-account-bank').value = data.numberAccount;
            document.querySelector('.number-account-digit-bank').value = data.numberAccountDigit;
            document.querySelector('.agency-digit-bank').value = data.agencyDigit;
            document.querySelector('#pixBank-transfer').value = data.pix;

            document.querySelector("#date-birthday").value = Mask.replaceMaskDateUSToPT(data?.dateOfBirth);

            document.querySelector("#cepBank").value = data?.zipCode;
            document.querySelector("#streetBank").value = data?.street;
            document.querySelector("#numberBank").value = data?.number;
            document.querySelector("#complementBank").value = data?.complement;
            document.querySelector("#neighborhoodBank").value = data?.neighborhood;
            document.querySelector("#cityBank").value = data?.city;
            document.querySelector("#stateBank").value = data?.state;

            dataBank.idBankAccount = parseInt(data.idBankAccount);

            elementProperty.getElement(".name-client-data", element => {
                element.innerHTML = data.holderName;
            });
            elementProperty.getElement(".transference-cpf", element => {
                element.innerHTML = data.document;
            });
            elementProperty.getElement(".name-bank-transference", element => {
                element.innerHTML = data.bankName;
            });
            elementProperty.getElement(".date-account-transference", element => {
                element.innerHTML = `${data.agency} ${data.op} ${data.numberAccount} ${data.numberAccountDigit}`;
            });
            elementProperty.getElement(".pix-account-transference", element => {
                element.innerHTML = data.pix;
            });
            elementProperty.getElement(".value-balance", element => {
                balanceDrive = parseFloat(data.balance);
                element.innerHTML = `${CityConfig.getTypeCoin()}`+Mask.maskMoney(balanceDrive);
            });
            elementProperty.getElement("#valueTransference", element => {
                element.value = Mask.maskMoney(parseFloat(data.balance));
            });
        });
    }

    function clearData() {
        elementProperty.getElement(".name-client-data", element => {
            element.innerHTML = "-";
        });
        elementProperty.getElement(".transference-cpf", element => {
            element.innerHTML = "-";
        });
        elementProperty.getElement(".name-bank-transference", element => {
            element.innerHTML = "-";
        });
        elementProperty.getElement(".date-account-transference", element => {
            element.innerHTML = `-`;
        });
        elementProperty.getElement(".value-balance", element => {
            balanceDrive = parseFloat(0);
            element.innerHTML = "-";
        });
        elementProperty.getElement("#valueTransference", element => {
            element.value = "0,00"
        });
    }

    function requestTransference(value) {
        preload(true);
        withdrawController.actionNew(parseInt(userLogged.idDriver), parseFloat(value))
            .then(({message, status, data, errors}) => {
                preload(false);
                isTransfered = false;

                elementProperty.getElement("#btnIconMoney", modal => {
                    modal.classList.remove("active");
                });

                if (!status && errors?.code == 0) {
                    SwalCustom.messageDialog(errors.message, "Atenção");
                    return;
                }

                if (!status) {
                    SwalCustom.showMessageError(errors,`Valor Minimo : ${CityConfig.getTypeCoin()} `+Mask.maskMoney(data.minimunValue));
                    return;
                }

                updateInfoDriver();
                showReceipt(value, data);

            });
    }

    function showReceipt(value, code) {
        elementProperty.getElement(".period-transference", element => {
            const dateTimeArray = DateCustom.formatDateTime().split(" ");
            element.innerHTML = `${dateTimeArray[0]}, às ${dateTimeArray[1]}`;
        });

        elementProperty.getElement(".value-transference", element => {
            element.innerHTML = `${CityConfig.getTypeCoin()} <span class="value-integer">${Mask.maskMoney(value)}</span>`;
        });

        /*elementProperty.getElement(".value-integer", element => {
            element.innerHTML = parseInt(value);
        });

        elementProperty.getElement(".value-rest", element => {
            const rest = ((value - parseInt(value)) * 100);

            if (rest <= 0) {
                element.innerHTML = ",00";
                return;
            }

            element.innerHTML = "," + Mask.digitsToTheLeft(2, rest.toString());
        });*/
        elementProperty.getElement(".number-register-transference", element => {
            element.innerHTML = "Nº do recibo: " + CodeSecurity.clearConfirmationCode(code);
        });

        elementProperty.getElement("#containerReceiptTransference", modal => {
            modal.classList.add("active");
        });

        elementProperty.getElement(".name-client-data", element => {
            const content =
                `Ola ${element.innerHTML}.\nUma transfêrencia foi solicitada para sua conta.\n Em brever enviaremos o comprovate da mesma.\n`;

            codeSecutiry = CodeSecurity.clearConfirmationCode(code);
            elementProperty.addEventInElement("#shareReceipt", "onclick", function () {
                WithdrawController.actionFind(codeSecutiry).then(res => {
                    loadReceived(res , code);
                });
            });
        });
    }

    elementProperty.addEventInElement(".edit-account-bank", "onclick", function () {
        createAccount.createSignUpAccount(updateInfoDriver, true, dataBank.idBankAccount);
    });

    function loadReceived(res , code){

        window.plugins.socialsharing.shareWithOptions({
            message: "Comprovante de transferência",
            subject: 'TaxiReturn',
            url: `${HOST_SITE}document/receipt/${code}`,
        }, (result)=>{}, (error)=>{});

        // $('#modalReceivedTransfer').modal('open');

        // elementProperty.getElement('#codeVerify' , that => {
        //     that.innerHTML = code;
        // });
        //
        // elementProperty.getElement('#valueTranference' , that => {
        //     that.innerHTML = "R$ "+FormatNumber.cash(res.data.value);
        // });
        //
        // elementProperty.getElement('#agencia' , that => {
        //     that.innerHTML = res.data.agency;
        // });
        //
        // elementProperty.getElement('#account' , that => {
        //     that.innerHTML = res.data.numberAccount;
        // });
        //
        // elementProperty.getElement('#nameUser' , that => {
        //     that.innerHTML = res.data.name;
        // });

    }

});
