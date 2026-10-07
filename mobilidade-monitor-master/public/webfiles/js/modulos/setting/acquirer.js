document.addEventListener("DOMContentLoaded", () => {
    preload(true);
    const isRoot = Session.get('user').roleId

    getData();

    async function getData() {
        const {response: list} = await AcquirerController.getAll();

        document.querySelector("#acquirerList").innerHTML = list.map(item => {
            return `<div class="form-check form-check-inline">
                      <input 
                            class="form-check-input change-acquirer" 
                            type="radio" 
                            name="acquirerRadio" 
                            id="acquirerRadio${item.idFinancialIntermediary}" 
                            value='${JSON.stringify(item)}'
                            ${item.active == true ? "checked" : ""}>
                      <label class="form-check-label" for="acquirerRadio${item.idFinancialIntermediary}">${item.name}</label>
                    </div>`
        }).join("");

        const item = list.find(item => item.active == true);

        showDataForm(item);

        elementProperty.addEventInElement(".change-acquirer", "onclick", function () {
            showDataForm(JSON.parse(this.getAttribute("value")));
        });

        preload(false);
    }

    function showDataForm(item) {

        if (!item) {
            return
        }

        document.querySelector("#containerForm").innerHTML = `
            <div class="card m-2">
              <div class="card-header">
                ${item.name}
              </div>
              <div class="card-body">
                <form id="acquirerForm">
                ${item.acquirer_meta_data.map(data => {

            return `<div class="form-group">
                        <label>${data.description}</label>
                        <input type="text" class="form-control input-value-acquirer" id="${data.key}" value="${data.value || ""}" ${isRoot !== 1 && data.isRoot === 1 ? 'readonly' : ''} required>
                    </div>`
        }).join("")}
                    <div class="d-flex justify-content-end">
                        <button type="submit" class="btn btn-primary" id="btnSaveAcquirer">Salvar</button>
                    </div>
                </form>
              </div>
            </div>
        `;

        elementProperty.addEventInElement("#acquirerForm", "onsubmit", (event) => {
            event.preventDefault();

            swal({
                title: "Confirma alteração de adquirente?",
                text: "Mudança de adquirente pode excluir coletivamente os números dos cartões de crédito dos usuários ja cadastrados, podendo causar falhas ou exigir  recadastramento dos mesmos.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
                buttons: ['Cancelar', 'Confirmar']
            }).then((willConfirm) => {
                if (willConfirm) {
                    const acquirer = JSON.parse(document.querySelector(".change-acquirer:checked").value);

                    const metadata = elementProperty.getElements(".input-value-acquirer").map((element) => {
                        return {value: element.value, key: element.getAttribute("id")}
                    });

                    preload(true);

                    AcquirerController.update(acquirer.idFinancialIntermediary, metadata).then(({status, message}) => {
                        preload(false);
                        SwalCustom.messageDialog("", message, status ? "success" : "info");
                    });

                }
            });
        })
    }
});