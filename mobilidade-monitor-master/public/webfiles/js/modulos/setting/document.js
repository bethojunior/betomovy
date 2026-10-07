document.addEventListener("DOMContentLoaded", function () {

    getAllDocuments();

    function getAllDocuments() {
        preload(true);
        DocumentController.getAll().then(({response}) => {
            elementProperty.getElement("#listDocuments", element => {
                element.innerHTML = response.map(item => {
                    return `<tr>
                                <th scope="row">${item.label}</th>
                                <th scope="row">${item.description || ""}</th>
                                <th scope="row">${item.link || ""}</th>
                                <td><input type="checkbox" ${item.image == true ? "checked" : ""} disabled></td>
                                <td><input type="checkbox" ${item.text == true ? "checked" : ""} disabled></td>
                                <td><input type="checkbox" ${item.pdf == true ? "checked" : ""} disabled></td>
                                <td><a class="remove-document" href="#" value="${item.id}"><i class="material-icons">delete</i></a></td>
                                <td>
                                    <a class="edit-document" value='${JSON.stringify(item)}' href="#">
                                        <i class="material-icons">edit</i>
                                    </a>
                                </td>
                            </tr>`;
                }).join("");

                initEvent();
            });
        }).finally(() => {
            preload(false);
        });
    }

    function initEvent() {
        elementProperty.addEventInElement(".remove-document", "onclick", function (event) {
            event.preventDefault();
            SwalCustom.confirm("Deseja remover o documento?").then(() => {
                preload(true);
                DocumentController.delete(this.getAttribute("value")).then(({status, message}) => {
                    SwalCustom.messageDialog("", message, status ? "success" : "info").then(getAllDocuments);
                }).finally(() => {
                    preload(false);
                });
            })
        });

        elementProperty.addEventInElement(".edit-document", "onclick", function (event) {
            event.preventDefault();

            const data = JSON.parse(this.getAttribute("value"));

            document.querySelector("#idDocumentEdit").value = data.id;
            document.querySelector("#nameDocumentEdit").value = data.label;
            document.querySelector("#linkDocumentEdit").value = data.link;
            document.querySelector("#descriptionDocumentEdit").value = data.description;
            document.querySelector("#imageCheckEdit").checked = data.image;
            document.querySelector("#textCheckEdit").checked = data.text;
            document.querySelector("#pdfCheckEdit").checked = data.pdf;

            $('#editDocumentModal').modal('show');
        });
    }

    elementProperty.addEventInElement("#addDocument", "onsubmit", function (event) {
        event.preventDefault();

        const data = {
            label: document.querySelector("#nameDocument").value,
            link: document.querySelector("#linkDocument").value,
            description: document.querySelector("#descriptionDocument").value,
            image: document.querySelector("#imageCheck").checked,
            text: document.querySelector("#textCheck").checked,
            pdf: document.querySelector("#pdfCheck").checked
        };

        if (data.link.length > 0)
            if (!validURL(data.link))
                return alert("O link de suporte está inválido!");

        if (data.description.length === 0)
            delete data.description;

        if (!data.image && !data.text && !data.pdf)
            return alert("Informe pelo menos uma forma de obter o documento");

        $('#addDocumentModal').modal('hide');

        preload(true);

        DocumentController.insert(data).then(({status, message}) => {
            SwalCustom.messageDialog("", message, status ? "success" : "info");
            getAllDocuments();
        }).finally(() => {
            preload(true);
        })
    });

    elementProperty.addEventInElement("#editDocument", "onsubmit", function (event) {
        event.preventDefault();

        const data = {
            label: document.querySelector("#nameDocumentEdit").value,
            link: document.querySelector("#linkDocumentEdit").value,
            description: document.querySelector("#descriptionDocumentEdit").value,
            image: document.querySelector("#imageCheckEdit").checked,
            text: document.querySelector("#textCheckEdit").checked,
            pdf: document.querySelector("#pdfCheckEdit").checked
        };

        if (data.link.length > 0)
            if (!validURL(data.link))
                return alert("O link de suporte está inválido!");

        if (data.description.length === 0)
            delete data.description;

        if (!data.image && !data.text && !data.pdf)
            return alert("Informe pelo menos uma forma de obter o documento");

        $('#editDocumentModal').modal('hide');

        preload(true);

        DocumentController.update(document.querySelector("#idDocumentEdit").value, data)
            .then(({status, message}) => {
                SwalCustom.messageDialog("", message, status ? "success" : "info");
                getAllDocuments();
            }).finally(() => {
            preload(true);
        })
    });

    function validURL(str) {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    }
});