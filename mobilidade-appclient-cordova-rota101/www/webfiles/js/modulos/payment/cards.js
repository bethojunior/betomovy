Route.waitView().then(() => {
    const elementProperty = new ElementProperty();
    const paymentCard = new PaymentCard();
    let callbackSelectCard = null;

    elementProperty.addEventInElement(".close-cards-modal", "onclick", function () {
        elementProperty.removeClass(".container-cards", "active");
    });

    window.showModalCards = (callback) => {
        if (callback !== undefined)
            callbackSelectCard = callback;

        showCard().then(addEventSelectedCard);
        elementProperty.addClass(".container-cards", "active");
    };

    function addEventSelectedCard() {
        elementProperty.addEventInElement(".cards-list-select", "onclick", function () {
            elementProperty.removeClass(".container-cards", "active");
            if (callbackSelectCard !== null)
                callbackSelectCard(JSON.parse(this.getAttribute("value")));
        })
    }

    function showCard() {
        return new Promise(resolve => {
            elementProperty.getElement("#listCardPaymentModal", element => {
                const cards = Session.get("cards");

                if (cards.length === 0){
                    element.innerHTML = `<li>
                            <img src="webfiles/img/icon/credit-card.png">
                            <p></p>
                        </li>`;
                    return;
                }

                element.innerHTML = cards.map(card => {
                    return `<li class="cards-list-select" value='${JSON.stringify(card)}'>
                                <img src="webfiles/img/icon/${Mask.detectCardType(card.number)}.png">
                                <p>${card.number.substr(-4)}</p>
                        </li>`;
                }).join("");

                resolve();
            });
        })
    }

    elementProperty.addEventInElement("#addCardModal", "onclick", function () {
        if (Session.get("cards").length >= 5) {
            SwalCustom.messageDialog("", "Você só pode ter no maximo 5 cartões adicionados.", undefined, "info");
            return;
        }
        paymentCard.addCard();
        elementProperty.addClass(".container-add-card", "active");

        setTimeout(function () {
            addCardManager.callback = addCard;
        }, 5000)
    });


    function addCard() {
        setTimeout(function(){
            showModalCards(callbackSelectCard)
        },1000);
    }
});