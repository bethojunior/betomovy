document.addEventListener("DOMContentLoaded", function () {
    const elementProperty = new ElementProperty();
    let customers = [];
    let currentQueryId = 0;

    const manager = {
        timeoutFind: null,
        customerId: Session.getValueInSession("centralSelected", "id")
    };

    const escapeHtml = (value) => String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    elementProperty.addEventInElement("#findCustomerBy", "oninput", function () {

        clearTimeout(manager.timeoutFind);

        manager.timeoutFind = setTimeout(updateListCustomer, 300);
    });

    elementProperty.addEventInElement("#closeModalFindCustomer", "onclick", function() {
        closeModal()
        // Usa utilitário que verifica o estado do menu antes de alterar o botão
        updateBtnCallTripVisibility();
    });

    elementProperty.addEventInElement("#openModalCreateCustomer", "onclick", function () {
        viewController.elementProperty.addClass(".modal-create-customer", "active");
        document.querySelector("#nameCustomer").focus();
    });

    function closeModal() {
        viewController.elementProperty.removeClass(".btn-call-tripy", "active");
        elementProperty.removeClass(".modal-find-customer", "active");
        document.getElementById("findCustomerBy").value = "";
        document.getElementById("listCustomer").innerHTML = "";
        document.querySelector("input[name='find-customer-by']").checked = true;
    }

    function updateListCustomer() {
        const type = document.querySelector("input[name='find-customer-by']:checked").value;
        const search = document.getElementById("findCustomerBy").value.trim();
        const queryId = ++currentQueryId;

        const config = {
            page: 1,
            filter: {}
        };

        config.filter[type] = search;

        CentralRepository.getCustomer(manager.customerId, config)
            .then(({status, response, message}) => {
                if (queryId !== currentQueryId) return;
                elementProperty.getElement("#listCustomer", element => {
                    if (!status || !response) {
                        customers = [];
                        element.innerHTML = `<li class="mfc-empty">${escapeHtml(message || "Erro ao buscar clientes.")}</li>`;
                        return;
                    }

                    customers = response.data || [];

                    if (customers.length === 0) {
                        element.innerHTML = `<li class="mfc-empty">Nenhum cliente encontrado.</li>`;
                        return;
                    }

                    element.innerHTML = customers.map((customer, index) => {
                        return `<li class="select-customer" data-index="${index}">
                            <div>
                                <p><span>Nome:</span><span>${escapeHtml(customer.name)}</span></p>
                                <p><span>Telefone:</span><span>${escapeHtml(customer.phone)}</span></p>
                                <p><span>CPF:</span><span>${escapeHtml(customer.document || "Não informado")}</span></p>
                            </div>
                            <i class="material-icons">arrow_forward_ios</i>
                        </li>`;
                    }).join("");

                    elementProperty.addEventInElement(".select-customer", "onclick", function () {
                        const customer = customers[parseInt(this.dataset.index, 10)];
                        if (!customer) {
                            return;
                        }

                        document.querySelector(".add-place-stop").removeAttribute("hidden")
                        Session.set("neighborhoodRides", "0");
                        trip.customer = customer;
                        document.querySelector(".modal-find-customer").classList.remove("active");
                        getPlaceCustomer();
                    });
                });
            }).catch((error) => {
                if (queryId !== currentQueryId) return;
                console.error("customer/selectCustomer:", error);
                elementProperty.getElement("#listCustomer", element => {
                    customers = [];
                    element.innerHTML = `<li class="mfc-empty">Erro ao buscar clientes.</li>`;
                });
            });
    }
});
