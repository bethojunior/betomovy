const elementProperty = new ElementProperty();
let mapDraw = null;  // MapboxDraw instance

const cityConfig = JSON.parse(localStorage.getItem('cityConfig'));
const idCentral = Session.getValueInSession('centralSelected', 'id');

let mapResult = {
    origin: null,
    destiny: null,
};

Mask.setMoneyField('#price');

const mapService = new MapService();
const mapServiceEdit = new MapService();

listAllNeighborhood();
listTypeTrip();

mapService.importScriptWithPlaces().then(() => {
    const lat = cityConfig?.latitude ? parseFloat(cityConfig.latitude) : 0;
    const lng = cityConfig?.longitude ? parseFloat(cityConfig.longitude) : 0;

    mapService.initMap('map', { lat, lng });

    mapService.map.once('load', () => {
        mapDraw = new MapboxDraw({
            displayControlsDefault: false,
            controls: { polygon: true, trash: true },
            defaultMode: 'draw_polygon',
        });
        mapService.map.addControl(mapDraw);

        // Polígono desenhado pelo usuário
        mapService.map.on('draw.create', (e) => {
            // Mantém apenas o último polígono desenhado
            const all = mapDraw.getAll();
            if (all.features.length > 1) {
                const toDelete = all.features.slice(0, -1).map(f => f.id);
                mapDraw.delete(toDelete);
            }
        });
    });
});

// ─── Helpers para coordenadas do polígono ───────────────────────────────────

function setDrawPolygon(latLngArray) {
    if (!mapDraw) return;
    mapDraw.deleteAll();
    const coords = latLngArray.map(p => [p.lng, p.lat]);
    // Fechar o polígono se necessário
    if (coords.length && (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])) {
        coords.push(coords[0]);
    }
    mapDraw.add({
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [coords] },
    });
    mapDraw.changeMode('simple_select');
}

function getAreaPolygon() {
    if (!mapDraw) return [];
    const all = mapDraw.getAll();
    if (!all.features.length) return [];
    const coords = all.features[0].geometry.coordinates[0];
    // Remove o ponto de fechamento duplicado
    const filtered = coords.filter((c, i) => {
        if (i === coords.length - 1) {
            const first = coords[0];
            return c[0] !== first[0] || c[1] !== first[1];
        }
        return true;
    });
    return filtered.map(c => ({ lat: c[1], lng: c[0] }));
}

// ─── Listagens ───────────────────────────────────────────────────────────────

function listTypeTrip() {
    NeighborhoodController.listTypeTrip().then((result) => {
        document.querySelector('#tripTypes').innerHTML = result.response.map((item) =>
            `<option value='${item.idTripType}'>${item.type}</option>`
        ).join('');
    });
}

function listAllNeighborhood() {
    preload(true);
    NeighborhoodController.listAllNeighborhood(idCentral).then((response) => {
        document.querySelector('#resultTable').innerHTML = response.response.map((item) => `
            <tr>
                <td></td>
                <td>${item.originName}</td>
                <td>${item.destinyName}</td>
                <td>${cityConfig?.typeMoney} ${Mask.maskMoney(item.price)}</td>
                <td>${item.city}</td>
                <td>${item.tripType}</td>
                <td>
                    <div>
                        <button class="btn btn-primary" id="toggle-status" value='${JSON.stringify(item)}'>${item.active ? 'Desativar' : 'Ativar'}</button>
                    </div>
                </td>
                <td><button class="btn btn-link delete-neighborhood" value="${item.id}">EXCLUIR</button></td>
            </tr>
        `).join('');

        elementProperty.addEventInElement('#toggle-status', 'onclick', function (el) {
            let value = JSON.parse(el.target.value);
            SwalCustom.dialogConfirm(`Deseja realmente ${value.active ? 'Desativar' : 'Ativar'}?`).then(() => {
                const payload = {
                    origin: { area: value.origin, name: value.originName },
                    destiny: { area: value.destiny, name: value.destinyName },
                    price: value.price,
                    active: !value.active,
                    cityId: value.cityId,
                    idCentral: value.idCentral,
                };
                preload(true);
                NeighborhoodController.updateNeighborhood(value.id, payload)
                    .then((result) => {
                        if (!result.status) return SwalCustom.messageDialog('', 'Erro ao atualizar', 'info');
                        listAllNeighborhood();
                    })
                    .finally(() => preload(false));
            });
        });

        elementProperty.addEventInElement('.delete-neighborhood', 'onclick', function (el) {
            const id = el.target.value;
            SwalCustom.dialogConfirm('Deseja realmente apagar?').then(() => {
                preload(true);
                NeighborhoodController.deleteNeighborhood(id)
                    .then((result) => {
                        if (!result.status) return SwalCustom.messageDialog('', 'Erro ao remover', 'info');
                        listAllNeighborhood();
                    })
                    .finally(() => preload(false));
            });
        });
    }).finally(() => preload(false));
}

// ─── Ativar/desativar bairro para bairro ────────────────────────────────────

neighborhoodRidesStatus();

