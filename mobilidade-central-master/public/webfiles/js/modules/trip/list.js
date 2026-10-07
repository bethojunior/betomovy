document.addEventListener("DOMContentLoaded", function () {
    let filter = "";

    const elementProperty = new ElementProperty();

    const centralId = Session.getValueInSession("centralSelected", "id");

    showSkeletons();

    CentralRepository.getTrips(centralId)
        .then(({status, response}) => {
            createPagination(response);
            showListTrip(response);
        });

    DriverRepository.list(centralId).then(({status, response}) => {
        if (!response.data) return;

        elementProperty.getElement("#filterDriverId", element => {
            element.innerHTML += response.data.map(driver =>
                `<option value="${driver.idDriver}">${escapeHtml(driver.user?.name)}</option>`
            ).join("");
        });
    });


    function getFilter() {
        let params = "";

        const tripStatus = document.querySelector("#tripStatus");
        const dateStart = document.querySelector("#dateStart");
        const dateEnd = document.querySelector("#dateEnd");
        const filterCustomerName = document.querySelector("#filterCustomerName");
        const filterDriverId = document.querySelector("#filterDriverId");

        if (tripStatus.value.length > 0) {
            params += `&status=${tripStatus.value}`;
        }

        if (filterCustomerName.value.trim().length > 0) {
            params += `&customerName=${encodeURIComponent(filterCustomerName.value.trim())}`;
        }

        if (filterDriverId.value.length > 0) {
            params += `&driverId=${filterDriverId.value}`;
        }

        if (dateStart.value.length > 0 && dateEnd.value.length > 0) {
            if (new Date(dateStart.value) > new Date(dateEnd.value)) {
                alert("Data inicial deve ser menor ou igual à data final");
                return false;
            }
            params += `&date[]=${dateStart.value}&date[]=${dateEnd.value}`;
        }

        return params;
    }


    elementProperty.addEventInElement("#btnFilterTrip", "onclick", () => {
        filter = getFilter();

        if (filter !== false) {
            getNewPage(`${ConnectionServer.Host()}central/${Session.getValueInSession("centralSelected", "id")}/trip?page=1${filter}`);
        }
    });

    function createPagination(response) {
        const centralId = Session.getValueInSession("centralSelected", "id");

        elementProperty.getElement(".container-pagination", element => {

            const hasPrev = response.prev_page_url != null;
            const hasNext = response.next_page_url != null;

            element.innerHTML = `<div class="tl-pager">
                <button class="tl-pager-btn ${hasPrev ? "prev-page" : ""}" ${hasPrev ? "" : "disabled"} aria-label="Página anterior">
                    <i class="material-icons">chevron_left</i>
                    <span>Anterior</span>
                </button>
                <span class="tl-pager-count">${response.current_page} / ${response.last_page}</span>
                <button class="tl-pager-btn ${hasNext ? "next-page" : ""}" ${hasNext ? "" : "disabled"} aria-label="Próxima página">
                    <span>Próxima</span>
                    <i class="material-icons">chevron_right</i>
                </button>
            </div>`;

            elementProperty.addEventInElement(".prev-page", "onclick", function () {
                getNewPage(`${ConnectionServer.Host()}central/${centralId}/trip?page=${response.current_page - 1}${filter}`);
                document.querySelector(".container-main").scrollTop = 0;
            });

            elementProperty.addEventInElement(".next-page", "onclick", function () {
                getNewPage(`${ConnectionServer.Host()}central/${centralId}/trip?page=${response.current_page + 1}${filter}`);
                document.querySelector(".container-main").scrollTop = 0;
            });
        });
    }

    // Para adicionar um novo status basta incluir a entrada aqui
    const STATUS_LABELS = {
        searching:          "Buscando motorista",
        searching_favorite: "Buscando favorito",
        pre_accepted:       "Aceita (motorista em viagem)",
        accepted:           "Aceita",
        boarding:           "Embarcando",
        in_progress:        "Em viagem",
        finished:           "Finalizada",
        canceled:           "Cancelada",
        payment_refused:    "Pagamento recusado",
        not_answered:       "Não atendida",
        back_off:           "Desistiu",
        scheduled:          "Agendada",
    };

    const STATUS_CONFIG = {
        searching:          { badge: "tl-badge--pending",   card: "tl-status--pending"  },
        searching_favorite: { badge: "tl-badge--pending",   card: "tl-status--pending"  },
        pre_accepted:       { badge: "tl-badge--accepted",  card: "tl-status--accepted" },
        accepted:           { badge: "tl-badge--accepted",  card: "tl-status--accepted" },
        boarding:           { badge: "tl-badge--accepted",  card: "tl-status--accepted" },
        in_progress:        { badge: "tl-badge--active",    card: "tl-status--active"   },
        finished:           { badge: "tl-badge--finished",  card: "tl-status--finished" },
        canceled:           { badge: "tl-badge--canceled",  card: "tl-status--canceled" },
        payment_refused:    { badge: "tl-badge--canceled",  card: "tl-status--canceled" },
        not_answered:       { badge: "tl-badge--missed",    card: "tl-status--missed"   },
        back_off:           { badge: "tl-badge--missed",    card: "tl-status--missed"   },
        scheduled:          { badge: "tl-badge--scheduled", card: "tl-status--scheduled"},
    };

    function getStatusConfig(status) {
        return STATUS_CONFIG[status] || { badge: "tl-badge--missed", card: "tl-status--missed" };
    }

    // Nomes de clientes e endereços são entrada do usuário final — escapar antes de renderizar
    const escapeHtml = (str) => str
        ? String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')
        : '';

    function showListTrip(response) {
        const dataCentral = Session.get("centralSelected");
        const money = JSON?.parse(localStorage?.getItem('cityConfig'))?.typeMoney ?? "R$";

        elementProperty.getElement(".list-trips", element => {
            element.innerHTML = '';
            element.innerHTML = response.data.map(trip => {
                const cfg         = getStatusConfig(trip.status);
                const statusLabel = STATUS_LABELS[trip.status] || trip.status;
                const customerName = trip.centralCustomer != null
                    ? trip.centralCustomer.name
                    : dataCentral.name;

                let driverInfo = '<span class="trip-driver trip-driver--rejected">Corrida não atendida</span>';
                if (!!trip?.driver) {
                    driverInfo = `<span class="trip-driver">${escapeHtml(trip.tripType)} com ${escapeHtml(trip.driver.driverName)}</span>`;
                } else if (!!trip?.schedule && trip?.status === "scheduled") {
                    driverInfo = `<span class="trip-driver">Aguardando um motorista aceitar</span>`;
                }

                const returnTag = trip.haveReturn == 1
                    ? `<span class="trip-tag">c/ Retorno</span>`
                    : "";

                const canceledByText =
                    trip.status === "canceled" && trip.canceledBy === "driver"   ? "Cancelada pelo Motorista" :
                    trip.status === "canceled" && trip.canceledBy === "customer" ? "Cancelada pelo Cliente"   : "";

                const scheduledHtml = !!trip?.schedule
                    ? `<div class="trip-scheduled">Agendada para ${moment(trip.schedule.schedule).format('DD/MM/YYYY HH:mm')}</div>`
                    : "";

                const d       = new Date(trip.date);
                const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                const timeStr = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const endTime = trip.endDate ? new Date(trip.endDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';

                const waypointsHtml = (trip.tripWayPoints || [])
                    .map((wayPoint) => `
                                <li class="route-waypoint">
                                    <div>
                                        <span>${escapeHtml(wayPoint?.address)}</span>
                                        <span></span>
                                    </div>
                                </li>`)
                    .join("");

                return `<li class="detail-trip ${cfg.card}">
                    <div class="container-item">
                        <div class="trip-summary">
                            <div class="trip-main">
                                <div class="trip-header-row">
                                    <span class="trip-customer">${escapeHtml(customerName)}</span>
                                    <span class="trip-price">${money} ${Mask.maskMoney(trip.price)}</span>
                                </div>
                                <div class="trip-status-row">
                                    <span class="trip-when">${escapeHtml(trip.cityName)} · ${dateStr} · ${timeStr}</span>
                                    <span class="tl-badge ${cfg.badge}">${statusLabel}</span>
                                </div>
                                <div class="trip-row-sub">
                                    <span class="trip-payment">${trip.tripPaymentForm}</span>
                                    ${returnTag}
                                    ${canceledByText ? `<span class="trip-canceled-by">${canceledByText}</span>` : ""}
                                </div>
                            </div>
                            <i class="material-icons trip-chevron">expand_more</i>
                        </div>
                        ${scheduledHtml}
                        <hr>
                        <div class="more-info">
                            ${driverInfo}
                            <ul>
                                <li>
                                    <div>
                                        <span>${escapeHtml(trip.origin?.address)}</span>
                                        <span>${timeStr}</span>
                                    </div>
                                </li>
                                ${waypointsHtml}
                                <li>
                                    <div>
                                        <span>${escapeHtml(trip.destination?.address)}</span>
                                        <span>${endTime}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <footer>
                        <a href="/trip/${trip.tripReference}/details">
                            Ver detalhes
                            <i class="material-icons">arrow_forward</i>
                        </a>
                    </footer>
                </li>`;
            }).join("");

            elementProperty.addEventInElement(".detail-trip", "onclick", function (event) {
                if (event.target.closest("footer")) return;
                if (!this.classList.contains("active")) {
                    this.classList.add("active");
                } else {
                    this.classList.remove("active");
                }
            });

            elementProperty.addEventInElement(".detail-trip > footer", "onclick", function (event) {
                event.stopPropagation();
            });
        });
    }

    function showSkeletons(count = 6) {
        elementProperty.getElement(".list-trips", el => {
            el.innerHTML = Array.from({ length: count }, (_, i) => `
                <li class="detail-trip tl-skeleton" style="--sk-delay:${i * 80}ms">
                    <div class="container-item">
                        <div class="trip-summary">
                            <div class="trip-main">
                                <div class="trip-header-row">
                                    <div class="tl-sk-line tl-sk-line--name"></div>
                                    <div class="tl-sk-line tl-sk-line--price"></div>
                                </div>
                                <div class="trip-status-row">
                                    <div class="tl-sk-line tl-sk-line--meta"></div>
                                    <div class="tl-sk-pill"></div>
                                </div>
                                <div class="trip-row-sub">
                                    <div class="tl-sk-line tl-sk-line--payment"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            `).join('');
        });
    }

    function getNewPage(url) {
        showSkeletons();
        CentralRepository.getTripsByUrl(url)
            .then(({response}) => {
                createPagination(response);
                showListTrip(response);
            });
    }
});
