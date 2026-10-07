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
    preload(true);
    WebMapKeyController.findAll().then(({ response }) => {
      preload(false);
      document.querySelector("#list").innerHTML = response
        .map(
          (item) => `
                <tr>
                    <td>${item.key}</td>
                    <td>${new Date(item.created_at).toLocaleString()}</td>
                    <td>
                        ${
                          hasPermission("mapa", "deletar_gerenciar_chaves_web")
                            ? `<button type="button" class="btn btn-danger btn-sm remove-key" item="${item.id}">Excluir</button>`
                            : ""
                        }
                    </td>
                </tr>
            `
        )
        .join("");

      elementProperty.addEventInElement(".remove-key", "onclick", function () {
        SwalCustom.dialogConfirm("Deseja remover essa chave?", "", (status) => {
          if (status) {
            const id = this.getAttribute("item");
            preload(true);
            WebMapKeyController.delete(id).then(() => {
              preload(false);
              list();
            });
          }
        });
      });
    });
  }

  elementProperty.addEventInElement(
    "#addKeyForm",
    "onsubmit",
    function (event) {
      event.preventDefault();

      const key = document.querySelector("#key").value;

      preload(true);
      WebMapKeyController.save(key).then(() => {
        document.querySelector("#key").value = "";
        $("#addKeyModal").modal("hide");
        preload(false);
        list();
      });
    }
  );
});
