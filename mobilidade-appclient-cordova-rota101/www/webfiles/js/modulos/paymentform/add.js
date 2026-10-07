viewController.setObserver("add-card", async function () {
    const elementProperty = new ElementProperty();
    const paymentCard = new PaymentCard();
    let mercadoPago = false;
    paymentCard.updateToken();

    const customerCardController = new CustomerCardController();
    
    $("#dateOfBirth").inputmask({mask: ['99/99/9999']});

    window.addCardManager = {
        callback: undefined
    };

    await customerCardController.verifyAcquirer().then((response) => {
        if(response.data.name == 'MERCADO PAGO') return mercadoPago = true;
    });

    elementProperty.addClass(".container-add-card", "active");

    Mask.setMaskCpf("#documentCard");
    Mask.setMonthYear("#dateMonthYear");
    Mask.setCreditCard("#cardNumber");

    elementProperty.addEventInElement("#backPaymentForm", "onclick", function () {
        //elementProperty.removeClass(".container-add-card", "active")
        Route.backPage();
    });

    elementProperty.addEventInElement("#addCard", "onsubmit", function (event) {
        event.preventDefault();

        const cardNumber = document.getElementById("cardNumber").value;

        if (existCard(cardNumber.split(" ").join(""))) {
            SwalCustom.messageDialog("", getTextTranslate("card", "card_already_exists"), undefined, "warning");
            return;
        }

        if (!ValidateForm.validateCpf(document.getElementById("documentCard")
            .value.replace(/\D/g, ''))) {
            SwalCustom.messageDialog("", getTextTranslate("card", "invalid_document"), undefined, "warning");
            return false;
        }

        if (!Mask.detectCardType(cardNumber.split(" ").join(""))) {
            SwalCustom.messageDialog("", getTextTranslate("card", "invalid_card"), undefined, "warning");
            return false;
        }

        if (!validateDate()) {
            SwalCustom.messageDialog("", getTextTranslate("card", "invalid_expiration_date"));
            return false;
        }
        if (document.getElementById("securityCode").value.length === 0) {
            SwalCustom.messageDialog("", getTextTranslate("card", "invalid_cvv"));
            return false;
        }
        if(document.getElementById('dateOfBirth').value == ""){
            SwalCustom.messageDialog("", "Data de aniversário obrigatória");
            return false;
        }

        elementProperty.getElement("#documentCard", element => {
            document.getElementById("docNumber").value = element.value.replace(/\D/g, '');
        });

        

        preload(true);
        const dateMonthYear = document.querySelector("#dateMonthYear").value.split("/");

        paymentCard.createToken({
                cardNumber: document.querySelector('#cardNumber').value.split(' ').join(''),
                cardholderName: document.querySelector('#cardholderName').value,
                cardExpirationMonth: dateMonthYear[0],
                cardExpirationYear: `${2000 + parseInt(dateMonthYear[1])}`,
                securityCode: document.querySelector('#securityCode').value,
                identificationType: 'CPF',
                identificationNumber: document.querySelector('#documentCard').value.replace(/\D/g, ""),
            }
            , sdkResponseHandler);
        return false;
    });

    function existCard(number) {
        return Session.get("cards").filter(card => {
            return card.number === number;
        }).length > 0;
    }

    function validateDate() {
        const dueDate = document.getElementById("dateMonthYear").value.split("/");

        const year = parseInt(new Date().getFullYear() / 100);

        if (!dueDate[0] && !dueDate[1])
            return false;

        if (dueDate[0].length !== 2 && dueDate[1].length !== 2)
            return false;

        document.getElementById("cardExpirationMonth").value = dueDate[0];
        document.getElementById("cardExpirationYear").value = year + "" + dueDate[1];
        

        return true;
    }

    function replaceDateBirth () {
        const date = document.getElementById('dateOfBirth').value.split('/')
        const final = date[2] + '-' + date[1] + '-' + date[0]
        return final;
    }

    function sdkResponseHandler(response) {
        if (!response) {
            preload(false);
            errorAddCreditCard(response);
            return;
        }

        const card = {
            "cardNumber": document.getElementById("cardNumber").value,
            "cvv": document.getElementById("securityCode").value,
            "expirationMonth": document.getElementById("cardExpirationMonth").value,
            "expirationYear": document.getElementById("cardExpirationYear").value,
            "cardholderName": document.getElementById("cardholderName").value,
            "docNumber": document.getElementById("docNumber").value,
            "mpToken": !mercadoPago ? null : response.id,
            "firstSixDigits": response.first_six_digits,
            "paymentMethodName": Mask.detectCardType(document.getElementById("cardNumber")
                .value.split(" ").join("")),
            "securityCodeLength": response.security_code_length,
            "lastFourDigits": response.last_four_digits,
            "dateOfBirth": replaceDateBirth()
        };

        if (ConfigGeneral().get("disable_mercado_pago_app") == true) {
            card.firstSixDigits = card.cardNumber.split(" ").join("").substr(0, 6);
            card.securityCodeLength = card.cvv.length;
            card.lastFourDigits = card.cardNumber.substr(-4);
        }

        customerCardController.insert(card).then(({status, data}) => {
            preload(false);
            if (!status) {
                SwalCustom.messageDialog("", getTextTranslate("card", "error_add_card"), undefined, "warning");
                return;
            }
            SwalCustom.messageDialog("", getTextTranslate("card", "success_add_card"), function () {
                if (typeof getCards === "function")
                    getCards();

                if (addCardManager.callback !== undefined)
                    addCardManager.callback();

                getCardsClient();

                Route.backPage();
                //elementProperty.removeClass(".container-add-card", "active");
                clearForm();
            }, "success");
        });
    }

    function clearForm() {
        document.getElementById("cardNumber").value = "";
        document.getElementById("securityCode").value = "";
        document.getElementById("docNumber").value = "";
        document.getElementById("cardholderName").value = "";
        document.getElementById("documentCard").value = "";
        document.getElementById("dateMonthYear").value = "";
        document.getElementById("dateOfBirth").value = "";
        paymentCard.updateToken();
    }

    function errorAddCreditCard(error) {
        error.cause.map(cause => {
            if (cause.code === "E301") {
                SwalCustom.messageDialog("",
                    getTextTranslate("card", "invalid_card"), undefined,
                    "warning");
                return;
            }
            if (cause.code === "325" || cause.code === "326") {
                SwalCustom.messageDialog("",
                    getTextTranslate("card", "invalid_expiration_date"), undefined,
                    "warning");
                return;
            }
            if (cause.code === "E302") {
                SwalCustom.messageDialog("", getTextTranslate("card", "invalid_cvv"));
            }
        })
    }

    function getCardsClient() {
        customerCardController.get().then(({status, data}) => {
            if (!status)
                return;

            Session.set("cards", data);
        });
    }

});
