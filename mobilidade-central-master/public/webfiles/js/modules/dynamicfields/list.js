const idCentral = Session.getValueInSession("centralSelected", "id");
let idQuestion = 0;
const elementProperty = new ElementProperty();

document.addEventListener("DOMContentLoaded", function () {
    addFieldsDynamic();
    listFields();
    editField();
});

function editField() {
    elementProperty.addEventInElement(
        "#editFields",
        "onclick",
        function () {
            const titleQuestion = document.getElementById(`title-field-edit`).value;
            const requiredQuestion = document.getElementById(`required-field-edit`).value;
            if(titleQuestion == ''){
                SwalCustom.messageDialog(
                    "",
                    "Digite o titulo da pergunta",
                    undefined,
                    "info"
                );
                return;
            }

            const data = {
                title: titleQuestion,
                required: requiredQuestion == 1 ? true : false,
            };
            DynamicFieldsController.edit(idCentral, idQuestion, data).then((status) => {
                if (!status) {
                    SwalCustom.messageDialog(
                        "",
                        " Não foi possivel editar o campo na central",
                        undefined,
                        "info"
                    );
                }

                $("#modalFieldEdit").modal("hide");
                return listFields();
            });
        });
}

function listFields() {
    elementProperty.getElement("#resultTable", (element) => {
        preload(true);
        DynamicFieldsController.get(idCentral).then((response) => {
            element.innerHTML = response.response
                .map((fields) => {
                    return `<tr>
                    <td></td>
                    <td>${fields.title}</td>
                    <td>${
                        fields.required == 1 ? "Obrigatória" : "Opcional"
                    }</td>
                    <td><button
                    type="button"
                    class="btn btn-warning edit-field" value="${fields.id}">Editar
                    </button>
                    </td>
                    <td>
                    <button
                    type="button"
                    class="btn btn-danger remove-fields-driver" value="${fields.id}">Excluir
                    </button></td>
                  </tr>`;
                })
                .join("");

            removeField();
            elementProperty.addEventInElement('.edit-field', 'onclick', function () {
                const value = this.getAttribute("value");
                idQuestion = value;
                preload(true);
                DynamicFieldsController.questionById(idCentral, idQuestion).then((response) => {
                    document.getElementById(`title-field-edit`).value = response.response.title;
                    document.getElementById(`required-field-edit`).value = response.response.required;
                preload(false);
                });
                $("#modalFieldEdit").modal("show");
            });
            preload(false);
        });
    });
}

function removeField() {
    elementProperty.addEventInElement(
        ".remove-fields-driver",
        "onclick",
        function () {
            const value = this.getAttribute("value");
            SwalCustom.dialogConfirm(
                "",
                "Deseja remover essa pergunta do chamado?"
            ).then(() => {
                DynamicFieldsController.remove(idCentral, value);
                this.parentElement.parentElement.remove();
            });
        }
    );
}


function addFieldsDynamic() {
    elementProperty.addEventInElement("#addFields", "onclick", function () {
        const titleQuestion = document.getElementById(`title-fields`).value;
        const requiredQuestion = document.getElementById(`required-fields`).value;
        if(titleQuestion == ''){
            SwalCustom.messageDialog(
                "",
                "Digite o titulo da pergunta",
                undefined,
                "info"
            );
            return;
        }

        const data = {
            title: titleQuestion,
            required: requiredQuestion == 1 ? true : false,
        };

        DynamicFieldsController.insert(idCentral, data).then((status) => {
            if (!status) {
                SwalCustom.messageDialog(
                    "",
                    "Não foi possível adicionar o campo na central",
                    undefined,
                    "info"
                );
                return;
            }

            document.getElementById(`title-fields`).value = null;
            document.getElementById(`required-fields`).value = 0;
            $("#modalAddFields").modal("hide");
            listFields();
        });
    });
}
