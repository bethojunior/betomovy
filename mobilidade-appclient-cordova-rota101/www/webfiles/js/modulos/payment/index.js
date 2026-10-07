viewController.setObserver("payment", function () {
    const elementProperty = new ElementProperty();
    const paymentCard = new PaymentCard();
    const customerCardController = new CustomerCardController();
    const customerController = new CustomerController();
    const userLogged = Session.get("user");
    showCards(Session.get("cards"));
    showBalance(Session.get("currentBalanceClient"));

    elementProperty.addEventInElement("#addPaymentFormIndex", "onclick", function () {
        /*SwalCustom.messageDialog("","Atenção em breve será liberado essa opção",undefined,"info");
        return;*/
        if(Session.get("cards").length >= 5){
            SwalCustom.messageDialog("","Você só pode ter no maximo 5 cartões adicionados.",undefined,"info");
            return;
        }
        paymentCard.addCard();
        elementProperty.addClass(".container-add-card", "active");
    });


    window.getCards = function() {
        customerCardController.get().then(({status, data}) => {
            if(!status)
                return;

            Session.set("cards",data);

            updateCardSelected();

            showCards(data);
        });
    };

    function showCards(cards){
        elementProperty.getElement("#listCardPaymentIndex", element => {

            element.innerHTML = cards.map(card => {
                return `<li class="cards-credit-client" value='${JSON.stringify(card)}'>
                                <img src="webfiles/img/icon/${Mask.detectCardType(card.number)}.png">
                                <span>**** ${card.number.substr(-4)}</span>
                        </li>`;
            }).join("");

            elementProperty.addEventInElement(".cards-credit-client","onclick",function(){
                Session.set("detailCard", JSON.parse(this.getAttribute("value")));
                Route.redirectDynamic("Payment","DetailCard")
            })
        })
    }

    function showBalance(balance){
        if(Array.isArray(balance))
            return;

        elementProperty.getElement("#balanceClient", element => {
            element.innerHTML = `${CityConfig.getTypeCoin()}${Mask.maskMoney(parseFloat(balance))}`;
        });
    }

    window.updateBalance = ()=> {
        customerController.find(userLogged.idUser).then(({message, status, data}) => {
            if (!status) {
                updateBalance();
                return;
            }

            Session.set("currentBalanceClient",data.tripBalance);
            showBalance(data.tripBalance);
        }).catch(updateBalance);
    };

    elementProperty.addEventInElement("#btnViewBuyVoucher","onclick",function(){
        /*SwalCustom.messageDialog("","Atenção em breve será liberado essa opção",undefined,"info");
        return;*/
        Route.redirectDynamic("Payment","BuyVoucher")
    });

    elementProperty.addEventInElement(".list-option-pay-voucher","onclick",function(){
        SwalCustom.messageDialog("","Atenção em breve será liberado essa opção",undefined,"info");
        return;
    });

    elementProperty.addEventInElement(".go-back","onclick",function(){
        Route.backPage();
    });


    getCards();
    updateBalance();
});
