document.addEventListener("DOMContentLoaded", function () {
  let valuePrepaidBuy = document.querySelector(".valuePrepaidBuy");
  let quantityDaysSold = document.querySelector(".quantityDaysSold");
  let quantityDaysPurchased = document.querySelector(".quantityDaysPurchased");
  let valueType = document.getElementById("typePrepaid").value;
  const keys = Session.getLocal64('keysConfig');
  const roleId = Session.get("user").roleId
  const typesOfRoleId = {
    admin: 1,
    manager: 2
  }
  const havePermission = roleId == typesOfRoleId.admin || roleId == typesOfRoleId.manager

  const rolesData = JSON.parse(localStorage.getItem("@roles"));

  const seePrepaid = rolesData.groups.find((res) => {
    return res.name == "financeiro"
  });
  const prepaidPermission = seePrepaid.permissions?.find((res) => {
    return res == "gerenciar_prepago"
  })
  const prepaid = keys.find((res) => {
    return res.type == "PRÉ-PAGO"
  })
  const prepaidOn = prepaid.config[0].value;
  
  const prepaidByPeriod = keys.find((res) => {
    return res.type == "MOTORISTA"
  })
  const configDriver = prepaidByPeriod.config[13];

  valuePrepaidBuy.style.display = "block";
  quantityDaysSold.style.display = "none";
  quantityDaysPurchased.style.display = "none";

  elementProperty.addEventInElement("#typePrepaid", "onchange", (event) => {
    valueType = event.target.value;
    if(valueType == 1) {
      valuePrepaidBuy.style.display = "block";
      quantityDaysSold.style.display = "none";
      quantityDaysPurchased.style.display = "none";
      return;
    }
    if (valueType == 2) {
      valuePrepaidBuy.style.display = "none";
      quantityDaysSold.style.display = "block";
      quantityDaysPurchased.style.display = "block";
      return;
    } 
  });

  ConfigAllController.getAllV2().then((callback) => {
    callback.response.map((item) => item.config.map((item) => {
      if(item.key == 'only_prepaid_per_period'){
        if(item.value == 0){
          document.getElementById("typePrepaid").disabled = true;
          return;
        }
      }
    }));    
  });

  elementProperty.getElement(".list-type-payment-prepaid", (element) => {
    PaymentFormController.getAll().then(({ response }) => {
      element.innerHTML = response
        .map((item) => {
          return `<div class="form-check">
                        <input class="form-check-input check-prepaid-payment" type="checkbox" value="${item.idPaymentForm}" id="paymentPrepaid${item.idPaymentForm}" automaticPayment="${item.automaticPayment}">
                        <label class="form-check-label" for="paymentPrepaid${item.idPaymentForm}">
                            ${item.name}
                        </label>
                    </div>`;
        })
        .join("");

      elementProperty.addEventInElement(
        ".check-prepaid-payment",
        "onchange",
        function () {
          if (this.value == 2) {
            if (this.checked) {
              document.querySelector("#valueObsDeposit").disabled =
                this.getAttribute("automaticPayment") == true;
            } else {
              document.querySelector("#valueObsDeposit").disabled = true;
            }
          }
        }
      );
    });
  });

  showCollapse()
  prepaidSwitch()

  function showCollapse() {
    const prepaidCollapse = document.getElementById('collapse-prepaid')
    const prepaidTypeCollapse = document.getElementById('collapse-prepaid-type')

    if(prepaidPermission && prepaidOn == '1') {
      prepaidCollapse.classList.remove('d-none');
      prepaidTypeCollapse.classList.remove('d-none');
    } else {
      prepaidCollapse.classList.add('d-none');
      prepaidTypeCollapse.classList.add('d-none');
    }
  }  

  function prepaidSwitch() {
    const prepaidElement = document.getElementById('pre-paid-switch');
    const prepaidSwitch = prepaidElement;
    prepaidSwitch.checked = configDriver.value == '0' ? false : true 
  }

  elementProperty.addEventInElement(
    "#pre-paid-switch",
    "onchange", (el) => {
      const isChecked = el.target.checked;

      SwalCustom.dialogConfirm('Você deseja alterar esses dados?', 'Certifique que está alterando o item certo', callback => {
        if (callback) {
          const data = {
            only_prepaid_per_period: isChecked ? "1" : "0"
          }
          preload(true)
            MapSettingController.update(data).then(resolve => {
                if (resolve.status) {
                  preload(false)
                  configDriver.value = isChecked;
                  const res = resolve.response.find((res) => {
                    return res.type == "PRÉ-PAGO"
                  });
                  
                  Session.setLocal64('keysConfig', resolve.response);
                  swal('Modificado com sucesso', '', 'success');
                  return;
                }
                swal('ops', 'Erro ao modificar atributo', 'error')
            }).catch((error) => {
              preload(false)
              swal('Erro ao modificar', '', 'error');
            });
            return;
        }
        return el.target.checked = configDriver.value == '0' ? false : true
    })
    })

  elementProperty.addEventInElement(
    "#addPrepaidPayment",
    "onsubmit",
    (event) => {
      event.preventDefault();
      const data = {
        stripe: document.querySelector("#cardPrepaidCredit").value,
        title: document.querySelector("#titlePrepaidCredit").value,
        superTitle: document.querySelector("#subTitlePrepaidCredit").value,
        cityId: document.querySelector("#citySelected").value,
        purchasePrice:
          valueType == 1
            ? Mask.removeMaskMoney(
                document.querySelector("#valuePrepaidBuy").value
              )
            : null,
        sellPrice: Mask.removeMaskMoney(
          document.querySelector("#valuePrepaidCredit").value
        ),
        type: valueType == 1 ? "value" : "perPeriod",
        quantityDaysSold:
          valueType == 2
            ? document.querySelector("#quantityDaysSold").value
            : null,
        quantityDaysPurchased:
          valueType == 2
            ? document.querySelector("#quantityDaysPurchased").value
            : null,
        accountInformation: document.querySelector("#valueObsDeposit").disabled
          ? "-"
          : document.querySelector("#valueObsDeposit").value,
        paymentForms: element
          .getElements(".check-prepaid-payment")
          .filter((element) => element.checked)
          .map((element) => element.value),
      };

      if (data.purchasePrice === 0) return alert("Informe o valor da compra");

      if (data.sellPrice === 0) return alert("Informe o valor da venda");

      if (data.paymentForms.length === 0)
        return alert("Informe pelo menos uma forma de pagamento");

      if (!document.querySelector("#valueObsDeposit").disabled) {
        if (data.accountInformation.trim().length === 0)
          return alert("Informe os dados");
      }

      preload(true);
      PaymentFormController.insertCreditPrepaid(data)
        .then((result) => {
          $("#addPrepaidCredit").modal("hide");
          SwalCustom.messageDialog(
            "",
            result.message,
            result.status ? "success" : "info"
          );

          showListCreditPrepaid();
        })
        .finally(() => preload(false));
    }
  );

  function showListCreditPrepaid() {
    preload(true);

    const buttonElement = document.querySelector("#listAllCities")
    if(havePermission) {
      buttonElement.classList.remove('d-none');
    }

    PaymentFormController.listCreditPrepaid()
      .then(({ response }) => {

        mountList(response)
        listAllOrByCity(response, false)

        elementProperty.addEventInElement("#openPrePaidModal", "onclick", function() {
          const cities = Session.getLocal64("cities");
          const cityElement = document.querySelector("#citySelected")

          cityElement.innerHTML = '';
          if(havePermission) {
            cityElement.innerHTML = `<option value="">Todas</option>`;
          }
          cityElement.innerHTML += 
          cities.map(item => {
              return `<option value="${item.cityId}">${item.nome}</option>`;
          }).join("")

          $("#addPrepaidCredit").modal("show");
        })

        elementProperty.addEventInElement(
          ".remove-prepaid",
          "onclick",
          function () {
            const id = this.getAttribute("value");

            SwalCustom.dialogConfirm(
              "Deseja remover esse tipo de pré-pago",
              "",
              (status) => {
                if (status) {
                  preload(true);
                  PaymentFormController.deleteCreditPrepaid(id)
                    .then((result) => {
                      SwalCustom.messageDialog(
                        "",
                        result.message,
                        result.status ? "success" : "info"
                      );
                      showListCreditPrepaid();
                    })
                    .finally(() => preload(false));
                }
              }
            );
          }
        );
      })
      .finally(() => preload(false));
  }

  function mountList(response, byCity = true) {
    const citySelected = JSON.parse(localStorage.getItem('citySelected'));

    let list = !byCity 
    ? response
    : response.filter((res) => {
        return res.cityId == citySelected.cityId || res.cityId == null
    })

    document.querySelector("#listPrepaid").innerHTML = list
    .map((item) => {
      const permissionToExclude = havePermission || citySelected.cityId == item.cityId

      return ` <tr>
                  <td>${item.stripe}</td>
                  <td>${item.title}</td>
                  <td>${item.superTitle}</td>
                  <td>${
                    item.type == "value" ? "valor" : "Por periodo"
                  }</td>
                  <td>${item.cityName || 'Todas'}</td>
                  <td>${
                    !item.quantityDaysPurchased
                      ? "-"
                      : item.quantityDaysPurchased
                  }</td>
                  <td>${
                    !item.quantityDaysSold
                      ? "-"
                      : item.quantityDaysSold
                  }</td>
                  <td>${
                    !item.purchasePrice
                      ? "-"
                      : Mask.maskMoney(
                          parseFloat(item.purchasePrice)
                        )
                  }</td>
                  <td>${Mask.maskMoney(
                    parseFloat(item.sellPrice)
                  )}</td>
                  <td>${item.accountInformation}</td>
                  <td class="${permissionToExclude ? '' : 'd-none'}"><a href="#" class="remove-prepaid" value='${
                    item.id
                  }'>Excluir</a></td>
              </tr>`;
    })
    .join("");
  }

  function listAllOrByCity(response, byCity) {
    elementProperty.addEventInElement("#listAllCities", "onclick", function() {
        const buttonElement = document.querySelector('#listAllCities')
        if(byCity) {
            mountList(response, byCity)
            buttonElement.innerHTML = 'Listar todas'
            return byCity = false
        }
        mountList(response, byCity)
        buttonElement.innerHTML = 'Listar por cidade'
        return byCity = true
    });
}

  showListCreditPrepaid();
});
