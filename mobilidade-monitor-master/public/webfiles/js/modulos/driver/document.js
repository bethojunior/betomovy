document.addEventListener("DOMContentLoaded", function () {

    getAllDocuments();

    function getAllDocuments() {
        preload(true);
        DocumentController.getAll().then(({response}) => {
            elementProperty.getElement("#listDocuments", element => {
                element.innerHTML += response.map(item => {
                    return `<li class="list-group-item">
                                <div class="d-flex">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="${item.id}" id="document${item.id}">
                                         <label for="document${item.id}">${item.label}</label>
                                    </div>
                                    <p class="mb-1"></p>
                                </div>
                                <small>${item.description || ""}</small>
                            </li>`;
                }).join("");
            });
        }).finally(() => {
            preload(false);
        });
    }

    UserController.userTypeDrivers().then(({response}) => {
        elementProperty.getElement("#driverControlSelect", element => {
            element.innerHTML = `<option value="" selected disabled>Selecione o tipo de motorista</option>` +
                response.map(item => {
                    return `<option value="${item.idUserType}">${item.name}</option>`;
                }).join("")
        })
    });

    elementProperty.addEventInElement("#driverControlSelect", "onchange", function () {
        preload(true);
        DocumentController.getByUserType(this.value).then(({response}) => {
            document.querySelector("#formSelected").style.display = "block";
            elementProperty.getElement(".form-check-input", element => {
                element.checked = false;
            });

            response.map(item => {
                document.querySelector(`#document${item.docId}`).checked = true;
            })
        }).finally(() => {
            preload(false);
        })
    });

    elementProperty.addEventInElement("#addDocInDriver", "onclick", function () {
        const userTypeId = document.querySelector("#driverControlSelect").value;

        const documents = elementProperty.getElements(".form-check-input").filter(element => {
            return element.checked
        }).map(element => {
            return {userTypeId, docId: element.value}
        });

        preload(true);

        DocumentController.insertDocUserType(userTypeId, documents).then(({status, message}) => {
            SwalCustom.messageDialog("", message, status ? "success" : "info");
        }).finally(() => {
            preload(false);
        });
    });
});