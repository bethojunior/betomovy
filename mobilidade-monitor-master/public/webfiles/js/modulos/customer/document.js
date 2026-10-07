document.addEventListener("DOMContentLoaded", function () {

    const CUSTOMER_TYPE = 5;

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
                showDocumentChecked();
            });
        });
    }

    function showDocumentChecked() {
        preload(true);
        DocumentController.getByUserType(CUSTOMER_TYPE).then(({response}) => {
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
    }

    elementProperty.addEventInElement("#addDocInDriver", "onclick", function () {
        const userTypeId = CUSTOMER_TYPE;

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