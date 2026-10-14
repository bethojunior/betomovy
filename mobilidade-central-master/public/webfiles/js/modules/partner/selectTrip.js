const STATUS_ACTIVE = "1";
const STATUS_BLOCK = "2";
const STATUS_PENDING = "3";

let unsubscribeId = null
let hideScheduledTrips = true
let activeTripsFilters = {}
let scheduleUrgencyIntervalId = null
let currentTripsPage = 1
let hasMoreTrips = true
let isLoadingMoreTrips = false
let scheduledTripsTotal = 0

const SCHEDULE_URGENT_THRESHOLD_MINUTES = 30

function getMinutesUntilScheduleStart(trip) {
    if (!trip?.schedule?.schedule) return null

    return Math.round((new Date(trip.schedule.schedule).getTime() - Date.now()) / 60000)
}

function isScheduleUrgent(trip) {
    if (trip?.status !== STATUS_SCHEDULED) return false

    const minutes = getMinutesUntilScheduleStart(trip)

    return minutes !== null && minutes <= SCHEDULE_URGENT_THRESHOLD_MINUTES
}

function parseTripItemValue(item) {
    try {
        return JSON.parse(item.getAttribute("value"));
    } catch (e) {
        return null;
    }
}

// tripReferences que o próprio operador acabou de cancelar por aqui — usado pra
// não repetir o GET de "foi o motorista que cancelou?" pra elas no evento realtime.
const recentlyCanceledByOperator = new Set();

function markRecentlyCanceledByOperator(tripReference) {
    recentlyCanceledByOperator.add(tripReference);
    setTimeout(() => recentlyCanceledByOperator.delete(tripReference), 30000);
}

const TRIP_LIST_CONFIG = {
    default: {
        key: "default",
        filters: {},
        title: "Viagens Ativas",
        messages: {
            loading: "Carregando viagens...",
            empty: "Nenhuma viagem ativa no momento",
            error: "Erro ao carregar as viagens",
        },
    },
    whatsapp: {
        key: "whatsapp",
        filters: { flow: "whatsapp" },
        title: "Chamados WhatsApp",
        messages: {
            loading: "Carregando chamados...",
            empty: "Nenhum chamado via WhatsApp ativo no momento",
            error: "Erro ao carregar os chamados do WhatsApp",
        },
    },
};

const tripListState = {
    currentConfig: TRIP_LIST_CONFIG.default,
};

