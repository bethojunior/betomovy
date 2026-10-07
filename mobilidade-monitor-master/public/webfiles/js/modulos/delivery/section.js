document.addEventListener("DOMContentLoaded", function () {
    list();

    elementProperty.addEventInElement("#sectionForm", "onsubmit", function (event) {
        event.preventDefault();

        const formData = new FormData();

        formData.append("name", document.querySelector("#name").value);
        formData.append("description", document.querySelector("#description").value);
        formData.append("icon", document.querySelector("#icon").files[0]);

        preload(true);
        DeliverySectionController.store(formData).then(() => {
            preload(false);
            $("#addDeliverySectionModal").modal("hide");
            list();
        });
    });

    function list() {
        preload(true);
        DeliverySectionController.findAll().then(({response}) => {
            preload(false);
            document.querySelector("#list").innerHTML = response.map(item => {
                return `<tr>
                            <td>
                                <img src="${item.icon}" width="25px" height="25px">
                            </td>
                            <td>${item.name}</td>
                            <td>${item.description}</td>
                            <td>
                                <div class="d-flex">
                                    <button type="button" class="btn btn-primary btn-sm edit-delivery-section" item='${btoa(JSON.stringify(item))}'>Editar</button>
                                    <button type="button" class="btn btn-danger btn-sm remove-delivery-section" item='${btoa(JSON.stringify(item))}'>Excluir</button>
                                </div>
                            </td>
                        </tr>`;
            }).join("");

            elementProperty.addEventInElement(".remove-delivery-section", "onclick", function () {
                const item = JSON.parse(atob(this.getAttribute("item")));
                SwalCustom.dialogConfirm("Deseja excluir essa categoria?", "", status => {
                    if (status) {
                        preload(true);
                        DeliverySectionController.delete(item.id).then(()=>{
                            preload(false);
                            list();
                        })
                    }
                });
            });


            elementProperty.addEventInElement(".edit-delivery-section", "onclick", function () {
                const item = JSON.parse(atob(this.getAttribute("item")));

                document.querySelector("#nameEdit").value = item.name;
                document.querySelector("#descriptionEdit").value = item.description;

                $("#editDeliverySectionModal").modal("show");


                elementProperty.addEventInElement("#sectionFormEdit", "onsubmit", function (event) {
                    event.preventDefault();

                    const formData = new FormData();

                    formData.append("name", document.querySelector("#nameEdit").value);
                    formData.append("description", document.querySelector("#descriptionEdit").value);

                    if(document.querySelector("#iconEdit").files.length > 0) {
                        formData.append("icon", document.querySelector("#iconEdit").files[0]);
                    }

                    preload(true);
                    DeliverySectionController.update(item.id,formData).then(() => {
                        preload(false);
                        $("#editDeliverySectionModal").modal("hide");
                        list();
                    });
                });
            });
        });
    }
});