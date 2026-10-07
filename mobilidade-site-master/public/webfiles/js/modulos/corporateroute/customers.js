document.addEventListener("DOMContentLoaded", function () {
    const user = Session.get("user");
    Mask.setMaskCpf("#documentCustomer");
    Mask.setMaskPhone("#phoneCustomer");

    const elementProperty = new ElementProperty();

    updateListCustomer();

    elementProperty.addEventInElement("#btnOpenCustomerModal", "onclick", function () {
        let placeSelected = null;
        $('#modalAddCustomer').modal('open');

        document.querySelector("#formAddCustomer").onsubmit = function (event) {
            event.preventDefault();

            const button = document.querySelector("#btnSaveCustomer");

            const data = {
                "name": document.querySelector("#nameCustomer").value,
                "document": document.querySelector("#documentCustomer").value,
                "phone": document.querySelector("#phoneCustomer").value,
                "companyId": user.company_worker.companyId
            };

            if (!checkCPF(data.document))
                return alert("CPF invalído!");

            if (placeSelected === null)
                return alert("Selecione um endereço de embarque");

            button.disabled = true;

            if (placeSelected.latitude == null && placeSelected.longitude == null) {
                PlaceController.getDetailPlace(placeSelected.address).then(({data: result}) => {
                    data.address = result.address;
                    data.latitude = result.latitude;
                    data.longitude = result.longitude;

                    saveCustomer();
                })
            } else {

                data.address = placeSelected.address;
                data.latitude = placeSelected.latitude;
                data.longitude = placeSelected.longitude;

                saveCustomer();
            }

            function saveCustomer() {
                CorporateRouteCustomerController.insertCustomer(data).then(({status, message}) => {
                    button.disabled = false;

                    SwalCustom.messageDialog("", message, () => {
                        if (status) {
                            $('#modalAddCustomer').modal('close');
                            document.querySelector("#nameCustomer").value = "";
                            document.querySelector("#documentCustomer").value = "";
                            document.querySelector("#addressCustomer").value = "";
                            document.querySelector("#listLocal").innerHTML = "";
                            updateListCustomer();
                        }
                    }, status ? "success" : "info")
                }).catch(({message, response}) => {
                    button.disabled = false;
                    SwalCustom.messageDialog("", "Ocorreu um erro ao cadastra o cliente", undefined, "info");
                })
            }
        };

        document.querySelector("#btnSearchPlace").onclick = function () {
            const value = document.querySelector("#addressCustomer").value;
            if (value.length === 0)
                return;
            PlaceController.searching(value, `0,0`).then(({data}) => {
                document.querySelector("#listLocal").innerHTML = data.map(local => {
                    return `<li style="cursor:pointer;" class="item-local collection-item" value='${btoa(JSON.stringify(local))}'>${local.address}</li>`
                }).join("");

                document.querySelectorAll(".item-local").forEach(element => {
                    element.addEventListener("click", function (event) {
                        elementProperty.removeClass(".item-local", "active");
                        this.classList.add("active");
                        placeSelected = JSON.parse(atob(event.target.getAttribute("value")));
                        document.querySelector("#addressCustomer").value = placeSelected.address;
                    });
                })
            });
        };
    });

    function updateListCustomer() {
        CorporateRouteCustomerController.getCustomers(user.company_worker.companyId).then(({response}) => {
            document.querySelector("#listCustomers").innerHTML = response.map(item => {
                return `<tr>
                        <td>${item.name}</td>
                        <td>${item.document}</td>
                        <td>${item.address}</td>
                        <td>
                            <a href="#" class="remove-local" value="${item.id}"><i class="material-icons">delete</i> </a>
                        </td>
                    </tr>`
            }).join("");

            elementProperty.addEventInElement(".remove-local","onclick",function () {
                const id = this.getAttribute("value");
                SwalCustom.dialogConfirm("Deseja excluir esse cliente","",status=>{
                    if(status){
                        this.parentNode.parentNode.remove();
                        CorporateRouteCustomerController.deleteCustomer(id);
                    }
                })
            });
        });
    }


    $('.modal').modal();

});