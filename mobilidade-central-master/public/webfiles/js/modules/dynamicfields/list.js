let idCentral = Session.getValueInSession("centralSelected", "id");
let idQuestion = 0;
const elementProperty = new ElementProperty();

const getCentralId = () => Session.getValueInSession("centralSelected", "id") || idCentral;

const escapeHtml = (str) => str
    ? String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
    : '';

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
            const titleQuestion = (document.getElementById(`title-field-edit`).value || '').trim();
            const requiredQuestion = document.getElementById(`required-field-edit`).value;
            if (titleQuestion === '') {
                SwalCustom.messageDialog(
                    "",
                    "Digite o título da pergunta",
                    undefined,
                    "info"
                );
                return;
            }

            const data = {
                title: titleQuestion,
                required: requiredQuestion == 1 ? true : false,
            };

            const centralId = getCentralId();
            preload(true);
            DynamicFieldsController.edit(centralId, idQuestion, data).then((status) => {
                preload(false);
                if (status && status.status === false) {
                    SwalCustom.messageDialog(
                        "",
                        status.message || "Não foi possível editar o campo na central",
                        undefined,
                        "error"
                    );
                    return;
                }

                $("#modalFieldEdit").modal("hide");
                SwalCustom.messageDialog("", "Campo dinâmico atualizado com sucesso!", undefined, "success");
                listFields();
            }).catch(() => {
                preload(false);
                SwalCustom.messageDialog("", "Erro ao editar campo na central", undefined, "error");
            });
        }
    );
}

function listFields() {
    const centralId = getCentralId();
    elementProperty.getElement("#resultTable", (element) => {
        preload(true);
        DynamicFieldsController.get(centralId).then((response) => {
            const items = response?.response ?? response?.data ?? (Array.isArray(response) ? response : []);

            if (!Array.isArray(items) || items.length === 0) {
                element.innerHTML = `<tr>
                    <td colspan="5" class="text-center p-4 text-muted" style="text-align: center; padding: 32px 16px;">
                        <i class="material-icons" style="font-size: 40px; color: #94a3b8; display: block; margin: 0 auto 8px;">dynamic_form</i>
                        <p style="margin: 0; font-size: 14px; color: #64748b;">Nenhum campo dinâmico cadastrado no momento.</p>
                        <small style="color: #94a3b8;">Clique em "+ Adicionar campo" acima para criar perguntas personalizadas.</small>
                    </td>
                </tr>`;
                preload(false);
                return;
            }

            element.innerHTML = items
                .map((fields) => {
                    const isRequired = fields.required == 1 || fields.required === true;
                    return `<tr>
                    <td></td>
                    <td>${escapeHtml(fields.title)}</td>
                    <td>
                        <span class="badge ${isRequired ? 'badge-primary' : 'badge-light'}" style="padding: 6px 12px; font-size: 12px; font-weight: 600; border-radius: 6px; ${isRequired ? 'background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe;' : 'background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0;'}">
                            ${isRequired ? "Obrigatória" : "Opcional"}
                        </span>
                    </td>
                    <td>
                        <button type="button" class="btn btn-warning edit-field" value="${fields.id}">Editar</button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger remove-fields-driver" value="${fields.id}">Excluir</button>
                    </td>
                  </tr>`;
                })
                .join("");

            removeField();

            elementProperty.addEventInElement('.edit-field', 'onclick', function () {
                const value = this.getAttribute("value");
                idQuestion = value;
                preload(true);
                DynamicFieldsController.questionById(centralId, idQuestion).then((response) => {
                    const q = response?.response ?? response?.data ?? response;
                    if (q) {
                        document.getElementById(`title-field-edit`).value = q.title || '';
                        document.getElementById(`required-field-edit`).value = (q.required == 1 || q.required === true) ? "1" : "0";
                    }
                    preload(false);
                    $("#modalFieldEdit").modal("show");
                }).catch(() => {
                    preload(false);
                    SwalCustom.messageDialog("", "Não foi possível carregar os detalhes do campo", undefined, "error");
                });
            });

            preload(false);
        }).catch((err) => {
            console.error("Erro ao listar campos:", err);
            element.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-danger">Não foi possível carregar os campos dinâmicos.</td></tr>`;
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
            const row = this.closest("tr");
            SwalCustom.dialogConfirm(
                "",
                "Deseja remover essa pergunta do chamado?"
            ).then(() => {
                const centralId = getCentralId();
                preload(true);
                DynamicFieldsController.remove(centralId, value).then((res) => {
                    preload(false);
                    if (res && res.status === false) {
                        SwalCustom.messageDialog("", res.message || "Erro ao remover campo", undefined, "error");
                        return;
                    }
                    if (row) row.remove();
                    SwalCustom.messageDialog("", "Campo removido com sucesso!", undefined, "success");
                    listFields();
                }).catch(() => {
                    preload(false);
                    SwalCustom.messageDialog("", "Erro ao remover campo", undefined, "error");
                });
            });
        }
    );
}

function addFieldsDynamic() {
    elementProperty.addEventInElement("#addFields", "onclick", function () {
        const titleQuestion = (document.getElementById(`title-fields`).value || '').trim();
        const requiredQuestion = document.getElementById(`required-fields`).value;
        if (titleQuestion === '') {
            SwalCustom.messageDialog(
                "",
                "Digite o título da pergunta",
                undefined,
                "info"
            );
            return;
        }

        const data = {
            title: titleQuestion,
            required: requiredQuestion == 1 ? true : false,
        };

        const centralId = getCentralId();
        preload(true);
        DynamicFieldsController.insert(centralId, data).then((status) => {
            preload(false);
            if (status && status.status === false) {
                SwalCustom.messageDialog(
                    "",
                    status.message || "Não foi possível adicionar o campo na central",
                    undefined,
                    "error"
                );
                return;
            }

            document.getElementById(`title-fields`).value = '';
            document.getElementById(`required-fields`).value = "0";
            $("#modalAddFields").modal("hide");
            SwalCustom.messageDialog("", "Campo dinâmico adicionado com sucesso!", undefined, "success");
            listFields();
        }).catch(() => {
            preload(false);
            SwalCustom.messageDialog("", "Erro ao adicionar campo dinâmico", undefined, "error");
        });
    });
}
