document.addEventListener("DOMContentLoaded", function () {
    const elementProperty = new ElementProperty();

    const manager = {
        timeoutFilter: null,
    };

    const escapeHtml = (str) => str
        ? String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')
        : '';

    function showLoading() {
        elementProperty.getElement("#resultTable", element => {
            element.innerHTML = `<tr><td colspan="6" class="text-center">Carregando...</td></tr>`;
        });
    }

    function showCustomerError(message) {
        elementProperty.getElement("#resultTable", el => {
            el.innerHTML = `<tr><td colspan="6" class="text-center text-muted">${escapeHtml(message)}</td></tr>`;
        });
    }

    function handleCustomerResponse({ status, response, message }) {
        if (!status || !response) {
            showCustomerError(message || 'Erro ao carregar clientes.');
            return;
        }
        showListCustomer(response);
        createPagination(response);
    }

    function handleCustomerError(error) {
        console.error('customer/list:', error);
        showCustomerError('Erro ao carregar clientes.');
    }

    function formatDocument(document) {
        if (!document) return '—';
        return Mask.setMaskCnpjOrCpf(document) || '—';
    }

    function getCustomerDocument(customer) {
        return customer.document
            || customer.cpf
            || customer.cnpj
            || customer.userDocument
            || customer.customerDocument
            || '';
    }

    function formatDateOfBirth(dateOfBirth) {
        if (!dateOfBirth) return '—';
        return dateOfBirth.split('T')[0].split('-').reverse().join('/');
    }

    function getFilterConfig(page) {
        return {
            page,
            filter: {
                [document.querySelector("input[name='typeFilter']:checked").value]:
                    document.getElementById("filterCustomer").value
            }
        };
    }

    const centralId = Session.getValueInSession("centralSelected", "id");
    if (!centralId) {
        elementProperty.getElement("#resultTable", element => {
            element.innerHTML = `<tr><td colspan="6" class="text-center p-4 text-muted">Selecione uma central para visualizar os clientes.</td></tr>`;
        });
    } else {
        showLoading();
        CentralRepository.getCustomer(centralId)
            .then(handleCustomerResponse)
            .catch(handleCustomerError);
    }

    function showListCustomer(response) {

        elementProperty.getElement("#resultTable", element => {
            if (!response?.data?.length) {
                element.innerHTML = `<tr><td colspan="6" class="text-center">Nenhum cliente encontrado.</td></tr>`;
                return;
            }

            element.innerHTML = (response.data || []).map(customer => {
                // centralCustomer → id real; customer sincronizado → id=null, real ID em customerId
                const cid = customer.id ?? customer.customerId;
                const isActive = customer.customerRegisterStatusId === 1;

                const badgeClass = isActive ? "cust-badge--active" : "cust-badge--blocked";

                const toggleBtn = isActive
                    ? `<button type="button" class="cust-action-btn cust-action-btn--warn block-customer" value="${cid}">Bloquear</button>`
                    : `<button type="button" class="cust-action-btn unlock-customer" value="${cid}">Desbloquear</button>`;

                return `<tr>
                    <td>${escapeHtml(customer.name)}</td>
                    <td>${formatDocument(getCustomerDocument(customer))}</td>
                    <td>${Mask.setMaskPhoneValue(customer.phone) || '—'}</td>
                    <td>${formatDateOfBirth(customer.dateOfBirth)}</td>
                    <td><span class="cust-badge ${badgeClass}">${escapeHtml(customer.customerRegister)}</span></td>
                    <td>
                        <div class="cust-actions">
                            <a href="/customer/${cid}/edit" class="cust-action-btn">Editar</a>
                            <span class="cust-action-sep">·</span>
                            ${toggleBtn}
                            <span class="cust-action-sep">·</span>
                            <button type="button" class="cust-action-btn cust-action-btn--danger delete-customer" value="${cid}">Excluir</button>
                        </div>
                    </td>
                </tr>`;
            }).join("");

            initEventList();
        });
    }

    function initEventList(){
        elementProperty.addEventInElement(".block-customer", "onclick", function () {
            SwalCustom.dialogConfirm("Deseja bloquear esse cliente").then(() => {
                CentralRepository
                    .blockCustomer(Session
                            .getValueInSession("centralSelected", "id"),
                        this.getAttribute("value")).then(updateListCustomer);
            });
        });

        elementProperty.addEventInElement(".unlock-customer", "onclick", function () {
            SwalCustom.dialogConfirm("Deseja liberar esse cliente").then(() => {
                CentralRepository
                    .releaseCustomer(Session
                            .getValueInSession("centralSelected", "id"),
                        this.getAttribute("value")).then(updateListCustomer);
            });
        });

        elementProperty.addEventInElement(".delete-customer","onclick",function(){
            SwalCustom.dialogConfirm("Deseja excluir esse cliente").then(() => {
                CentralRepository
                    .deleteCustomer(Session
                            .getValueInSession("centralSelected", "id"),
                        this.getAttribute("value")).then(updateListCustomer);
            });
        })
    }

    function createPagination(response) {
        elementProperty.getElement(".container-pagination", element => {

            const enabledPrev = response.prev_page_url == null ? "disabled" : "prev-page";
            const enabledNext = response.next_page_url == null ? "disabled" : "next-page";

            element.innerHTML = `<ul class="pagination">
                                    <li class="page-item ${enabledPrev}">
                                      <a class="page-link" href="#" aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                      </a>
                                    </li>
                                    <li class="page-item ${enabledNext}">
                                      <a class="page-link" href="#" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                      </a>
                                    </li>
                                  </ul>`;

            elementProperty.addEventInElement(".prev-page", "onclick", function () {
                getNewPage(response.current_page - 1);
            });

            elementProperty.addEventInElement(".next-page", "onclick", function () {
                getNewPage(response.current_page + 1);
            });
        });
    }

    function getNewPage(page) {
        showLoading();
        CentralRepository.getCustomer(Session.getValueInSession("centralSelected", "id"), getFilterConfig(page))
            .then(handleCustomerResponse)
            .catch(handleCustomerError);
    }

    elementProperty.addEventInElement("#openAddCustomer", "onclick", function () {
        viewController.elementProperty.addClass(".modal-create-customer", "active");
    });

    elementProperty.addEventInElement(".radio-type-filter", "onclick", updateListCustomer);

    elementProperty.addEventInElement("#filterCustomer", "oninput", function () {

        clearTimeout(manager.timeoutFilter);

        manager.timeoutFilter = setTimeout(() => {
            updateListCustomer();
        }, 500);
    });

    function updateListCustomer() {
        showLoading();
        CentralRepository.getCustomer(Session.getValueInSession("centralSelected", "id"), getFilterConfig(1))
            .then(handleCustomerResponse)
            .catch(handleCustomerError);
    }
});