function verifyListTripActivePartner() {
    tripListState.currentConfig = TRIP_LIST_CONFIG.default;

    const centralId = Session.getValueInSession("centralSelected", "id")?.toString();
    if (!centralId) {
        console.error("ID da central não encontrado na sessão.");
        setMessage("Não foi possível carregar as viagens. Tente recarregar a página.");
        return;
    }

    const setMessage = (message) => {
        const msgEl = document.getElementById("listTripMessage");
        if (msgEl) msgEl.textContent = message ?? "";
    };

    const setModalHeader = (config) => {
        const headerEl = document.querySelector(".header-trips");
        const titleEl = document.querySelector(".header-trips p");
        const sidebarEl = document.querySelector(".list-trips-active-partner");
        const isWhatsapp = config.key === TRIP_LIST_CONFIG.whatsapp.key;

        if (titleEl) {
            titleEl.textContent = config.title;
            titleEl.style.display = isWhatsapp ? "" : "none";
        }
        if (headerEl) {
            headerEl.classList.toggle("whatsapp", isWhatsapp);
        }
        if (sidebarEl) {
            sidebarEl.classList.toggle("whatsapp-mode", isWhatsapp);
        }

        updateScheduledTripsToggle();
    };

    const matchesFilter = (trip, configParam = tripListState.currentConfig) => {
        const configToUse = configParam ?? TRIP_LIST_CONFIG.default;
        const filters = configToUse.filters ?? {};

        if (filters.flow && trip?.flow !== filters.flow) {
            return false;
        }

        if (activeTripsFilters.driverName) {
            const driverName = trip?.driver?.name || '';
            if (!driverName.toLowerCase().includes(activeTripsFilters.driverName.toLowerCase())) {
                return false;
            }
        }

        if (activeTripsFilters.status && trip?.status !== activeTripsFilters.status) {
            return false;
        }

        if (activeTripsFilters.customerName) {
            const customerName = trip?.customer?.name || trip?.centralCustomer?.name || '';
            if (!customerName.toLowerCase().includes(activeTripsFilters.customerName.toLowerCase())) {
                return false;
            }
        }

        return true;
    };

    // Viagens agendadas ficam com display:none no DOM quando ocultas pelo
    // toggle — element.children.length conta tudo, escondido ou não, então
    // a lista pode "parecer" vazia (só itens ocultos) sem disparar a
    // mensagem de vazio. Por isso o estado vazio é decidido pelos itens
    // realmente visíveis, não pela contagem bruta de filhos.
    const refreshEmptyState = () => {
        viewController.elementProperty.getElement("#listTripPartner", (element) => {
            if (!element) return;

            const config = tripListState.currentConfig ?? TRIP_LIST_CONFIG.default;
            const isWhatsapp = config.key === TRIP_LIST_CONFIG.whatsapp.key;

            const visibleItems = Array.from(element.querySelectorAll(".trip-item")).filter(
                (item) => item.style.display !== "none"
            );

            if (visibleItems.length > 0) {
                setMessage(
                    !isWhatsapp && scheduledTripsTotal === 0 ? "Nenhuma viagem agendada no momento." : ""
                );
                return;
            }

            const hasHiddenScheduled = !isWhatsapp && hideScheduledTrips && scheduledTripsTotal > 0;

            setMessage(hasHiddenScheduled ? "Nenhuma viagem em andamento no momento." : config.messages.empty);
        });
    };

    // O quão perto do horário agendado uma viagem está (e o texto de
    // contagem regressiva) muda com o tempo, mesmo sem nenhum evento
    // realtime — por isso reavalia e re-renderiza periodicamente.
    const refreshScheduleUrgencyHighlights = () => {
        viewController.elementProperty.getElement("#listTripPartner", (element) => {
            if (!element) return;

            let hasChanges = false;

            Array.from(element.querySelectorAll(".trip-item")).forEach((item) => {
                const trip = parseTripItemValue(item);
                if (trip?.status === STATUS_SCHEDULED) {
                    item.outerHTML = renderTripItem(trip);
                    hasChanges = true;
                }
            });

            if (hasChanges) {
                addEventSelectTrip();
            }
        });
    };

    const updateScheduledTripsToggle = () => {
        const isWhatsapp = tripListState.currentConfig?.key === TRIP_LIST_CONFIG.whatsapp.key;

        viewController.elementProperty.getElement("#listTripPartner", (element) => {
            if (!element) return;

            const scheduledItems = Array.from(element.querySelectorAll(".trip-item")).filter((item) =>
                parseTripItemValue(item)?.status === STATUS_SCHEDULED
            );

            scheduledItems.forEach((item) => {
                item.style.display = hideScheduledTrips ? "none" : "";
            });

            viewController.elementProperty.getElement("#toggleScheduledTrips", (button) => {
                button.style.display = !isWhatsapp ? "flex" : "none";
                button.classList.toggle("active", hideScheduledTrips);

                const icon = button.querySelector(".material-icons");
                if (icon) icon.textContent = hideScheduledTrips ? "visibility_off" : "visibility";
            });

            viewController.elementProperty.getElement("#scheduledTripsCount", (badge) => {
                badge.textContent = scheduledTripsTotal;
            });
        });
    };

    const setLoadingMoreVisible = (element, visible) => {
        const existing = document.getElementById("listTripLoadingMore");

        if (!visible) {
            if (existing) existing.remove();
            return;
        }

        if (!existing) {
            element.insertAdjacentHTML(
                "beforeend",
                `<li class="list-trip-loading-more" id="listTripLoadingMore">Carregando mais viagens...</li>`
            );
        }
    };

    const loadTrips = (config, page = 1) => {
        viewController.elementProperty.getElement("#listTripPartner", (element) => {
            if (!element) return;

            const alreadyLoaded =
                element.dataset.loadedKey === config.key &&
                element.dataset.isLoaded === "true";

            if (page === 1 && alreadyLoaded) {
                refreshEmptyState();
                return;
            }

            if (page === 1) {
                if (element.dataset.loadedKey !== config.key) {
                    element.innerHTML = "";
                }

                element.dataset.loadedKey = config.key;
                element.dataset.isLoaded = "false";

                setMessage(config.messages.loading);
            } else {
                isLoadingMoreTrips = true;
                setLoadingMoreVisible(element, true);
            }

            const filters = { ...config.filters, ...activeTripsFilters, page };

            TripController.getActives(centralId, filters)
                .then(({ status, response }) => {
                    setLoadingMoreVisible(element, false);

                    if (tripListState.currentConfig.key !== config.key) {
                        return;
                    }

                    if (!status) {
                        if (page === 1) {
                            element.dataset.loadedKey = "";
                            element.dataset.isLoaded = "false";
                            setMessage(config.messages.error);
                        }
                        return;
                    }

                    const trips = Array.isArray(response?.trips?.data) ? response.trips.data : [];

                    scheduledTripsTotal = response?.scheduledTotal ?? 0;
                    hasMoreTrips = Boolean(response?.trips?.next_page_url);
                    currentTripsPage = page;

                    if (page === 1) {
                        element.innerHTML = trips.map(renderTripItem).join("");
                    } else {
                        element.insertAdjacentHTML("beforeend", trips.map(renderTripItem).join(""));
                    }

                    if (typeof EditScheduledTrip !== "undefined") {
                        EditScheduledTrip.closeIfNotEditableAmong(trips);
                    }

                    const { typeAdded: type } = tripRealtime;
                    const tripsData = trips.map((trip) => ({ type, data: trip }));

                    addEventSelectTrip();
                    updatePositionCarInTrip(tripsData);
                    onTripUpdateChatEvent(tripsData);
                    updateScheduledTripsToggle();

                    element.dataset.isLoaded = "true";

                    refreshEmptyState();
                })
                .catch((error) => {
                    setLoadingMoreVisible(element, false);
                    console.error("Erro ao carregar viagens:", error);
                    if (tripListState.currentConfig.key !== config.key) {
                        return;
                    }
                    if (page === 1) {
                        element.dataset.loadedKey = "";
                        element.dataset.isLoaded = "false";
                        setMessage(config.messages.error);
                    }
                })
                .finally(() => {
                    if (page > 1) isLoadingMoreTrips = false;
                });
        });
    };

    tripListState.reload = () => {
        viewController.elementProperty.getElement("#listTripPartner", (element) => {
            if (element) {
                element.dataset.loadedKey = "";
                element.dataset.isLoaded = "false";
            }
        });
        hasMoreTrips = true;
        loadTrips(tripListState.currentConfig);
    };

    viewController.elementProperty.addEventInElement("#listTripPartner", "onscroll", function (event) {
        const element = event.target;

        // Dispara a próxima página faltando ~40% de scroll, não só quando
        // encosta no fim — a busca (e o "carregando mais") já termina antes
        // do operador chegar no fundo de fato.
        const scrollableDistance = element.scrollHeight - element.clientHeight;
        const nearBottom = scrollableDistance <= 0 || element.scrollTop >= scrollableDistance * 0.6;

        if (nearBottom && hasMoreTrips && !isLoadingMoreTrips) {
            loadTrips(tripListState.currentConfig, currentTripsPage + 1);
        }
    });

    tripListState.updateItem = (trip) => {
        if (!trip) return;

        const tripEl = document.querySelector(`#tripItem${trip.tripReference}`);

        if (!matchesFilter(trip)) {
            if (tripEl) {
                tripEl.remove();
                refreshEmptyState();
            }
            return;
        }

        if (tripEl) {
            tripEl.outerHTML = renderTripItem(trip);
        }

        addEventSelectTrip();
        updateScheduledTripsToggle();
        refreshEmptyState();
    };

    const updateOpenTripButtonsState = () => {
        const isOpen = document.querySelector(".list-trips-active-partner")?.classList.contains("active");
        const activeKey = isOpen ? tripListState.currentConfig?.key : null;

        viewController.elementProperty.getElement("#showMessageTripActive", (button) => {
            button.classList.toggle("active", activeKey === TRIP_LIST_CONFIG.default.key);
        });

        viewController.elementProperty.getElement("#showWhatsappTripActive", (button) => {
            button.classList.toggle("active", activeKey === TRIP_LIST_CONFIG.whatsapp.key);
        });
    };

    const openTripList = (configKey) => {
        const config = TRIP_LIST_CONFIG[configKey] ?? TRIP_LIST_CONFIG.default;
        const sidebar = document.querySelector('.list-trips-active-partner');
        const isOpen = sidebar?.classList.contains('active');
        const isSameConfig = tripListState.currentConfig?.key === config.key;

        if (isOpen && isSameConfig) {
            viewController.elementProperty.removeClass('.list-trips-active-partner', 'active');
            updateOpenTripButtonsState();
            return;
        }

        tripListState.currentConfig = config;
        setModalHeader(config);
        viewController.elementProperty.addClass('.list-trips-active-partner', 'active');
        loadTrips(config);
        updateOpenTripButtonsState();
    };

    viewController.elementProperty.addEventInElement(".nav-drawer", "onclick", function () {
        viewController.elementProperty.getElement(".list-trips-active-partner", (element) => {
            if (!element) return;
            if (element.classList.contains("active")) {
                element.classList.remove("active");
            } else {
                element.classList.add("active");
            }
            updateOpenTripButtonsState();
        });
    });

    viewController.elementProperty.addEventInElement("#showMessageTripActive", "onclick", function () {
        openTripList(TRIP_LIST_CONFIG.default.key);
    });

    viewController.elementProperty.addEventInElement("#showWhatsappTripActive", "onclick", function () {
        openTripList(TRIP_LIST_CONFIG.whatsapp.key);
    });

    viewController.elementProperty.addEventInElement(".close-trip-actives", "onclick", function () {
        viewController.elementProperty.removeClass(".list-trips-active-partner", "active");
        updateOpenTripButtonsState();
    });

    viewController.elementProperty.addEventInElement("#toggleScheduledTrips", "onclick", function (event) {
        event.stopPropagation();

        hideScheduledTrips = !hideScheduledTrips;

        updateScheduledTripsToggle();
        refreshEmptyState();
    });

    const updateActiveFilterToggle = () => {
        viewController.elementProperty.getElement("#toggleActiveTripsFilter", (button) => {
            button.classList.toggle("active", Object.keys(activeTripsFilters).length > 0);
        });
    };

    viewController.elementProperty.addEventInElement("#toggleActiveTripsFilter", "onclick", function (event) {
        event.stopPropagation();

        viewController.elementProperty.getElement("#activeTripsFilterDropdown", (dropdown) => {
            dropdown.classList.toggle("active");
        });
    });

    const applyActiveTripsFilters = (filters) => {
        if (JSON.stringify(filters) === JSON.stringify(activeTripsFilters)) {
            return;
        }

        activeTripsFilters = filters;

        updateActiveFilterToggle();
        viewController.elementProperty.removeClass("#activeTripsFilterDropdown", "active");
        tripListState.reload();
    };

    viewController.elementProperty.addEventInElement("#btnApplyActiveTripsFilter", "onclick", function (event) {
        event.stopPropagation();

        const customerName = document.querySelector("#activeTripsFilterCustomerName")?.value?.trim();
        const driverName = document.querySelector("#activeTripsFilterDriverName")?.value?.trim();
        const status = document.querySelector("#activeTripsFilterStatus")?.value;

        const filters = {};
        if (customerName) filters.customerName = customerName;
        if (driverName) filters.driverName = driverName;
        if (status) filters.status = status;

        applyActiveTripsFilters(filters);
    });

    viewController.elementProperty.addEventInElement("#btnClearActiveTripsFilter", "onclick", function (event) {
        event.stopPropagation();

        viewController.elementProperty.getElement("#activeTripsFilterCustomerName", (el) => { el.value = ""; });
        viewController.elementProperty.getElement("#activeTripsFilterDriverName", (el) => { el.value = ""; });
        viewController.elementProperty.getElement("#activeTripsFilterStatus", (el) => { el.value = ""; });

        applyActiveTripsFilters({});
    });

    document.onclick = function (event) {
        const dropdown = document.querySelector("#activeTripsFilterDropdown");
        if (!dropdown || !dropdown.classList.contains("active")) return;
        if (dropdown.contains(event.target) || event.target.closest("#toggleActiveTripsFilter")) return;

        dropdown.classList.remove("active");
    };

    setModalHeader(tripListState.currentConfig);
    loadTrips(tripListState.currentConfig);

    if (scheduleUrgencyIntervalId) clearInterval(scheduleUrgencyIntervalId);
    scheduleUrgencyIntervalId = setInterval(refreshScheduleUrgencyHighlights, 60000);

    function renderTripStatus(trip) {
        return `<span>
                    <span>Status: </span>
                    <Span>${checkStatusByTrip(trip)}</Span>
                </span>`;
    }

    function renderTripItem(trip) {
        const dataCentral = Session.get("centralSelected");
        
        let customerName = '';
        
        if (trip.customer != null && trip.customer.name) customerName = trip.customer.name;
        else if (trip.centralCustomer != null && trip.centralCustomer.name) customerName = trip.centralCustomer.name;
        else if (dataCentral != null && dataCentral.name) customerName = dataCentral.name;

        if (trip.status === STATUS_SEARCHING || trip.status === STATUS_SEARCHING_FAVORITE) {
            return `<li class="trip-item" id="tripItem${trip.tripReference}" value='${JSON.stringify(trip)}'>
                        ${createDropdown(trip, "Procurando...")}
                        ${renderTripStatus(trip)}
                    </li>`;
        }

        return `<li class="trip-item" id="tripItem${trip.tripReference}" value='${JSON.stringify(trip)}'>
                    ${createDropdown(trip)}
                    <div class="container-data-trip">
                        <p><span>Cliente:</span> ${customerName}</p>
                        <p><span>Motorista:</span> ${trip?.driver?.name || ''}</p>
                        <p class="info-scheduled-trip ${!!trip?.schedule ? 'active' : ''}">
                            <span>Data e hora da viagem:</span> ${moment(trip?.schedule?.schedule).format("DD/MM/YYYY HH:mm")}
                        </p>
                        <p><span>Valor:</span> ${(JSON?.parse(localStorage?.getItem('cityConfig'))?.typeMoney || Session.getLocal('cityConfig')?.typeMoney || 'R$')} ${Mask.maskMoney(parseFloat(trip.price))}</p>
                        <ul>
                            <li><span>${trip.origin?.address || trip.origin?.name}</span></li>
                            ${(trip.tripWayPoints || []).map(waypoint => `<li><span>${waypoint.address || waypoint.name || ''}</span></li>`).join('')}
                            <li><span>${trip.destination?.address || trip.destination?.name}</span></li>
                        </ul>
                    </div>
                    ${renderTripStatus(trip)}
                </li>`;
    }

    // Mesma ordenação usada no backend (findActivesByCentral): agendadas
    // primeiro (mais próximas do horário primeiro), depois as demais por
    // data de criação (mais recente primeiro).
    function compareTripOrder(a, b) {
        const aScheduled = a?.status === STATUS_SCHEDULED;
        const bScheduled = b?.status === STATUS_SCHEDULED;

        if (aScheduled !== bScheduled) {
            return aScheduled ? -1 : 1;
        }

        if (aScheduled) {
            const aTime = a?.schedule?.schedule ? new Date(a.schedule.schedule).getTime() : Infinity;
            const bTime = b?.schedule?.schedule ? new Date(b.schedule.schedule).getTime() : Infinity;
            return aTime - bTime;
        }

        return new Date(b?.date).getTime() - new Date(a?.date).getTime();
    }

    function upsertTripItemSorted(container, trip) {
        const existingEl = document.querySelector(`#tripItem${trip.tripReference}`);
        if (existingEl) existingEl.remove();

        const nextSibling = Array.from(container.querySelectorAll(".trip-item")).find((item) =>
            compareTripOrder(trip, parseTripItemValue(item)) < 0
        );

        if (nextSibling) {
            nextSibling.insertAdjacentHTML("beforebegin", renderTripItem(trip));
        } else {
            container.insertAdjacentHTML("beforeend", renderTripItem(trip));
        }
    }

    function verifyDriverCancel(tripReference) {
        if (recentlyCanceledByOperator.has(tripReference)) {
            recentlyCanceledByOperator.delete(tripReference);
            return;
        }

        TripRepository.get(tripReference).then(({ status, response }) => {
            if (status && response.status === STATUS_CANCELED && response.canceledBy === "driver") {
                initNewTripAfterCancel(response);
            }
        });
    }

    // scheduledTripsTotal vem do endpoint paginado (fonte da verdade) e só é
    // resincronizado a cada página buscada — eventos realtime entre uma busca
    // e outra precisam ajustar esse contador na mão, senão ele fica parado
    // enquanto viagens agendadas são criadas/canceladas/finalizadas na tela.
    const adjustScheduledTripsTotal = (delta) => {
        scheduledTripsTotal = Math.max(0, scheduledTripsTotal + delta);
    };

    function onTripUpdateEvent(results = []) {
        if (!Array.isArray(results) || results.length === 0) {
            return;
        }

        const filteredResults = [];

        results.forEach(({ type, data: trip }) => {
            if (!trip) return;

            if (typeof EditScheduledTrip !== "undefined" && type === tripRealtime.typeRemoved) {
                EditScheduledTrip.closeIfRemoved(trip.tripReference);
            }

            if (!matchesFilter(trip)) {
                const tripEl = document.querySelector(`#tripItem${trip.tripReference}`);
                if (tripEl) {
                    if (parseTripItemValue(tripEl)?.status === STATUS_SCHEDULED) {
                        adjustScheduledTripsTotal(-1);
                    }
                    tripEl.remove();
                    refreshEmptyState();
                }

                if (type === tripRealtime.typeRemoved) {
                    verifyDriverCancel(trip?.tripReference);
                }
                return;
            }

            filteredResults.push({ type, data: trip });

            viewController.elementProperty.getElement("#listTripPartner", (element) => {
                if (!element) return;

                const existingEl = document.querySelector(`#tripItem${trip.tripReference}`);
                const wasScheduled = existingEl ? parseTripItemValue(existingEl)?.status === STATUS_SCHEDULED : false;
                const isScheduled = trip?.status === STATUS_SCHEDULED;

                if (type === tripRealtime.typeAdded) {
                    upsertTripItemSorted(element, trip);
                    if (isScheduled && !existingEl) adjustScheduledTripsTotal(1);
                }

                if (type === tripRealtime.typeModified) {
                    if (existingEl) {
                        upsertTripItemSorted(element, trip);
                        if (wasScheduled && !isScheduled) adjustScheduledTripsTotal(-1);
                        if (!wasScheduled && isScheduled) adjustScheduledTripsTotal(1);
                    }
                }

                if (type === tripRealtime.typeRemoved) {
                    if (existingEl) {
                        existingEl.remove();
                        if (wasScheduled) adjustScheduledTripsTotal(-1);
                    }

                    verifyDriverCancel(trip?.tripReference);
                }

                if (![STATUS_SEARCHING, STATUS_SEARCHING_FAVORITE, STATUS_SCHEDULED].includes(trip?.status)) {
                  showToastByStatusTrip(trip);
                }

                addEventSelectTrip();
            });
        });

        if (filteredResults.length > 0) {
            updatePositionCarInTrip(filteredResults);
        }

        refreshEmptyState();
        updateScheduledTripsToggle();
    }
    
    if (!unsubscribeId) {
        try {
            unsubscribeId = tripRealtime.getTrips(centralId, onTripUpdateEvent);
        } catch (e) {
            console.error("Erro ao iniciar realtime de viagens ativas:", e);
        }
    }
}

