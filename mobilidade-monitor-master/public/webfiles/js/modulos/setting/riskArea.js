document.addEventListener("DOMContentLoaded", function () {
  const mapService = new MapService();
  let circleMap = null;

  mapService.importScriptWithPlaces().then(() => {
    mapService.initMap({ lat: 0, lng: 0 }, 18, document.querySelector("#map"));
  });

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

  function list(page = 1) {
    preload(true);
    RiskAreaController.findAll(page).then(({ response }) => {
      preload(false);
      document.querySelector("#list").innerHTML = response.data
        .map((item) => {
          return `<tr>
                            <td>${new Date(
                              item.created_at
                            ).toLocaleString()}</td>
                            <td>${item.user.name}</td>
                            <td><a href="https://maps.google.com/?q=${
                              item.latitude
                            },${item.longitude}" target="_blank">${
            item.address
          }</a></td>
                            <td>${getStatus(item.status)}</td>
                            <td class="d-flex justify-content-between">
                                ${
                                  hasPermission(
                                    "mapa",
                                    "areas_riscos_visualizar"
                                  )
                                    ? `<button type="button" class="btn btn-primary btn-sm confirm-risk-area" value='${btoa(
                                        JSON.stringify(item)
                                      )}'>
                                    <span class="material-icons">place</span>
                                </button>`
                                    : ""
                                }

                                ${
                                  hasPermission("mapa", "areas_riscos_rejeitar")
                                    ? `
                                        <button
                                      type="button"
                                      class="btn btn-danger btn-sm reject-risk-area"
                                      value="${btoa(JSON.stringify(item))}"
                                    >
                                      <span class="material-icons">close</span>
                                    </button>
                                    `
                                    : ""
                                }

                                ${
                                  hasPermission(
                                    "mapa",
                                    "areas_riscos_compartilhar"
                                  )
                                    ? `
                                      <a href="https://api.whatsapp.com/send?phone=55${item.user.phone}" class="btn btn-success btn-sm" target="_blank">
                                   <span class="material-icons">chat</span>
                                </a>
                                    `
                                    : ""
                                }
                            </td>
                        </tr>`;
        })
        .join("");

      if (response.prev_page_url) {
        document.querySelector("#prev").classList.remove("disable");
        document.querySelector("#prev").parentNode.classList.remove("disabled");
      } else {
        document.querySelector("#prev").classList.add("disable");
        document.querySelector("#prev").parentNode.classList.add("disabled");
      }

      if (response.next_page_url) {
        document.querySelector("#next").classList.remove("disable");
        document.querySelector("#next").parentNode.classList.remove("disabled");
      } else {
        document.querySelector("#next").classList.add("disable");
        document.querySelector("#next").parentNode.classList.add("disabled");
      }

      elementProperty.addEventInElement("#prev", "onclick", function () {
        if (this.classList.contains("disable")) return;
        list(page - 1);
      });

      elementProperty.addEventInElement("#next", "onclick", function () {
        if (this.classList.contains("disable")) return;
        list(page + 1);
      });

      elementProperty.addEventInElement(
        ".reject-risk-area",
        "onclick",
        function () {
          const item = JSON.parse(atob(this.getAttribute("value")));

          SwalCustom.dialogConfirm(
            "Deseja rejeitar essa área de risco?",
            "",
            (status) => {
              if (status) {
                preload(true);
                RiskAreaController.rejectArea(item.id).then(() => list());
              }
            }
          );
        }
      );

      elementProperty.addEventInElement(
        ".confirm-risk-area",
        "onclick",
        function () {
          preload(true);
          const item = JSON.parse(atob(this.getAttribute("value")));
          document.querySelector("#address").value = item.address;
          document.querySelector("#name").value = item.user.name;
          document.querySelector("#createdAt").value = new Date(
            item.created_at
          ).toLocaleString();
          document.querySelector("#radius").value = item.radius || 0;
          const position = {
            lat: parseFloat(item.latitude),
            lng: parseFloat(item.longitude),
          };
          if (circleMap == null) {
            circleMap = new google.maps.Circle({
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#FF0000",
              fillOpacity: 0.35,
              map: mapService.map,
              center: position,
              radius: parseInt(item.radius || 0),
            });
          } else {
            circleMap.setCenter(position);
          }

          mapService.map.setCenter(position);
          mapService.map.setZoom(13);

          $("#riskAreaModal").modal("show");
          preload(false);

          elementProperty.addEventInElement(
            "#btnRiskAreaUpdate",
            "onclick",
            function () {
              const radius = document.querySelector("#radius").value;

              if (radius == null || radius === "")
                return SwalCustom.messageDialog(
                  "",
                  "Informe o raio da área de risco"
                );

              preload(true);

              RiskAreaController.confirm(item.id, radius).then(({ status }) => {
                preload(false);
                if (!status)
                  return SwalCustom.messageDialog(
                    "",
                    "Ocorreu um erro ao tentar salvar alterações"
                  );

                $("#riskAreaModal").modal("hide");
                list();
              });
            }
          );
        }
      );
    });

    elementProperty.addEventInElement("#radius", "oninput", function () {
      if (circleMap) {
        circleMap.setRadius(parseInt(document.querySelector("#radius").value));
      }
    });
  }

  function getStatus(status) {
    switch (status) {
      case "pending":
        return "PENDENTE";
      case "confirmed":
        return "CONFIRMADO";
      case "refused":
        return "RECUSADO";
      default:
        return "Não definido";
    }
  }
});
