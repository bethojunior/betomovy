document.addEventListener("DOMContentLoaded", function () {
  list();

  function hasPermission(nameGroup, namePermission) {
    const roles = JSON.parse(localStorage.getItem("@roles"));

    if (!roles) {
      return false;
    }

    let hasPermission = false;

    roles.groups.forEach((group) => {
      if (group.name !== nameGroup) {
        return;
      }

      group.permissions.forEach((permission) => {
        if (permission === namePermission) {
          hasPermission = true;
          return;
        }
      });

      if (hasPermission) {
        return;
      }
    });

    return hasPermission;
  }

  function list() {
    function createCardBody(data) {
      return data.map_service_meta_data
        .map((item) => {
          return `<div class="form-group">
                            <label for="${item.key}">${item.description}</label>
                            <input type="text" class="form-control" id="${
                              item.key
                            }" value="${
            item.value || ""
          }" required autocomplete="off">
                        </div>`;
        })
        .join("");
    }

    preload(true);
    MapServiceController.getList().then(({ response }) => {
      preload(false);
      document.querySelector("#mapServiceList").innerHTML = response
        .map((item) => {
          return `<tr>
                    <td>${item.type.toUpperCase()}</td>
                    <td>${item.keys
                      .map((key) => {
                        return `<button type="button" class="btn btn-info btn-sm">${key.value}</button>`;
                      })
                      .join("")}</td>
                    <td>
                        ${
                          hasPermission(
                            "mapa",
                            "deletar_conf_credenciais_cidade"
                          )
                            ? `<button type="button" class="btn btn-danger disable-map-service" groupCode="${item.groupCode}">Excluir</button>`
                            : ""
                        }
                    </td>
                </tr>
                `;
        })
        .join("");

      elementProperty.addEventInElement(
        ".disable-map-service",
        "onclick",
        function () {
          SwalCustom.dialogConfirm(
            "Deseja remover essa credencial?",
            "",
            (status) => {
              if (status) {
                preload(true);
                MapServiceController.disableByGroupCode(
                  this.getAttribute("groupCode")
                ).then(list);
              }
            }
          );
        }
      );
    });

    MapServiceController.getTypes().then(({ response }) => {
      document.querySelector(
        "#mapServiceTypeSelect"
      ).innerHTML = `<option value="" selected disabled>Selecione um tipo de serviço</option>`;
      document.querySelector("#mapServiceTypeSelect").innerHTML += response
        .map((item) => {
          return `<option value="${item.id}" item='${JSON.stringify(item)}'>${
            item.description
          }</option>`;
        })
        .join("");

      elementProperty.addEventInElement(
        "#mapServiceTypeSelect",
        "onchange",
        function () {
          const data = JSON.parse(
            document
              .querySelector("#mapServiceTypeSelect")
              .selectedOptions[0].getAttribute("item")
          );
          document.querySelector("#contentMapService").innerHTML =
            createCardBody(data);
          document.querySelector("#btnSubmitMapService").hidden = false;

          elementProperty.addEventInElement(
            ".form-save-key",
            "onsubmit",
            function (event) {
              event.preventDefault();

              const fields = data.map_service_meta_data.map((item) => {
                return {
                  key: item.key,
                  value: document.querySelector(`#${item.key}`).value,
                };
              });

              preload(true);
              MapServiceController.insert(data.id, fields).then(
                ({ status }) => {
                  preload(false);
                  if (!status)
                    return SwalCustom.messageDialog(
                      "",
                      "Ocorreu um erro ao atualizar a credenciais",
                      "info"
                    );
                  document.querySelector("#contentMapService").innerHTML = "";
                  document.querySelector("#btnSubmitMapService").hidden = true;

                  $("#addMapServiceModal").modal("hide");

                  return SwalCustom.messageDialog(
                    "",
                    "Credenciais atualizada com sucesso",
                    "success"
                  ).then(list);
                }
              );
            }
          );
        }
      );
    });
  }
});
