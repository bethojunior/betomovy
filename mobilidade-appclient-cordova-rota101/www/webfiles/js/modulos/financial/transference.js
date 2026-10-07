viewController.setObserver("transference", function () {
    const elementProperty = new ElementProperty();

    const createAccount = new CreateAccount();

    const userLogged = Session.get("user");

    let timeout = null;

    const touch = new EventTouche();

    const dataBank = {
        idBankAccount: ''
    };

    let balanceCustomer = 0;

    let isTransfered = false;

    Mask.setMoneyField("#valueTransference");
    Mask.setMaxValue("#valueTransference", 2000);

    clearData();
    updateInfoDriver();

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

    touch.addEventDistanceVertical("#btnIconMoney", (distance, element) => {
        if (distance > 150) {
            if (isTransfered)
                return;

            clearTimeout(timeout);

            isTransfered = true;

            elementProperty.getElement("#valueTransference", input => {
                const valueTransference = Mask.removeMaskMoney(input.value);

                if (valueTransference <= 0) {
                    SwalCustom.messageDialog("Informe o valor de transferência", "Atenção", () => {
                        isTransfered = false;
                        element.classList.remove("active");
                    }, "info");
                    return;
                }

                if (balanceCustomer < valueTransference) {
                    SwalCustom.messageDialog("Valor solicitado ultrapassa o saldo atual", "Atenção", () => {
                        isTransfered = false;
                        element.classList.remove("active");
                    }, "info");
                    return;
                }

                element.classList.add("active");

                timeout = setTimeout(function () {
                    requestTransference(valueTransference);
                }, 1200);
            });
        }
    });

    elementProperty.addEventInElement(".close-modal-transference", "onclick", function () {
        Route.backPage();
    });

    elementProperty.getElement("#dateTransference", element => {
        element.innerHTML = DateCustom.formatDate(DateCustom.getBusinessDay());
    });

    function updateInfoDriver() {
        preload(true);
        BankAccountController.findByUser(userLogged.idUser).then(({status, data}) => {
            preload(false);
            if (!status)
                return;

            if (!data) {
                createAccount.createSignUpAccount(updateInfoDriver);
                return;
            }

            dataBank.idBankAccount = parseInt(data.idBankAccount);

            elementProperty.getElement(".name-client-data", element => {
                element.innerHTML = data.holderName || " ";
            });
            elementProperty.getElement(".transference-cpf", element => {
                element.innerHTML = data.document || " ";
            });
            elementProperty.getElement(".name-bank-transference", element => {
                element.innerHTML = data.bankName || " ";
            });
            elementProperty.getElement(".date-account-transference", element => {
                element.innerHTML = `${data.agency || " "} ${data.op || " "} ${data.numberAccount || " "} ${data.numberAccountDigit || " "}`;
            });
            elementProperty.getElement(".pix-account-transference", element => {
                element.innerHTML = data.pix || " ";
            });
        });

        const balance = Session.get("balanceCustomer");

        elementProperty.getElement(".value-balance", element => {
            balanceCustomer = parseFloat(balance.balance);
            element.innerHTML = CityConfig.getTypeCoin() + Mask.maskMoney(balanceCustomer);
        });
        elementProperty.getElement("#valueTransference", element => {
            element.value = Mask.maskMoney(parseFloat(balance.balance));
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
            balanceCustomer = parseFloat(0);
            element.innerHTML = "-";
        });
        elementProperty.getElement("#valueTransference", element => {
            element.value = "0,00"
        });
    }

    function requestTransference(value) {
        const userLogged = Session.get("user");
        PartnerBalanceController.withdraw(parseInt(userLogged.idCustomer), parseFloat(value))
            .then(({message, status, data, errors}) => {
                isTransfered = false;

                elementProperty.getElement("#btnIconMoney", modal => {
                    modal.classList.remove("active");
                });

                updateInfoDriver();

                if (!status) {
                    SwalCustom.messageDialog('', `Valor Minimo : ${CityConfig.getTypeCoin()} ` + Mask.maskMoney(data.minimunValue), undefined, "info");
                    return;
                }

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

        elementProperty.getElement(".number-register-transference", element => {
            element.innerHTML = "Nº do recibo: " + CodeSecurity.clearConfirmationCode(code);
        });

        elementProperty.getElement("#containerReceiptTransference", modal => {
            modal.classList.add("active");
        });

        Route.startClassesInComponent([{
            component:"#containerReceiptTransference",
            class:"active"
        }],()=>{
            viewController.elementProperty.removeClass("#containerReceiptTransference","active")
            Route.backPage();
        });

        elementProperty.getElement(".name-client-data", element => {
            const content =
                `Ola ${element.innerHTML}.\nUma transfêrencia foi solicitada para sua conta.\n Em brever enviaremos o comprovate da mesma.\n`;

            codeSecutiry = CodeSecurity.clearConfirmationCode(code);
            elementProperty.addEventInElement("#shareReceipt", "onclick", function () {
                WithdrawController.actionFind(codeSecutiry).then(res => {
                    loadReceived(res, code);
                });
            });
        });
    }

    elementProperty.addEventInElement(".edit-account-bank", "onclick", function () {
        createAccount.createSignUpAccount(updateInfoDriver, true, dataBank.idBankAccount);
    });

    function loadReceived(res, code) {

        window.plugins.socialsharing.shareWithOptions({
            message: "Comprovante de transferência",
            subject: 'TaxiReturn',
            url: `${HOST_SITE}document/receipt/${code}`,
        }, (result) => {
        }, (error) => {
        });

    }

});