function buildCancelSuccessMessage(response, message) {
    const base = message || "Viagem cancelada com sucesso";

    if (!response?.groupCancel) return base;

    const { canceled = [], failed = [] } = response.groupCancel;

    if (failed.length === 0) {
        return `${base}\n${canceled.length} outra${canceled.length === 1 ? "" : "s"} viagem${canceled.length === 1 ? "" : "s"} agendada${canceled.length === 1 ? "" : "s"} do lote também ${canceled.length === 1 ? "foi cancelada" : "foram canceladas"}.`;
    }

    return `${base}\n${canceled.length} viagem(ns) do lote cancelada(s), ${failed.length} não pôde(puderam) ser cancelada(s).`;
}

function createDropdown(trip, title) {
    const canEditScheduledTrip = trip.status === STATUS_SCHEDULED;

    return `<div class="option-trip">
                <div><a class="trip-details-link">${title ?? "Detalhes"}</a></div>
                <i class="material-icons open-dropdown-customer" tripReference="${trip.tripReference}">more_vert</i>
                <ul class="dropdown-customer" tripReference="${trip.tripReference}">
                    ${canEditScheduledTrip ? `<li><a class="edit-scheduled-trip-item" trip='${JSON.stringify(trip)}'>Editar viagem</a></li>` : ''}
                    <li><a class="cancel-trip-item-option" trip='${JSON.stringify(trip)}'>Cancelar viagem</a></li>
                    <li><a class="cancel-and-call-trip-again" trip='${JSON.stringify(trip)}'>Cancelar e chamar novamente</a>
                    <li><a href="/trip/${trip.tripReference}/direction" target="_blank">Acompanhar trajeto</a></li>
                    <li><a class="share-trip-item" trip='${JSON.stringify(trip)}'>Compartilhar viagem</a></li>
                    <li><a class="finish-trip-item" trip='${JSON.stringify(trip)}'>Finalizar viagem</a></li>
                </ul>
            </div>
        `
}


