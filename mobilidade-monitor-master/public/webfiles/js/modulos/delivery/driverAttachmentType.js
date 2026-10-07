document.addEventListener("DOMContentLoaded", function () {
    $('[data-toggle="tooltip"]').tooltip();
    showListBag();

    function showListBag() {
        preload(true);
        DriverAttachmentTypeController.getAll().then(({response}) => {
            document.querySelector("#list").innerHTML = response.map(item => {
                return `<tr>
                            <td>
                                <div class="position-relative d-flex justify-content-center flex-column">
                                    <input type="file" class="w-100 h-100 position-absolute change-picture-bag" style="opacity: 0; cursor: pointer" bag='${JSON.stringify(item)}'>
                                    <img src="${item.picture}" width="50" height="50" />
                                    <a href="#">Editar</a>
                                 </td>
                            <td>${item.name}</td>
                            <td>${item.description}</td>
                            <td>
                                <div class="custom-control custom-switch">
                                  <input type="checkbox" class="custom-control-input change-status-bag" value='${JSON.stringify(item)}' id="enableBag${item.id}" ${item.active == true ? "checked" : ""}>
                                  <label class="custom-control-label" for="enableBag${item.id}"></label>
                                </div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">
                                    <button type="button" class="btn btn-danger delete-bag mr-2" bag='${JSON.stringify(item)}'>Excluir</button>
                                    <button type="button" class="btn btn-info edit-item-bag" bag='${JSON.stringify(item)}'>Editar</button>
                                </div>
                            </td>
                        </tr>`
            }).join("");
            initEvent();
        }).finally(() => {
            preload(false);
        })
    }

    function initEvent() {
        elementProperty.addEventInElement(".change-status-bag", "onchange", function () {
            const item = JSON.parse(this.getAttribute("value"));
            DriverAttachmentTypeController.changeStatus(item.id, this.checked ? "enable" : "disable");
        });

        elementProperty.addEventInElement(".change-picture-bag", "onchange", function () {
            const item = JSON.parse(this.getAttribute("bag"));
            ImageUpload.resize(this.files[0], 200, 200).then(({data, name}) => {
                const fromData = new FormData();
                fromData.append("picture", data, name);
                preload(true);
                DriverAttachmentTypeController.updatePicture(item.id, fromData).then(({status, message}) => {
                    if (!status) {
                        SwalCustom.messageDialog("", message);
                    }

                    showListBag();
                }).finally(()=>{
                    preload(false)
                })
            });
        });

        elementProperty.addEventInElement(".edit-item-bag", "onclick", function () {
            const item = JSON.parse(this.getAttribute("bag"));

            const modal = $("#editAttachmentType");

            const inputName = document.querySelector("#nameEdit");
            const inputDescription = document.querySelector("#descriptionEdit");

            inputName.value = item.name;
            inputDescription.value = item.description;

            elementProperty.addEventInElement("#editDriverAttachmentType", "onsubmit", function (event) {
                event.preventDefault();
                preload(true);
                DriverAttachmentTypeController.update(item.id, {
                    name: inputName.value,
                    description: inputDescription.value
                }).then(({status, message}) => {
                    SwalCustom.messageDialog("", message, status ? "success" : "info").then(() => {
                        if (status) {
                            modal.modal('hide');
                            showListBag();
                        }
                    });
                }).finally(() => {
                    preload(false)
                });
            });


            modal.modal('show')
        });

        elementProperty.addEventInElement(".delete-bag", "onclick", function () {
            const item = JSON.parse(this.getAttribute("bag"));
            SwalCustom.dialogConfirm("Deseja remover esse item?", "", status => {
                if (status) {
                    preload(true);
                    DriverAttachmentTypeController.delete(item.id).then(({status, message}) => {
                        if (!status)
                            SwalCustom.messageDialog("", message);
                        showListBag();
                    }).finally(() => {
                        preload(false);
                    })
                }
            })
        });
    }

    elementProperty.addEventInElement("#addDriverAttachmentType", "onsubmit", function (event) {
        event.preventDefault();
        const formData = new FormData(document.querySelector("#addDriverAttachmentType"));
        ImageUpload.resize(document.querySelector("#picture").files[0], 200, 200).then(({data, name}) => {
            formData.append("picture", data, name);
            preload(true);
            DriverAttachmentTypeController.insert(formData).then(({status, message}) => {
                SwalCustom.messageDialog("", message, status ? "success" : "info").then(() => {
                    if (status) {
                        $("#addAttachmentType").modal('hide');
                        showListBag();
                    }
                });
            }).finally(() => {
                preload(false)
            });
        });

    });
});