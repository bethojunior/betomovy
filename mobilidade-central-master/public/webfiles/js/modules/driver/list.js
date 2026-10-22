document.addEventListener("DOMContentLoaded", function () {
    const central = Session.get("centralSelected");
    if (!central || !central.id) {
        const table = document.querySelector("#resultTable");
        if (table) {
            table.innerHTML = `<tr><td colspan="6" class="text-center p-4 text-muted">Selecione uma central para visualizar os motoristas.</td></tr>`;
        }
        return;
    }
    showList(central.id);
});

const escapeHtml = (str) => str
    ? String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
    : '';

function showList(idCentral) {
    if (!idCentral) return;
    DriverRepository.list(idCentral).then(({ status, response }) => {
        createPagination(response);
        createListDrivers(response);
    }).catch(err => {
        console.error("Erro ao listar motoristas:", err);
        createListDrivers({ data: [] });
    });
}

function createListDrivers(response) {
    const elementProperty = new ElementProperty();

    elementProperty.getElement("#resultTable", element => {
        const drivers = Array.isArray(response) ? response : (response?.data || []);
        if (drivers.length === 0) {
            element.innerHTML = `<tr>
                <td colspan="6" class="drv-empty-state">
                    <div>
                        <i class="material-icons">no_accounts</i>
                        <p>Nenhum motorista encontrado</p>
                    </div>
                </td>
            </tr>`;
            return;
        }

        element.innerHTML = drivers.map(driver => {
            const isBlocked = !!driver?.blockedId;
            const toggleClass = isBlocked ? "unblocked-user-driver" : "blocked-user-driver";
            const toggleLabel = isBlocked ? "Desbloquear" : "Bloquear";
            const toggleIcon = isBlocked ? "lock_open" : "lock";
            const toggleBtnClass = isBlocked ? "drv-action-btn--success" : "drv-action-btn--warn";
            const driverName = driver.user?.name || driver.name || '';
            const driverEmail = driver.user?.email || driver.email || '';
            const driverPhone = driver.user?.phone || driver.phone || '';
            const createdAt = driver.user?.created_at || driver.created_at;

            return `<tr>
                <td>
                    <div class="drv-name-cell">
                        <div class="drv-photo" style="background-image: url('${driver.profileImageUrl || ''}')"></div>
                        <span>${escapeHtml(driverName)}</span>
                    </div>
                </td>
                <td>${escapeHtml(Driver.code(driver))}</td>
                <td>${escapeHtml(driverEmail)}</td>
                <td>${escapeHtml(driverPhone)}</td>
                <td>${createdAt ? moment(createdAt).format("DD/MM/YYYY HH:mm") : ''}</td>
                <td>
                    <div class="drv-actions">
                        <button type="button" class="drv-action-btn drv-action-btn--danger remove-user-driver" value="${driver.idDriver}">
                            <i class="material-icons">delete</i>Excluir
                        </button>
                        <span class="drv-action-sep">·</span>
                        <button type="button" class="drv-action-btn ${toggleBtnClass} ${toggleClass}" value="${driver.idDriver}" blockedId="${driver?.blockedId || ''}">
                            <i class="material-icons">${toggleIcon}</i>${toggleLabel}
                        </button>
                    </div>
                </td>
            </tr>`;
        }).join("");

        elementProperty.addEventInElement(".remove-user-driver", "onclick", function () {
            const value = this.getAttribute("value");
            SwalCustom.dialogConfirm("", "Deseja remover esse motorista da central?").then(() => {
                const centralSelected = Session.get("centralSelected");
                DriverRepository.remove(centralSelected.id, value);
                this.closest("tr")?.remove();
            });
        });

        elementProperty.addEventInElement(".blocked-user-driver", "onclick", function () {
            blockedUserDriver(this);
        });
        elementProperty.addEventInElement(".unblocked-user-driver", "onclick", function () {
            unblockedUserDriver(this);
        });
    });
}

function unblockedUserDriver(element) {
    const blockedId = element.getAttribute("blockedId");
    SwalCustom.dialogConfirm("", "Deseja desbloquear esse motorista da central?").then(async () => {
        preload(true);
        await DriverRepository.unblockedUserDriver(blockedId).catch(() => {
            SwalCustom.messageDialog("", "Erro ao desbloquear motorista", undefined, "info");
        });
        preload(false);
        window.location.reload();
    });
}

function blockedUserDriver(element) {
    const value = element.getAttribute("value");
    const central = Session.get("centralSelected");
    SwalCustom.dialogConfirm("", "Deseja bloquear esse motorista da central?").then(async () => {
        preload(true);
        await DriverRepository.blocked(central.id, value).catch(() => {
            SwalCustom.messageDialog("", "Erro ao bloquear motorista", undefined, "info");
        });
        preload(false);
        window.location.reload();
    });
}

function createPagination(response) {
    const elementProperty = new ElementProperty();

    elementProperty.getElement(".container-pagination", element => {
        if (!response || Array.isArray(response) || !response.last_page || response.last_page <= 1) {
            element.innerHTML = "";
            return;
        }

        const currentPage = response.current_page || 1;
        const lastPage = response.last_page || 1;
        const hasPrev = !!response.prev_page_url || currentPage > 1;
        const hasNext = !!response.next_page_url || currentPage < lastPage;

        element.innerHTML = `<div class="drv-pager">
            <button class="drv-pager-btn ${hasPrev ? "prev-page" : ""}" ${hasPrev ? "" : "disabled"} aria-label="Página anterior">
                <i class="material-icons">chevron_left</i>
                <span>Anterior</span>
            </button>
            <span class="drv-pager-count">${currentPage} / ${lastPage}</span>
            <button class="drv-pager-btn ${hasNext ? "next-page" : ""}" ${hasNext ? "" : "disabled"} aria-label="Próxima página">
                <span>Próxima</span>
                <i class="material-icons">chevron_right</i>
            </button>
        </div>`;

        elementProperty.addEventInElement(".prev-page", "onclick", function () {
            getNewPage(currentPage - 1);
            document.querySelector(".container-main").scrollTop = 0;
        });

        elementProperty.addEventInElement(".next-page", "onclick", function () {
            getNewPage(currentPage + 1);
            document.querySelector(".container-main").scrollTop = 0;
        });
    });

    function getNewPage(page) {
        elementProperty.addClass("#resultTable", "hide");
        const url = `${ConnectionServer.Host()}central/${Session.get("centralSelected").id}/driver?page=${page}`;
        DriverRepository.getDriversByUrl(url)
            .then(({ response }) => {
                createPagination(response);
                createListDrivers(response);
            }).finally(() => {
                elementProperty.removeClass("#resultTable", "hide");
            });
    }
}
