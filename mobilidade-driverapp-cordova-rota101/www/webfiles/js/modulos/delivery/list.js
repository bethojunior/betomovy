viewController.setObserver("deliveries", function (){
    showList();

    viewController.elementProperty.addEventInElement(".go-back","onclick",function(){
        Route.backPage();
    })

    function getDateFormat(date){
        date = date.split(" ").join("T") + ".000Z";
        return new Date(date).toLocaleString();
    }

    function showList(page = 1) {
        viewController.elementProperty.addClass(".preload-list-delivery","active");
        DeliveryOrderController.findByDriver(page).then(({response}) => {
            viewController.elementProperty.removeClass(".preload-list-delivery","active");
            document.querySelector("#listDelivery").innerHTML = response.data.map(item => {
                return `<li value='${btoa(JSON.stringify(item))}' class="item-order-driver-detail">
                        <div class="profile-establishment-delivery" style="background-image: url(${item.company.company_delivery_config.picture})"></div>
                        <div class="content-info-delivery">
                            <p>#${item.id} - ${item.company.fantasyName}</p>
                            <p>${CityConfig.getTypeCoin()} ${Mask.maskMoney(item.deliveryFee || 0)}</p>
                            <p>${getDateFormat(item.startDeliveryTime)}</p>
                        </div>
                        <span class="material-icons">navigate_next</span>
                    </li>`;
            }).join("");

            if (response.next_page_url)
                document.querySelector("#listDelivery").innerHTML += `<li class="btn-more-list-delivery">Mostrar mais</li>`;

            viewController.elementProperty.addEventInElement(".btn-more-list-delivery","onclick",function(){
                this.remove();
                showList(page + 1);
            });

            viewController.elementProperty.addEventInElement(".item-order-driver-detail", "onclick", function(){
                const order = JSON.parse(atob(this.getAttribute("value")));

                document.querySelector(".profile-company-detail")
                    .style.backgroundImage = `url(${order.company.company_delivery_config.picture})`;
                document.querySelector(".name-company-detail").innerHTML = order.company.fantasyName;
                document.querySelector("#labelOrderCode").innerHTML = `Pedido #${order.id}`;
                document.querySelector("#labelNamePaymentFormDeliveryDetail").innerHTML = order.delivery_payment_form.name;
                document.querySelector("#labelNameAddressDeliveryDetail").innerHTML = order.delivery_order_place.place.address;
                document.querySelector("#listItemsOrderDetail").innerHTML = order.delivery_order_items.map(item=>{
                    return `<li>
                                <span>${item.quantity} - ${item.delivery_product.name}</span>
                                <span>&nbsp;</span>
                            </li>`;
                }).join("");

                Route.startClassesInComponent([
                    {class: "active", component:".delivery-detail-modal"}
                ], ()=>{
                    viewController.elementProperty.removeClass(".delivery-detail-modal", "active");
                })
            });
        })
    }
})