function addEventSelectTrip() {
    viewController.elementProperty.addEventInElement(".share-trip-item", "onclick", function (event) {
        event.preventDefault();
        const trip = JSON.parse(this.getAttribute("trip"));
        preload(true);
        TripController.share(trip.tripReference).then(result => {
            preload(false);
            const text = `Acompanhe sua viagam: ${result.data}`
            const link = `https://api.whatsapp.com/send?phone=+55${trip.customer.phone}&text=${encodeURI(text)}`;
            window.open(link, '_blank');
        })
    });
    viewController.elementProperty.addEventInElement(".finish-trip-item", "onclick", function (event) {
        event.preventDefault();
        const trip = JSON.parse(this.getAttribute("trip"));
        SwalCustom.dialogConfirm("Deseja finalizar essa viagem?", "").then(() => {
            preload(true);
            TripController.finishTrip(trip.tripReference).then(result => {
                preload(false);
                if (!result.status) {
                    SwalCustom.messageDialog(result.message, "Atenção")
                }
            })
        });
    });

    viewController.elementProperty.addEventInElement(".trip-item", "onclick", function () {
        const trip = JSON.parse(this.getAttribute("value"));

        if (trip.status === STATUS_SCHEDULED) {
            return;
        }

        viewController.elementProperty.removeClass(".list-trips-active-partner", "active");

        if (this.classList.contains("active")) {
            return;
        }

        clearTimeout(managerTrip.timeOut);

        if (managerTripViewCurrent.request != null)
            managerTripViewCurrent.request.abort();

        initProcessingCallTrip(false);

        viewController.elementProperty.removeClass(".trip-item", "active");

        viewController.elementProperty.removeClass(".list-trips-active-partner", "show");

        this.classList.add("active");

        Session.setLocal("tripReference", trip.tripReference);

        managerTripViewCurrent.isVisible = true;

        if (managerTripViewCurrent.request != null)
            managerTripViewCurrent.request.abort();

        verifyTrip(trip);
    });

    viewController.elementProperty.addEventInElement(".edit-scheduled-trip-item", "onclick", function (event) {
        event.preventDefault();
        event.stopPropagation();
        const trip = JSON.parse(this.getAttribute("trip"));
        viewController.elementProperty.removeClass(".open-dropdown-customer", "active");
        if (typeof window.closeMenuDrawer === "function") window.closeMenuDrawer();
        EditScheduledTrip.open(trip);
    });

    viewController.elementProperty.addEventInElement(".open-dropdown-customer", "onclick", function (event) {
        event.stopPropagation();
        this.classList.add("active");
    });

    viewController.elementProperty.addEventInElement(".cancel-trip-item-option", "onclick", function (event) {
        event.stopPropagation();
        const trip = JSON.parse(this.getAttribute("trip"));

        const askScope = trip.scheduledBatchId
            ? SwalCustom.choiceDialog("Cancelar viagem", "Esta viagem faz parte de um lote. O que deseja cancelar?", undefined, {
                cancel:  { text: "Fechar",         value: false },
                confirm: { text: "Só esta",        value: "this" },
                danger:  { text: "Todas do lote",  value: "all", closeModal: true },
            }, "swal-modal--wide")
            : SwalCustom.choiceDialog("Cancelar viagem", "A viagem será cancelada.", undefined, {
                cancel: { text: "Fechar",         value: false },
                danger: { text: "Sim, cancelar", value: "this", closeModal: true },
            });

        askScope.then((scope) => {
            viewController.elementProperty.addClass(".container-preload-main", "active");

            TripRepository.cancel(trip.tripReference, scope)
                .then(function ({status, message, response}) {
                    if (!status) {
                        SwalCustom.messageDialog(message || "Ocorreu um erro ao tentar cancelar a viagem", "Atenção", undefined, "warning");
                        return;
                    }

                    markRecentlyCanceledByOperator(trip.tripReference);
                    (response?.groupCancel?.canceled || []).forEach(markRecentlyCanceledByOperator);

                    SwalCustom.messageDialog(buildCancelSuccessMessage(response, message), "Viagem cancelada", undefined, "success");
                    if (typeof tripListState.reload === "function") {
                        tripListState.reload();
                    }
                }).catch(() => {
                SwalCustom.messageDialog("Ocorreu um erro ao tentar cancelar a viagem", "Atenção", undefined, "warning");
            }).finally(() => {

                viewController.elementProperty.removeClass(".container-preload-main", "active");
            });
        }).catch(() => {});
    });

    // Cancela a corrida atual e já inicia uma nova automaticamente, sem ação extra do operador
    viewController.elementProperty.addEventInElement(".cancel-and-call-trip-again", "onclick", function (event) {
        event.stopPropagation();
        const trip = JSON.parse(this.getAttribute("trip"))
        SwalCustom.dialogConfirm("Cancelar e chamar novamente?", "A viagem atual será cancelada e uma nova corrida será iniciada.", undefined, {
            cancel:  { text: "Não",                       value: false },
            confirm: { text: "Sim, cancelar e chamar", value: true, closeModal: true },
        }).then(() => {
            viewController.elementProperty.addClass(".container-preload-main", "active");
            TripRepository.cancel(trip.tripReference)
                .then(function ({status, message}) {
                    if (!status) {
                        SwalCustom.messageDialog(message || "Ocorreu um erro ao tentar cancelar a viagem", "Atenção", undefined, "warning");
                        return;
                    }
                    markRecentlyCanceledByOperator(trip.tripReference);
                    initNewTripAfterCancel(trip);
                }).catch(() => {
                // Atenção: não chamar initNewTripAfterCancel em falha — corrida não foi cancelada
                SwalCustom.messageDialog("Ocorreu um erro ao tentar cancelar a viagem", "Atenção", undefined, "warning");
            }).finally(() => {
                viewController.elementProperty.removeClass(".container-preload-main", "active");
            });
        });
    });

    document.addEventListener("click", function (event) {
        const isClickContainerDropdown = event.path?.filter(element => {
            if (!element.classList)
                return false;

            return element.classList.contains("open-dropdown-customer");
        }).length > 0;

        if (!isClickContainerDropdown) {
            viewController.elementProperty.removeClass(".open-dropdown-customer", "active");
        }
    });
}

