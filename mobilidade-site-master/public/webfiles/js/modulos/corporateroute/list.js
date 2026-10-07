document.addEventListener("DOMContentLoaded", function () {
    const user = Session.get("user");
    Mask.setMaskCpf("#documentCustomer");

    const elementProperty = new ElementProperty();

    function list() {
        ScheduleCorporateRouteController.list(user.company_worker.companyId).then(({response}) => {
            document.querySelector("#listCorporateRoute").innerHTML = response.map(item => {
                return `<tr>
                <td>${item.title}</td>
                <td>${item.corporate_route.route.name}</td>
                <td>${item.schedule}</td>
                <td>${item.vacancies}</td>
                <td><a href="#" value="${btoa(JSON.stringify(item))}" class="customers-modal">Passageiros</a></td>
                <td><a href="#" value="${btoa(JSON.stringify(item))}" class="edit-schedule-corporate-route">Editar</a></td>
                <td><a href="#" value="${item.id}" class="remove-schedule-corporate-route">Excluir</a></td>
            </tr>`;
            }).join("");

            document.querySelectorAll(".customers-modal").forEach(element => {
                element.addEventListener("click", function (event) {

                    event.preventDefault();
                    const schedule = JSON.parse(atob(this.getAttribute("value")));
                    updateListCustomer(schedule)
                });
            });

            document.querySelectorAll(".edit-schedule-corporate-route").forEach(element => {
                element.addEventListener("click", function (event) {
                    event.preventDefault();
                    sessionStorage.setItem("scheduleCorporateRoute", this.getAttribute("value"));
                    location.href = "/corporateroute/edit"
                });
            });

            document.querySelectorAll(".remove-schedule-corporate-route").forEach(element => {
                element.addEventListener("click", function (event) {
                    event.preventDefault();
                    const id = this.getAttribute("value");
                    SwalCustom.dialogConfirm("Deseja remove esse agendamento?", "", status => {
                        if (status) {
                            this.parentNode.parentNode.remove();
                            ScheduleCorporateRouteController.delete(id);
                        }
                    })
                });
            })
        })
    }

    function updateListCustomer(schedule) {
        let customer = null;
        $('#modalCustomers').modal('open');
        showPreloadCustomer();
        ScheduleCorporateRouteController.getCustomersByRoute(schedule.id).then(({response}) => {
            const element = document.querySelector("#listCustomers");

            if (response.length > 0) {
                element.innerHTML = response.map(item => {
                    return `<li class="collection-item">
                                <div class="row">
                                    <div class="col s3">
                                        <p>Nome:${item.corporate_route_customer.name}</p>
                                        <p>CPF:${item.corporate_route_customer.document}</p>
                                    </div>
                                    <div class="col s6"><p>${item.corporate_route_customer.address}</p></div>
                                    <div class="col s3">
                                        <p>
                                            <a href="#" class="remove-customer" value="${item.id}"><i class="material-icons">delete</i></a>
                                        </p>
                                    </div>
                                </div>
                            </li>`
                }).join("");

                elementProperty.addEventInElement(".remove-customer", "onclick", function (event) {
                    event.preventDefault();
                    SwalCustom.dialogConfirm("Deseja remove esse cliente", "", status => {
                        if (status) {
                            event.target.parentNode.parentNode.parentNode.parentNode.remove();
                            ScheduleCorporateRouteController.deleteCustomer(this.getAttribute("value")).then(() => {
                                updateListCustomer(schedule)
                            });
                        }
                    })
                });
            } else {
                element.innerHTML = `<li class="collection-item center">Nenhum passageiro cadastro!</li>`;
            }
        });

        document.querySelector("#openModalAddCustomer").onclick = function () {
            document.querySelector("#nameCustomer").value = "";
            document.querySelector("#documentCustomer").value = "";
            customer = null;
            $('#modalAddCustomer').modal('open');
        };

        elementProperty.addEventInElement("#btnSearchCustomer", "onclick", function () {

            const cpf = document.querySelector("#documentCustomer").value;

            if (!checkCPF(cpf))
                return alert("CPF está inválido");

            this.disabled = true;
            const element = document.querySelector("#nameCustomer");
            element.value = "";

            CorporateRouteCustomerController.getByDocument(user.company_worker.companyId, cpf)
                .then(({status, response}) => {
                    if (!status) {
                        SwalCustom.messageDialog("", "Cliente não encontrado");
                    } else {
                        customer = response;
                        element.value = response.name;
                    }
                })
                .catch(({message}) => {
                    SwalCustom.dialogConfirm("Usuário não encontrado", "Deseja inserir esse usuário ?", status => {
                        if (status) {
                            location.href = "/corporateroute/customers/"
                        }
                    })
                })
                .finally(() => {
                    this.disabled = false;
                })
        });

        elementProperty.addEventInElement("#btnSaveCustomer", "onclick", function () {
            if (!customer)
                return alert("Informe o cpf para poder encontrar o cliente");
            this.disabled = true;
            ScheduleCorporateRouteController.insertCustomer({
                scheduleCorporateRouteId: schedule.id,
                corporateRouteCustomerId: customer.id
            })
                .then(({status, message}) => {
                    SwalCustom.messageDialog("", message, () => {
                        if (status) {
                            document.querySelector("#nameCustomer").value = "";
                            document.querySelector("#documentCustomer").value = "";
                            customer = null;
                            $('#modalAddCustomer').modal('close');
                            updateListCustomer(schedule)
                        }
                    }, status ? "success" : "info");
                })
                .catch(({message,response}) => {
                    SwalCustom.messageDialog(response ? response[0] || "" : "", message)
                })
                .finally(() => {
                    this.disabled = false;
                })
        });
    }

    list();

    function showPreloadCustomer() {
        document.querySelector("#listCustomers").innerHTML = `<li>
                    <br/>
                    <div class="row">
                        <div class="col s5"></div>
                        <div class="col s2">
                            <div class="preloader-wrapper small active">
                                <div class="spinner-layer spinner-blue-only center-align">
                                    <div class="circle-clipper left">
                                        <div class="circle"></div>
                                    </div>
                                    <div class="gap-patch">
                                        <div class="circle"></div>
                                    </div>
                                    <div class="circle-clipper right">
                                        <div class="circle"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>`;
    }

    $('.modal').modal();
});