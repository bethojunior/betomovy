Route.waitView().then(() => {
    setTimeout(() => {
        const cityId = Session.get("cityConfig").cityId
        PrepaidController.getAll(cityId).then((result) => {
            document.querySelector("#listPrepaid").innerHTML = result.data.map(item => {
                return `<a class="carousel-item open-prepaid-payment" value='${JSON.stringify(item)}'>
                    <div class="item-carousel-prepaid">
                        <div class="header-item-carousel-prepaid">
                            ${item.stripe}
                        </div>
                        <div class="container-amount-prepaid">
                            <h4>${item.title}</h4>
                            <p>${item.superTitle}</p>
                        </div>
                        <div class="footer-prepaid">
                            <h4>APENAS</h4>
                            <p>${CityConfig.getTypeCoin()} ${Mask.maskMoney(parseFloat(item.sellPrice))}</p>
                        </div>
                    </div>
                </a>`
            }).join("");
        });
    }, 2000)


    viewController.elementProperty.addEventInElement("#openPrepaid", "onclick", function () {
        Route.backPage();
        Route.startClassesInComponent([{component: ".container-prepaid", class: "active"}], () => {
            viewController.elementProperty.removeClass(".container-prepaid", "active");
        });
        $('.carousel').carousel();
    });

    viewController.elementProperty.addEventInElement("#btnSelectedPrepaid", "onclick", function () {
        Route.backPage();
        viewController.addParams("prepaid-switch-payment",JSON.parse(document.querySelector(".open-prepaid-payment.active").getAttribute("value")));
        Route.redirectDynamic("Prepaid", "SwitchPayment");
    });

    viewController.elementProperty.addEventInElement("#closePrepaid", "onclick", function () {
        Route.backPage();
    });
});
