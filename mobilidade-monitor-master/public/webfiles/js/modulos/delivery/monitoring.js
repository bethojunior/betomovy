const city = Session.getLocal("citySelected");
const cityId = city.cityId;

const map = new MapService();

let markers = [];

let timeOutOrders = null;

preload(true);
map.importScriptWithPlaces().then(() => {

    map.initMap({lat: 0, lng: 0}, 14, document.querySelector('.content-map'));
    clearTimeout(timeOutOrders);
    setInterval(() => {
        map.setBoundsInMap(Session.getLocal("pointsCity"));

        getDrivers();

        preload(false);
    }, 10000);
});

elementProperty.addEventInElement('.order-label', 'onclick', function () {
    clearTimeout(timeOutOrders);
    if(document.querySelector('#orderActives').classList.contains('active')){
        return document.querySelector('#orderActives').classList.remove('active');
    }
    document.querySelector('#orderActives').classList.add('active');
    preload(true);
    showOrdersActives();
});

function getDrivers() {
    DeliveryMonitoring.getDrivers().then(({response}) => {
        markers.map(item=>{
            item.setMap(null);
        });

        markers = response.map(item => {
            return map.createMarker(
        {
                    lat: parseFloat(item.latitude),
                    lng: parseFloat(item.longitude)
                },
            {
                url: item.iconMapDriver,
                scaledSize: new google.maps.Size(25, 35),
                });
        });
    });
}

function showOrdersActives() {
    DeliveryMonitoring.getOrderActive(cityId).then(({response}) => {
        document.querySelector('.order-container').innerHTML = response.map(item => {
            return `
                <div class="order-actives-card">
                     <div class="d-flex">
                        <div class="image-company" style="background-image: url('${item.company.company_delivery_config.picture}')"></div>
                        <div class="d-flex flex-column order-details">
                            <label>${item.company.fantasyName}</label>
                            <label class="status-order-label">#${item.id} ${item.delivery_order_status.label}</label>
                            <a class="btn-show-more-details" value='${btoa(JSON.stringify(item))}' href="#" id="${item.id}" data-target="#moreDetailModal" data-toggle="modal">Ver mais</a>
                        </div>
                     </div>
                </div>
                <hr/>
            `;
        }).join('');
        preload(false);

        elementProperty.addEventInElement('.btn-show-more-details', 'onclick', function () {
            const item = JSON.parse(atob(this.getAttribute('value')));
            document.querySelector('.image-profile').style.backgroundImage = `url(${item.company.company_delivery_config.picture})`;
            document.querySelector('.fantasyName').innerHTML = item.company.fantasyName;
            document.querySelector('.order-number').innerHTML = `Pedido #${item.id}`;
            document.querySelector('.subtotal-price').innerHTML = `R$ ${Mask.maskMoney(item.deliveryFee != null ? item.value - item.deliveryFee : item.value)}`;
            document.querySelector('.delivery-fee').innerHTML = (item.orderDeliveryTypeId === 1)
                ?  `<div class="d-flex justify-content-between">
                    <span>Taxa de entrega</span>
                    <span>R$ ${Mask.maskMoney(item.deliveryFee) || '0,00'}</span>
                </div>`
                : '';
            document.querySelector('.total-price').innerHTML = `R$ ${Mask.maskMoney(item.value)}`;
            document.querySelector('.payment-type').innerHTML = item.delivery_payment_form.name;
            document.querySelector('.payment-change-value').innerHTML = item.changeValue != null ? `R$ ${Mask.maskMoney(item.changeValue)}` : 'Sem troco';
            document.querySelector('.address-label').innerHTML = item.orderDeliveryTypeId === 1 ? 'Endereço de entrega' : 'Endereço de retirada';
            document.querySelector('.address').innerHTML = item.orderDeliveryTypeId === 1 ? item.delivery_order_place.place.address : item.company_address.address;
            document.querySelector('.list-products-container'). innerHTML = item.delivery_order_items.map(item => {
                return `
                    <div class="d-flex justify-content-between">
                        <div class="d-flex flex-fill">
                            <span class="font-weight-bolder quantity-of-products">${item.quantity}</span>
                            <span class="ml-2 name-of-product">${item.delivery_product.name}</span>
                        </div>
                        <div class="d-flex justify-content-end">
                            <span class="price-of-product d-flex">R$${Mask.maskMoney(item.delivery_product.price)}</span>
                        </div>
                    </div>
                `;
            }).join('');
        });

        timeOutOrders = setTimeout(showOrdersActives, 50000);
    });
}