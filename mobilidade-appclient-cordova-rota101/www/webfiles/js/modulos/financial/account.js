viewController.setObserver("account", function () {

    const CONTACT_SUPPORT = Session.get("cityConfig").supportContactNumber;

    const userLogged = Session.get("user");
    const balanceController = new  BalanceController();

    const elementProperty = new ElementProperty();

    updateListTransaction();

    viewController.onResume(()=>{
        updateListTransaction();
    });

    function updateListTransaction(){
        PartnerBalanceController.lastTransactions(userLogged.idCustomer)
            .then(({data, status}) => {
                if (!status)
                    return;

                elementProperty.getElement(".type", element => {
                    element.innerHTML = CityConfig.getTypeCoin();
                });

                elementProperty.getElement("#balanceDriver", element => {
                    element.innerHTML = Mask.maskMoney(parseFloat(data.balance.balance));
                });

                Session.set("balanceCustomer", data.balance);

                elementProperty.getElement("#listLastTransactions", element => {

                    element.innerHTML = '';

                    data.transactions.map(transaction => {

                        element.innerHTML +=
                            `<li>
                    <div class="cicler-customer v${transaction.balanceFlowTypeId}" 
                    classCustomer="${transaction.balanceFlowTypeId}"
                        color="${transaction.color}"></div>
                    <div class="container-info-transition">
                        <div class="time-transition">${transaction.date}</div>
                        <div class="description-transition">${transaction.summary}</div>
                        <div class="value-transition">${Mask.maskMoney(parseFloat(transaction.value))}</div>
                    </div>
                </li>`;
                    })

                    elementProperty.getElement(".cicler-customer",elementCss=>{
                        document.styleSheets[0].addRule(
                            `.body-account > ul > li > .cicler-customer.v${elementCss.getAttribute("classCustomer")}:before`,
                            `background-color: ${elementCss.getAttribute("color")}`);
                    })

                })

            });
    }

    elementProperty.addEventInElement(".back-to", "onclick", function () {
        Route.backPage();
    });

    elementProperty.addEventInElement(".close-modal-info-extract","onclick",function(){
        elementProperty.removeClass(".container-modal-info-extract","active")
    });

    elementProperty.addEventInElement("#openInfoExtract","onclick",function(){
        elementProperty.addClass(".container-modal-info-extract","active")
    });

    elementProperty.addEventInElement("#filterExtract","onclick",function(){
        viewController.addParams("filter-extract",undefined);
        Route.redirectDynamic("Financial","FilterExtract");

    });

    elementProperty.addEventInElement("#filterBy","onclick",function(){
        viewController.addParams("filter-extract",undefined);
        Route.redirectDynamic("Financial","Filter")
    });
    elementProperty.addEventInElement("#btnTransference","onclick",function(){
        Route.redirectDynamic("Financial","Transference")
    });
    elementProperty.addEventInElement("#btnPayment","onclick",function(){
        SwalCustom.messageDialog("","Em breve!",undefined,"info");
    });

    elementProperty.getElement("#listTypesBalance",element=>{
        balanceController.getTypes().then(({status,data,message})=>{
            if(!status){
                SwalCustom.messageDialog("",message,undefined,"warning");
                return;
            }

            element.innerHTML = data.map(type=>{
                return ` <li><div><div style="background-color: ${type.color}"></div></div>
                            <span>${type.short_description}</span></li>`;
            }).join("");
        });
    });

    elementProperty.getElement("#contactSupport",element=>{
        element.innerHTML = CONTACT_SUPPORT;
    });

    Route.pageDynamic();
});
