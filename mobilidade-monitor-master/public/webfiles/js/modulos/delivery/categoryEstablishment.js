document.addEventListener("DOMContentLoaded", () => {
    list();

    function list() {
        preload(true);
        CategoryEstablishmentController.getAllCategories().then(({response}) => {
            const list = response.map(item => {
                return `
                    <tr>
                        <td>${item.name}</td>
                        <td class="delimit-line">${item.description}</td>
                        <td>
                            <button category='${JSON.stringify(item)}' type="button" class="btn btn-primary btn-sm edit-category" data-toggle="modal" data-target="#editTypeCategory"><span class="material-icons">
                                mode_edit
                            </span></button>
                            <button idCategory="${item.id}" type="button" class="btn btn-danger btn-sm btn-remove-category"><span class="material-icons">
                                delete
                            </span></button>
                            <button category='${btoa(JSON.stringify(item))}' type="button" class="btn btn-info btn-sm link-sections-in-category">Vincular seção</button>
                        </td> 
                    </tr>
                `
            }).join("");
            preload(false);

            document.querySelector('#listCategories').innerHTML = list;

            elementProperty.addEventInElement('.btn-remove-category', 'onclick', deleteCategory);
            elementProperty.addEventInElement(".edit-category", "onclick", setEditCategoryData);
            elementProperty.addEventInElement(".link-sections-in-category", "onclick", linkSectionsInCategory);
        });

        elementProperty.addEventInElement("#insertCategory", "onclick", addCategory);
    }

    function setEditCategoryData() {
        const category = JSON.parse(this.getAttribute("category"));
        document.querySelector("#editNameCategory").value = category.name;
        document.querySelector("#editDescriptionCategory").value = category.description;
        elementProperty.addEventInElement(".btn-edit-category", "onclick", () => updateCategory(category.id))
    }

    function updateCategory(id) {
        const name = document.querySelector("#editNameCategory").value;
        const description = document.querySelector("#editDescriptionCategory").value;

        const data = {
            name,
            description
        };
        preload(true);
        CategoryEstablishmentController.editCategory(id, data).then(() => {
            preload(false);
            SwalCustom.messageDialog("", "Tipo de categoria editada com sucesso!", "success").then(() => list());
        }).finally(() => {
            $('#editTypeCategory').modal('hide');
        });
    }

    function linkSectionsInCategory() {
        const category = JSON.parse(atob(this.getAttribute("category")));
        preload(true);
        Promise.all([
            DeliverySectionController.findAll(),
            DeliverySectionController.findSectionsByCategory(category.id)
        ]).then((values) => {
            preload(false);

            const [{response: allSections}, {response: sectionsByCategory}] = values;

            document.querySelector("#listSections").innerHTML = allSections.map(section => {
                return `<div class="form-check form-check-inline">
                          <input class="form-check-input" type="checkbox" name="sectionItem" id="inlineSection${section.id}" value="${section.id}">
                          <label class="form-check-label" for="inlineSection${section.id}">${section.name}</label>
                        </div>`;
            }).join("");

            sectionsByCategory.map(item => {
                document.querySelector(`#inlineSection${item.deliverySectionId}`).checked = true;
            })

            elementProperty.addEventInElement("#linkCategoryInSectionForm", "onsubmit", function (event) {
                event.preventDefault();

                const deliverySections = [];

                document.querySelectorAll("input[name='sectionItem']:checked").forEach(element=> deliverySections.push(element.value));

                preload(true);

                DeliverySectionController.linkCategoryInSections(category.id, deliverySections).then(()=>{
                    preload(false);
                    $("#linkCategoryInSectionModal").modal("hide");
                })
            });

            $("#linkCategoryInSectionModal").modal("show");
        })
    }

    function addCategory() {
        const name = document.querySelector("#nameCategory").value;
        const description = document.querySelector("#descriptionCategory").value;

        const data = {
            name,
            description
        };
        preload(true);
        CategoryEstablishmentController.addNewCategory(data).then(() => {
            preload(false);
            SwalCustom.messageDialog("", "Tipo de categoria adicionada com sucesso!", "success").then(() => list());
        }).finally(() => {
            $('#addTypeCategory').modal('hide');
        });
    }

    function deleteCategory() {
        const id = this.getAttribute('idCategory');
        SwalCustom.confirm("Deseja confirmar a exclusão do tipo de categoria?", "Essa ação é irreversivel!")
            .then(() => {
                preload(true);
                CategoryEstablishmentController.deleteCategory(id).then(() => {
                    preload(false);
                    SwalCustom.messageDialog("", "Tipo de categoria excluida com sucesso!", "success").then(() => list());
                });
            });
    }
});