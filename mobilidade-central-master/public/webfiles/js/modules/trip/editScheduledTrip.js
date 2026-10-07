const EditScheduledTrip = (() => {
    const state = {
        tripReference: null,
        tripTypeId: null,
        origin: null,
        destination: null,
        waypoints: [],
        activeField: null,
        needsRecalculation: false,
        scheduledBatchId: null,
    };

    function open(trip) {
        state.tripReference = trip.tripReference;
        state.tripTypeId = trip.tripTypeId;
        state.scheduledBatchId = trip.scheduledBatchId || null;

        viewController.elementProperty.getElement('#editScheduledGroupField', (field) => {
            field.style.display = state.scheduledBatchId ? '' : 'none'
        });

        viewController.elementProperty.getElement('#editScheduledApplyGroup', (checkbox) => {
            checkbox.checked = false
        });

        state.origin = {
            address: trip.origin?.address || trip.origin?.name || '',
            latitude: parseFloat(trip.origin?.latitude),
            longitude: parseFloat(trip.origin?.longitude),
            neighborhood: trip.origin?.neighborhood || null,
        };

        state.destination = {
            address: trip.destination?.address || trip.destination?.name || '',
            latitude: parseFloat(trip.destination?.latitude),
            longitude: parseFloat(trip.destination?.longitude),
            neighborhood: trip.destination?.neighborhood || null,
        };

        state.waypoints = (trip.tripWayPoints || []).map(waypoint => ({
            address: waypoint.address || '',
            latitude: parseFloat(waypoint.latitude),
            longitude: parseFloat(waypoint.longitude),
            neighborhood: waypoint.neighborhood || null,
        }));

        document.getElementById('editScheduledOrigin').value = state.origin.address;
        document.getElementById('editScheduledDestination').value = state.destination.address;
        document.getElementById('editScheduledPrice').value = Mask.maskMoney(parseFloat(trip.price) || 0);

        document.getElementById('editScheduledDate').value = trip?.schedule?.schedule
            ? moment(trip.schedule.schedule).format('YYYY-MM-DDTHH:mm')
            : '';

        renderWaypoints();
        setNeedsRecalculation(false);

        viewController.elementProperty.addClass('.modal-edit-scheduled-trip', 'active');
    }

    function close() {
        viewController.elementProperty.removeClass('.modal-edit-scheduled-trip', 'active');
        closeSearch();
    }

    function closeIfRemoved(tripReference) {
        if (state.tripReference !== tripReference) return;
        close();
    }

    function closeIfNotEditableAmong(trips) {
        if (!state.tripReference) return;

        const current = (trips || []).find((trip) => trip.tripReference === state.tripReference);

        if (!current) close();
    }

    function setNeedsRecalculation(value) {
        state.needsRecalculation = value;

        viewController.elementProperty.getElement('#btnSaveEditScheduledTrip', (button) => {
            button.disabled = value;
            button.classList.toggle('disabled', value);
        });

        viewController.elementProperty.getElement('#btnRecalculateScheduledPrice', (button) => {
            button.setAttribute('aria-disabled', String(!value));
        });

        viewController.elementProperty[value ? 'addClass' : 'removeClass']('#editScheduledRecalcHint', 'active');
    }

    function escapeHtml(value) {
        return (value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function renderWaypoints() {
        viewController.elementProperty.getElement('#editScheduledWaypoints', (container) => {
            container.innerHTML = state.waypoints.map((waypoint, index) => `
                <div class="edit-scheduled-waypoint-item">
                    <span class="edit-scheduled-waypoint-badge">${index + 1}</span>
                    <div class="edit-scheduled-waypoint-row">
                        <input type="text" class="edit-scheduled-waypoint-input" data-waypoint-index="${index}" readonly autocomplete="off" placeholder="Endereço da parada" value="${escapeHtml(waypoint.address)}">
                        <i class="material-icons edit-scheduled-remove-waypoint" data-waypoint-index="${index}">close</i>
                    </div>
                </div>
            `).join('');

            viewController.elementProperty.addEventInElement('.edit-scheduled-waypoint-input', 'onclick', function () {
                openSearch(parseInt(this.getAttribute('data-waypoint-index'), 10));
            });

            viewController.elementProperty.addEventInElement('.edit-scheduled-remove-waypoint', 'onclick', function (event) {
                event.stopPropagation();
                const index = parseInt(this.getAttribute('data-waypoint-index'), 10);
                state.waypoints.splice(index, 1);
                renderWaypoints();
                setNeedsRecalculation(true);
            });
        });
    }

    function addWaypoint() {
        state.waypoints.push({ address: '', latitude: null, longitude: null, neighborhood: null });
        renderWaypoints();
        openSearch(state.waypoints.length - 1);
    }

    function openSearch(field) {
        state.activeField = field;
        document.getElementById('editScheduledSearchResults').innerHTML = '';
        document.querySelector('.edit-scheduled-search-input').value = '';
        viewController.elementProperty.addClass('.edit-scheduled-search-local', 'active');
        setTimeout(() => document.querySelector('.edit-scheduled-search-input').focus(), 200);
    }

    function closeSearch() {
        if (typeof state.activeField === 'number' && !state.waypoints[state.activeField]?.address) {
            state.waypoints.splice(state.activeField, 1);
            renderWaypoints();
        }

        state.activeField = null;
        viewController.elementProperty.removeClass('.edit-scheduled-search-local', 'active');
    }

    function renderResults(places) {
        document.getElementById('editScheduledSearchResults').innerHTML = places.map(place => `
            <li class="local-trip-customer edit-scheduled-place-option" place='${JSON.stringify(place)}'>
                <i class="material-icons">place</i>
                <div>
                    <span>${place.address}</span>
                    <label>${place.neighborhood || ''}</label>
                </div>
            </li>
        `).join('');

        viewController.elementProperty.addEventInElement('.edit-scheduled-place-option', 'onclick', function () {
            selectPlace(JSON.parse(this.getAttribute('place')));
        });
    }

    function selectPlace(place) {
        const applySelection = (detail) => {
            const data = {
                address: detail.address || place.address,
                latitude: parseFloat(detail.latitude),
                longitude: parseFloat(detail.longitude),
                neighborhood: detail.neighborhood || place.neighborhood || null,
            };

            if (state.activeField === 'origin') {
                state.origin = data;
                document.getElementById('editScheduledOrigin').value = data.address;
            } else if (state.activeField === 'destination') {
                state.destination = data;
                document.getElementById('editScheduledDestination').value = data.address;
            } else {
                state.waypoints[state.activeField] = data;
                renderWaypoints();
            }

            setNeedsRecalculation(true);
            closeSearch();
        };

        if (place.latitude && place.longitude) {
            applySelection(place);
            return;
        }

        mapService.getDetailPlace(place.address).then(({ status, data }) => {
            if (!status) return;
            applySelection(data);
        });
    }

    function bindSearchInput() {
        const input = document.querySelector('.edit-scheduled-search-input');
        if (!input) return;

        mapService.addSearchInInput(input, ({ data: places }) => {
            if (!places) {
                document.getElementById('editScheduledSearchResults').innerHTML = '';
                return;
            }
            renderResults(places);
        });
    }

    function recalculatePrice() {
        if (!state.needsRecalculation) return;

        if (!state.origin?.latitude || !state.destination?.latitude) {
            SwalCustom.messageDialog('Selecione origem e destino válidos.', 'Atenção', undefined, 'warning');
            return;
        }

        if (state.waypoints.some((waypoint) => !waypoint?.latitude)) {
            SwalCustom.messageDialog('Selecione um endereço válido para todas as paradas.', 'Atenção', undefined, 'warning');
            return;
        }

        const central = Session.get('centralSelected');
        const onlyCentral = central.showAllPrices != null ? central.showAllPrices == false : false;
        const waypointsForCalc = state.waypoints.map(({ latitude, longitude }) => ({ latitude, longitude }));

        preload(true);

        CentralRepository.calculate(state.origin, state.destination, waypointsForCalc, onlyCentral, 1, central.id)
            .then(({ status, data }) => {
                preload(false);

                if (!status || !data?.prices?.length) {
                    SwalCustom.messageDialog('Não foi possível recalcular o preço.', 'Atenção', undefined, 'warning');
                    return;
                }

                const priceOption = data.prices.find((item) => item.tripTypeId === state.tripTypeId) || data.prices[0];

                document.getElementById('editScheduledPrice').value = Mask.maskMoney(parseFloat(priceOption.price) || 0);
                setNeedsRecalculation(false);
            })
            .catch(() => {
                preload(false);
                SwalCustom.messageDialog('Não foi possível recalcular o preço.', 'Atenção', undefined, 'warning');
            });
    }

    function buildSaveSuccessMessage(response, message) {
        const base = message || 'Viagem atualizada com sucesso';

        if (!response.groupUpdate) return base;

        const { updated = [], failed = [] } = response.groupUpdate;

        if (failed.length === 0) {
            return `${base}\n${updated.length} outra${updated.length === 1 ? '' : 's'} viagem${updated.length === 1 ? '' : 's'} do lote também ${updated.length === 1 ? 'foi atualizada' : 'foram atualizadas'}.`;
        }

        return `${base}\n${updated.length} viagem(ns) do lote atualizada(s), ${failed.length} não pôde(puderam) ser atualizada(s).`;
    }

    function save() {
        if (!state.origin?.latitude || !state.destination?.latitude) {
            SwalCustom.messageDialog('Selecione origem e destino válidos.', 'Atenção', undefined, 'warning');
            return;
        }

        if (state.waypoints.some((waypoint) => !waypoint?.latitude || !waypoint?.address)) {
            SwalCustom.messageDialog('Selecione um endereço válido para todas as paradas.', 'Atenção', undefined, 'warning');
            return;
        }

        if (state.needsRecalculation) {
            SwalCustom.messageDialog('Recalcule o preço antes de salvar.', 'Atenção', undefined, 'warning');
            return;
        }

        const scheduleValue = document.getElementById('editScheduledDate').value;

        if (!scheduleValue) {
            SwalCustom.messageDialog('Informe a data e hora do agendamento.', 'Atenção', undefined, 'warning');
            return;
        }

        const price = Mask.removeMaskMoney(document.getElementById('editScheduledPrice').value);

        if (isNaN(price) || price <= 0) {
            SwalCustom.messageDialog('Informe um valor válido.', 'Atenção', undefined, 'warning');
            return;
        }

        const applyToGroup = state.scheduledBatchId
            && document.getElementById('editScheduledApplyGroup')?.checked;

        const payload = {
            origin: state.origin,
            destination: state.destination,
            waypoints: state.waypoints,
            price,
            schedule: moment(scheduleValue).format('YYYY-MM-DD HH:mm:ss'),
            scheduleUTC: moment(scheduleValue).utc().toISOString(),
            scope: applyToGroup ? 'all' : 'this',
        };

        preload(true);

        TripRepository.updateScheduled(state.tripReference, payload)
            .then(({ status, message, response }) => {
                preload(false);

                if (!status) {
                    SwalCustom.messageDialog(message || 'Ocorreu um erro ao editar a viagem', 'Atenção', undefined, 'warning');
                    return;
                }

                SwalCustom.messageDialog(buildSaveSuccessMessage(response, message), 'Sucesso', undefined, 'success');
                close();

                if (response.groupUpdate) {
                    if (typeof tripListState !== 'undefined' && typeof tripListState.reload === 'function') {
                        tripListState.reload();
                    }
                    return;
                }

                if (typeof tripListState !== 'undefined' && typeof tripListState.updateItem === 'function') {
                    tripListState.updateItem(response);
                }
            })
            .catch(() => {
                preload(false);
                SwalCustom.messageDialog('Ocorreu um erro ao editar a viagem', 'Atenção', undefined, 'warning');
            });
    }

    viewController.elementProperty.addEventInElement('.edit-scheduled-address-input', 'onclick', function () {
        openSearch(this.id === 'editScheduledOrigin' ? 'origin' : 'destination');
    });

    viewController.elementProperty.addEventInElement('#btnAddEditScheduledWaypoint', 'onclick', function (event) {
        event.preventDefault();
        addWaypoint();
    });

    viewController.elementProperty.addEventInElement('#btnRecalculateScheduledPrice', 'onclick', recalculatePrice);

    viewController.elementProperty.addEventInElement('#editScheduledPrice', 'onchange', function () {
        setNeedsRecalculation(false);
    });

    viewController.elementProperty.addEventInElement('.back-edit-scheduled-search', 'onclick', closeSearch);
    viewController.elementProperty.addEventInElement('.close-edit-scheduled-trip', 'onclick', close);
    viewController.elementProperty.addEventInElement('#btnCancelEditScheduledTrip', 'onclick', close);
    viewController.elementProperty.addEventInElement('#btnSaveEditScheduledTrip', 'onclick', save);

    Mask.setMoneyField('#editScheduledPrice');

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindSearchInput);
    } else {
        bindSearchInput();
    }

    return { open, closeIfRemoved, closeIfNotEditableAmong };
})();