function checkStatusByTrip(trip) {
    switch (trip?.status) {
        case STATUS_SEARCHING :
        case STATUS_SEARCHING_FAVORITE : {
            return "Solicitando motorista"
        }
        case STATUS_PRE_ACCEPTED :
        case STATUS_ACCEPTED: {
            return "Motorista aceitou a viagem";
        }
        case  STATUS_BOARDING: {
            return "Motorista aguardando o cliente";
        }
        case "in_progress" : {
            return "Motorista iniciou a viagem";
        }
        case STATUS_SCHEDULED : {
            const hasDriver = !!trip?.driverId;
            const urgent = isScheduleUrgent(trip);

            if (hasDriver) {
                return urgent ? "Começa em breve" : "Motorista confirmado";
            }
            return urgent ? "Expira em breve" : "Aguardando aceite do motorista";
        }
        default : {
            return "Viagem está sem status";
        }
    }
}

function addEventListTrip() {
    viewController.elementProperty.addEventInElement(".expand-options-trips-partner", "onclick", function () {
        viewController.elementProperty.getElement(".list-trips-active-partner", element => {
            if (element.classList.contains("show")) {
                element.classList.remove("show");
            } else {
                element.classList.add("show");
            }
        });
    });
}


function updatePositionCarInTrip(trips) {
    const tripRouteRealtime = new TripRouteRealtime();

    trips.map(trip => {
        tripRouteRealtime.getPositionDriver(trip.data.tripReference, (route, type) => {

            if (type === tripRouteRealtime.typeRemoved)
                return removeRouteMap(route);

            updateRouteMap(trip.data, route);
        })
    })
}

function removeRouteMap(route) {
    mapService.removeInRoute(route);
    removeMarkerRoute(route.tripReference)
}

const markerRoute = {};

function updateRouteMap(trip, route) {
    mapService.showInRoute(route);

    const path = MapService.decodePolyline(route.polyline);

    const position = path[path.length - 1];

    const marker = (() => {
        if (!markerRoute[trip.tripReference])
            return createMarkerRoute(trip.tripReference, position);

        return markerRoute[trip.tripReference];
    })();

    if (marker)
        marker.setPosition(position);

}

function createMarkerRoute(tripReference, position) {
    markerRoute[tripReference] = mapService.makeMarker(position, mapService.map, {
        url: "webfiles/img/svg/pog.svg",
        scaledSize: { width: 15, height: 15 }
    });
}

function removeMarkerRoute(tripReference) {
    if (!markerRoute[tripReference])
        return;

    markerRoute[tripReference].setMap(null);

    delete markerRoute[tripReference];
}