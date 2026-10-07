document.addEventListener("DOMContentLoaded", function () {

    const mapService = new MapService();
    const elementProperty = new ElementProperty();

    mapService.importScriptWithPlaces().then(() => {
        navigator.geolocation.getCurrentPosition(({coords: {latitude: lat, longitude: lng}}) => {
            mapService.initMap({lat, lng}, 17, document.querySelector("#map")).then(() => {
                updateInfoLocal(lat, lng);
                const marker = mapService.createMaker({lat, lng});
                google.maps.event.addListener(mapService.map, 'center_changed', function () {
                    const position = mapService.map.getCenter();
                    marker.setPosition({lat: position.lat(), lng: position.lng()});
                    updateInfoLocal(position.lat(), position.lng());
                });
            });
        });
    });

    function updateInfoLocal(lat, lng) {
        document.querySelector("#latitudeLocal").value = lat;
        document.querySelector("#longitudeLocal").value = lng;
    }

    elementProperty.addEventInElement(".update-local", "onchange", function () {
        const lat = parseFloat(document.querySelector("#latitudeLocal").value);
        const lng = parseFloat(document.querySelector("#longitudeLocal").value);

        if(mapService.map == null){
            return alert("Certifique-se que a permissão de localização foi concedida");
        }

        mapService.map.setCenter({lat, lng});
    });

    elementProperty.addEventInElement("#btnSaveAddress", "onclick", function () {
        const address = document.querySelector("#nameLocal").value;

        if (address.length === 0)
            return alert("Informe o nome do endereço");

        const position = mapService.map.getCenter();

        const latitude = position.lat();
        const longitude = position.lng();

        $('#addAddressModal').modal('hide');

        preload(true);
        AddressController.insert(address, latitude, longitude).then(({status, message, response}) => {
            SwalCustom.messageDialog(!status ? response.join(""): "", message, status ? "success" : "info").then(() => {
                listAddress();
            });
        }).finally(() => {
            preload(false);
        });
    });

    elementProperty.addEventInElement("#btnAddressSearch", "onclick", function () {
        const addressSearch = document.querySelector("#textSearch").value;

        if(addressSearch === ''){
            return SwalCustom.messageDialog('', 'Digite o nome de um dos endereços salvos', 'info');
        }

        listAddress(document.querySelector("#textSearch").value);
    });

    
    function listAddress(address = '', page = 1) {
        preload(true);
        AddressController.getList(address, page).then(({response}) => {
            document.querySelector("#listAddress").innerHTML = response.data.map(item => {
                return `
                <tr>
                    <td>${item.address}</td>
                    <td><a href="http://maps.google.com/?q=${item.latitude},${item.longitude}" target="_blank">Ver posição</a></td>
                    <td><button class="btn btn-danger btn-sm btn-remove-address" item='${JSON.stringify(item)}'>Excluir</button></td>
                </tr>
            `
            }).join("");

            function eventPaginate(pageEvent, componentId, callback) {
                if (pageEvent == null) {
                    document.querySelector(componentId).parentNode.classList.add("disabled");
                    document.querySelector(componentId).parentNode.onclick = () => {};
                } else {
                    document.querySelector(componentId).parentNode.classList.remove("disabled");
                    document.querySelector(componentId).parentNode.onclick = callback;
                }
            }

            eventPaginate(response.prev_page_url, "#btnPrevious", () => listAddress(address, page - 1));
            eventPaginate(response.next_page_url, "#btnNext", () => listAddress(address, page + 1));


            elementProperty.addEventInElement(".btn-remove-address", "onclick", function () {
                const item = JSON.parse(this.getAttribute("item"));
                SwalCustom.confirm("Deseja remover o endereço?").then(() => {
                    preload(true);
                    AddressController.remove(item.id).then(({status, message}) => {
                        SwalCustom.messageDialog("", message, status ? "success" : "info").then(() => {
                            listAddress(address,page);
                        });
                    }).finally(() => preload(false))
                })
            });

        }).catch(
            () => preload(false)
        ).finally(() => preload(false));
    }
    listAddress()
});