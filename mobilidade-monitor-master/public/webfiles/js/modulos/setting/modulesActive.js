document.addEventListener("DOMContentLoaded", function () {
  list();

  function updateModuleStatus(checked, payload, element) {
    const action = checked ? "ativar" : "desativar";
    const successMessage = checked
      ? "Módulo ativado com sucesso!"
      : "Módulo desativado com sucesso!";

    return SwalCustom.confirm(`Deseja ${action} esse módulo?`).then(
      (status) => {
        preload(true);
        if (status) {
          return ModulesActiveController.update(payload).then((response) => {
            preload(false);
            if (response.status) {
              return SwalCustom.messageDialog(
                "Sucesso",
                successMessage,
                "success"
              );
            }

            element.checked = !checked;
            return SwalCustom.messageDialog(
              "Erro",
              "Erro ao atualizar o módulo",
              "error"
            );
          });
        }
      }
    );
  }

  function list() {
    preload(true);
    ModulesActiveController.findAll().then(({ response }) => {
      preload(false);
      document.querySelector("#list").innerHTML = response
        .map((item) => {
          const itemData = JSON.stringify(item);
          return `<tr>
                            <td></td>
                            <td>${item?.name}</td>
                            <td>
                                <img src="${
                                  item?.logo
                                }" alt="Avatar" class="img-fluid rounded-circle" width="50" height="50" />

                                <button data-toggle="modal" data-target="#editLogoModal" class="edit-logo-btn" data-id="${
                                  item.id
                                }" data-item='${itemData}'><i data-item='${itemData}' class="material-icons  edit-logo">edit</i></button>

                            </td>
                            <td class="d-flex justify-content-between">
                                <div class="custom-control custom-switch">
                                    <input type="checkbox" class="custom-control-input change-status-modules-active" ${
                                      !!item?.isActive ? "checked" : ""
                                    } id="${item.id}" logosrc="${
            item?.logo
          }" isactive="${!!item?.isActive}" name="${item?.name}" >
                                    <label class="custom-control-label" for="${
                                      item.id
                                    }"></label>
                                </div>
                            </td>
                        </tr>`;
        })
        .join("");

      elementProperty.addEventInElement(
        ".change-status-modules-active",
        "onclick",
        function (e) {
          const formData = new FormData();
          formData.append("id", Number(this.getAttribute("id")));
          formData.append(
            "isActive",
            this.getAttribute("isactive") === "true" ? 0 : 1
          );
          formData.append("name", this.getAttribute("name"));

          if (e?.target?.checked) {
            updateModuleStatus(true, formData, this).catch(() => {
              this.checked = false;
            });
          } else {
            updateModuleStatus(false, formData, this).catch(() => {
              this.checked = true;
            });
          }
        }
      );
    });
  }

  document.querySelector("body").addEventListener("click", function (e) {
    if (
      e.target.classList.contains("edit-logo-btn") ||
      e.target.classList.contains("edit-logo")
    ) {
      const itemData = e.target.getAttribute("data-item");
      document
        .getElementById("saveNewLogo")
        .setAttribute("data-item", itemData);
    }
  });

  async function changeUpdatePhoto(fileNew, fileOld) {
    const temporaryFileReader = new FileReader();
    temporaryFileReader.readAsDataURL(
      fileNew
    );
    temporaryFileReader.onload = function (e) {
      const img = document.querySelector(`img[src="${fileOld}"]`);
      img.src = e.target.result;
    };
  }

  document
    .getElementById("saveNewLogo")
    .addEventListener("click", function (e) {
      const itemData = e.target.getAttribute("data-item");
      const item = JSON.parse(itemData);
      const file = document.getElementById("newLogoFile").files[0];
      const formData = new FormData();
      formData.append("logo", file);
      formData.append("id", Number(item.id));
      formData.append("isActive", item.isActive);
      formData.append("name", item?.name);

      preload(true);
      ModulesActiveController.update(formData)
        .then(async (response) => {
          preload(false);
          if (response.status) {
            changeUpdatePhoto(file, item?.logo)
            document.getElementById("newLogoFile").value = "";
            document.getElementById("editLogoModal").classList.remove("show");
            document
              .getElementById("editLogoModal")
              .setAttribute("aria-hidden", "true");
            document
              .getElementById("editLogoModal")
              .setAttribute("style", "display: none");
            document.querySelector(".modal-backdrop").remove();
            SwalCustom.messageDialog(
              "Sucesso",
              "Logo atualizado com sucesso!",
              "success"
            );
          } else {
            SwalCustom.messageDialog(
              "Erro",
              "Erro ao atualizar o logo",
              "error"
            );
          }
        })
        .catch(() => {
          preload(false);
        });
    });
});
