viewController.setObserver("filter-extract", function (flow) {

    const userLogged = Session.get("user");
    const elementProperty = new ElementProperty();
    const balanceController = new BalanceController();

    const managerLastRequest = {
        request: null
    };

    elementProperty.getElement("#btnExtractFilter", element => {
        element.disabled = false;
    });

    elementProperty.addEventInElement(".item-extract", "onclick", function () {
        const upUntil = parseInt(this.getAttribute("value"));

        elementProperty.getElement("#dateUpUntil", element => {
            element.value = DateCustom.getDate()
        });

        elementProperty.getElement("#inDate", element => {
            element.value = DateCustom.getDateLessDays(upUntil)
        });
    });

    elementProperty.addEventInElement("#btnExtractFilter", "onclick", function () {
        const dateInterval = {
            date_start: null,
            date_end: null
        };

        elementProperty.getElement("#dateUpUntil", element => {
            dateInterval.date_end = element.value;
        });

        elementProperty.getElement("#inDate", element => {
            dateInterval.date_start = element.value;
        });

        const validate = DateCustom.compareDateStartAndDateEnd(dateInterval.date_start, dateInterval.date_end);

        if (!validate.status) {
            SwalCustom.messageDialog(validate.message, "Atenção", () => {
            }, "info");
            return;
        }

        if (DateCustom.compareAmountDays(dateInterval.date_start, dateInterval.date_end) > 90) {
            SwalCustom.messageDialog("Data informada deve ser até 90 dias", "Atenção", () => {
            }, "info");
            return;
        }

        this.disabled = true;

        const dataRequest = balanceController.driverTransactions(userLogged.idDriver, dateInterval, 1, flow)

        managerLastRequest.request = dataRequest.request;

        dataRequest.promise.then(({status, data}) => {
            this.disabled = false;

            if (!status)
                return;

            clearDate();

            viewController.addParams("extract-financial", {...data, dateInterval, userLogged, flow});

            Route.redirectDynamic("Financial", "ExtractFinancial");
        }).finally(() => {
            this.disabled = false;
        });

    });

    viewController.onBack(() => {
        if (managerLastRequest.request != null) {
            managerLastRequest.request.abort();
        }
    });

    function clearDate() {
        elementProperty.getElement("#dateUpUntil", element => {
            element.value = '';
        });

        elementProperty.getElement("#inDate", element => {
            element.value = '';
        });
    }

    Route.pageDynamic();
});