function neighborhoodRidesStatus() {
    const val = localStorage.getItem('neighborhoodRidesStatus');
    const el = document.getElementById('activeNeighborhoodRide');
    el.innerHTML = (!val || val === '0') ? 'Ativar bairro para bairro' : 'Desativar bairro para bairro';
}

elementProperty.addEventInElement('#activeNeighborhoodRide', 'onclick', function () {
    const val = localStorage.getItem('neighborhoodRidesStatus');
    const el = document.getElementById('activeNeighborhoodRide');
    if (!val || val === '0') {
        localStorage.setItem('neighborhoodRidesStatus', '1');
        el.innerHTML = 'Desativar bairro para bairro';
    } else {
        localStorage.setItem('neighborhoodRidesStatus', '0');
        el.innerHTML = 'Ativar bairro para bairro';
    }
});

// ─── Busca por bairro (Nominatim) ────────────────────────────────────────────

elementProperty.addEventInElement('#btnSearchLocal', 'onclick', function () {
    const searchValue = document.querySelector('#nameZone').value;
    if (searchValue.trim().length === 0) {
        SwalCustom.messageDialog('', 'Insira algum bairro', 'info');
        return;
    }

    const host = `https://nominatim.openstreetmap.org/search.php?q=${searchValue} fortaleza&polygon_geojson=1&format=jsonv2`;

    preload(true);
    fetch(host)
        .then(r => r.json())
        .then((result) => {
            preload(false);
            const polygons = result.filter(item => item.geojson.type === 'Polygon');

            document.querySelector('#contentMap').hidden = false;
            document.querySelector('#listGroupAddress').innerHTML = polygons.map(item =>
                `<li class="list-group-item item-address" style="cursor:pointer"
                    value='${btoa(JSON.stringify(item))}'><small>${item.display_name.substring(0, 50)}</small></li>`
            ).join('');

            elementProperty.addEventInElement('.item-address', 'onclick', function () {
                elementProperty.removeClass('.item-address', 'active');
                this.classList.add('active');
                const item = JSON.parse(atob(this.getAttribute('value')));

                const bounds = item.geojson.coordinates[0].map(position => ({
                    lat: position[1],
                    lng: position[0],
                }));

                setDrawPolygon(bounds);
                mapService.setBoundsArray(bounds);
            });
        });
});

// ─── Salvar localização ──────────────────────────────────────────────────────

function mountLocationList(elementId, name, onDelete) {
    document.getElementById(elementId).innerHTML = name;
    elementProperty.addEventInElement(`#${elementId}-btn`, 'onclick', function () {
        document.querySelector(`.${elementId}-container`).hidden = true;
        onDelete?.();
    });
}

elementProperty.addEventInElement('#save-location', 'onclick', function () {
    const area = getAreaPolygon();
    if (area.length === 0) {
        SwalCustom.messageDialog('', 'Nenhuma área selecionada', 'info');
        return;
    }

    const data = {
        name: document.querySelector('#nameZone').value,
        area,
    };

    if (data.name.length <= 0) return alert('Informe o nome da zona');

    document.querySelector('#contentMap').hidden = true;

    if (!mapResult.origin) {
        mapResult.origin = data;
        mountLocationList('origin-data', 'Origem: ' + data.name, () => (mapResult.origin = null));
        document.querySelector('.origin-data-container').hidden = false;
        if (mapDraw) mapDraw.deleteAll();
        document.querySelector('#nameZone').value = '';
        return;
    }

    if (!mapResult.destiny) {
        mapResult.destiny = data;
        mountLocationList('destiny-data', 'Destino: ' + data.name, () => (mapResult.destiny = null));
        document.querySelector('.destiny-data-container').hidden = false;
    }

    document.querySelector('#nameZone').value = '';
    if (mapDraw) mapDraw.deleteAll();
});

// ─── Adicionar zona ──────────────────────────────────────────────────────────

elementProperty.addEventInElement('#btnAddZone', 'onclick', function () {
    if (!mapResult.origin || !mapResult.destiny) {
        return SwalCustom.messageDialog('', 'Selecione origem e destino', 'info');
    }
    const price = document.getElementById('price').value;
    if (!price || parseFloat(price) === 0) {
        return SwalCustom.messageDialog('', 'Insira um valor', 'info');
    }

    const active = document.getElementById('toggle').checked;
    const tripTypeId = document.getElementById('tripTypes').value;

    const payload = {
        origin: mapResult.origin,
        destiny: mapResult.destiny,
        price: parseFloat(price),
        active,
        cityId: cityConfig.cityId,
        idCentral: idCentral,
        tripTypeId,
    };

    preload(true);
    NeighborhoodController.insertNeighborhood(payload)
        .then((result) => {
            if (!result.status) return SwalCustom.messageDialog('', 'Erro ao inserir bairros', 'info');
            $('#AddValueByNeighborhood').modal('hide');
            mapResult = { origin: null, destiny: null };
            document.querySelector('.origin-data-container').hidden = true;
            document.querySelector('.destiny-data-container').hidden = true;
            document.getElementById('price').value = 0;
            listAllNeighborhood();
        })
        .finally(() => preload(false));
});
