document.addEventListener("DOMContentLoaded", () => {
  const elementProperty = new ElementProperty();

  changeHostEnv();
  showRecaptcha();
  let resultSumRecaptcha = false;
  const LIMIT_SIZE_COOKIES = 3043;
  const MAX_CHUNK_JSON_SIZE = 2800;

  setTimeout(() => {
    elementProperty.getElement(".logo-monitor", (these) => {
      these.style.backgroundImage = `url(${environment.hosts.hostImageDefault})`;
      these.style.backgroundImage = `url(${environment.hosts.hostImageDefault})`;
    });
  }, 800);
  elementProperty.addEventInElement("#formLogin", "onsubmit", function (e) {
    const resultSum = document.getElementById("result-sum").value;

    if (resultSum == "" || resultSumRecaptcha == false) {
      e.preventDefault();
      elementProperty.getElement("#result-sum", (these) => {
        these.focus();
      });
    } else {
      e.preventDefault();
      preload(true);
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if ("geolocation" in navigator) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then(function (result) {
            if (result.state == "granted" || result.state == "prompt") {
              navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const localization = `https://google.com/maps?q=${latitude},${longitude}`;
                preload(true);
                localStorage.setItem(
                  "@monitor_legado:localization",
                  JSON.stringify(localization)
                );
                authenticate(email, password, localization);
                elementProperty.getElement(".modal", (modal) =>
                  modal.classList.add("active")
                );
              });
            } else {
              preload(false);
              SwalCustom.messageDialog(
                "Por favor, habilite suas permissões de localização!"
              );
            }
          });
      } else {
        SwalCustom.messageDialog(
          "Seu navegador não suporta geolocalização, por favor, atualize seu navegador!"
        );
      }
    }
  });

  function changeHostEnv() {
    function getConfigByKey(key) {
      return new Promise((resolve, reject) => {
        ConnectionServer.sendRequestApi(
          `Support/GetConfig`,
          "POST",
          { configKey: key },
          resolve,
          reject,
          true
        );
      });
    }
    getConfigByKey("link_storage_pictures").then((response) => {
      if (!response?.data) return;
      const linkStoragePictures = response?.data || "";
      environment.hosts.hostImageDriver = `${linkStoragePictures}driver/profile/compressed/`;
      environment.hosts.hostImageDriverTemp = `${linkStoragePictures}driver/profile/temp/`;
      environment.hosts.hostDocs = `${linkStoragePictures}driver/docs/`;
      environment.hosts.hostImageClient = `${linkStoragePictures}customer/profile/compressed/`;
      environment.hosts.hostImageDefault = `${linkStoragePictures}default.jpg`;
      environment.hosts.hostImageCentral = `${linkStoragePictures}central/`;
      environment.hosts.hostAudio = `${linkStoragePictures}chat/trip/`;
    });
  }

  function showRecaptcha() {
    const btnLogin = document.getElementById("btn-form");
    btnLogin.style.display = "none";

    const recaptcha = document.getElementById("recaptcha");

    const random1 = Math.floor(Math.random() * 10) + 1;
    const random2 = Math.floor(Math.random() * 10) + 1;

    const result = random1 + random2;

    elementProperty.getElement("#recaptcha", (these) => {
      these.innerHTML = `
            <div class="mt-4 text-center">Qual a soma de ${random1} + ${random2}?</div>
            <div class="mt-2 d-flex justify-content-center">
                <input type="text" class="form-control col-md-2" id="result-sum">
                <button class="btn btn-dark" type="button" id="btn-sum">Verificar</button>
            </div>`;
    });

    elementProperty.addEventInElement(
      "#result-sum",
      "onkeypress",
      function (e) {
        if (e.keyCode == 13) {
          if (result == this.value) {
            resultSumRecaptcha = true;
            btnLogin.style.display = "block";
            recaptcha.style.display = "none";
          } else {
            showRecaptcha();
          }
        }
      }
    );

    elementProperty.addEventInElement("#btn-sum", "onclick", function (e) {
      e.preventDefault();
      const resultSum = document.getElementById("result-sum").value;

      if (resultSum == result) {
        resultSumRecaptcha = true;
        btnLogin.style.display = "block";
        recaptcha.style.display = "none";
      } else {
        showRecaptcha();
        resultSumRecaptcha = false;
      }
    });
  }

  function MapSetting(data) {
    Session.set("user", data);

    // MapSettingController.getById(22)
    //   .then(({ response }) => {
    //     console.log(response);
    //     if ( response !== undefined && response.length > 0 ) {
    //       const config = response.find(element => element.key === "power_bi_url");
    //
    //       if (config !== undefined) {
    //         Session.set("power_bi_url", config.value);
    //       }
    //     }
    //   })
    //   .catch(err => console.log("Erro ao buscar configuração geral"))
    //   .finally(() => {
    //     preload(false);
    //     location.reload();

    MapSettingController.getAll()
      .then((response) => {
        response.response.map((item) => {
          if (item.type === "TIMEZONE") {
            const config = response.response[9].config[0];

            if (config !== undefined) {
              Session.set("timezone", config.value);
            }
          }

          if (item.type === "BI") {
            const config = response.response[13].config[0];

            if (config !== undefined) {
              Session.set("power_bi_url", config.value);
            }
          }

          if (item.type === "TEMPLATE") {
            const configSocialNetwork = response.response[15].config[0];

            if (configSocialNetwork !== undefined) {
              Session.set(
                "enable_social_networks_on_monitor",
                configSocialNetwork.value
              );
            }
          }

          if (item.type === "TEMPLATE") {
            const configOperationManualYoutubeChannel =
              response.response[15].config[1];

            if (configOperationManualYoutubeChannel !== undefined) {
              Session.set(
                "enable_operation_manual_and_youtube_channel",
                configOperationManualYoutubeChannel.value
              );
            }
          }

          if (item.type === "TEMPLATE") {
            const hideInformationClientandDriver =
              response.response[15].config[3];
            if (hideInformationClientandDriver !== undefined) {
              Session.set(
                "hide_information_client_and_driver",
                hideInformationClientandDriver.value
              );
            }

            const showBoletoAsaas = response.response[15].config[2];
            if (showBoletoAsaas !== undefined) {
              Session.set("show_boleto_asaas", showBoletoAsaas.value);
            }
          }

          if (item.type === "APP") {
            const configAlertPhotoPanic = response.response[4].config[28];

            if (configAlertPhotoPanic !== undefined) {
              Session.set(
                "enable_alert_photo_panic",
                configAlertPhotoPanic.value
              );
            }
          }

          if (item.type === "MOTORISTA") {
            const configSplit = response.response[0].config[17];
            if (configSplit !== undefined) {
              Session.set("enable_driver_split_payment", configSplit.value);
            }
          }
        });
      })
      .catch((err) => console.log("Erro ao buscar configuração geral"))
      .finally(() => {
        preload(false);
        location.reload();
      });
  }

  async function openPaymentDebt() {
    const { response } = await UserController.loginAdmin();

    if (!response) return;
    window.open(
      `https://checkout.prod.704apps.com.br/faturas-mensais?token=${response.token}&contato=55859677-7458`
    );
  }

  /**
   * @param {Array} arr
   * @param {number} maxChunkSize
   * @returns {Array<Array>}
   */
  function splitArrayBySize(arr, maxChunkSize) {
    const chunks = [];
    let current = [];
    let currentSize = 2;

    arr.forEach((item) => {
      const itemSize = JSON.stringify(item).length + 1;

      if (currentSize + itemSize > maxChunkSize && current.length > 0) {
        chunks.push(current);
        current = [];
        currentSize = 2;
      }

      current.push(item);
      currentSize += itemSize;
    });

    if (current.length > 0) chunks.push(current);

    return chunks;
  }

  function authenticate(email, password, localization) {
    UserController.getAuthenticate({
      email,
      password,
      localization,
    }).then((result) => {
      if (!result.status) {
        preload(false);
        if (result.message === "Usuário ou Senha inválida") {
          return SwalCustom.messageDialog(
            "",
            `Email ou senha inválida`,
            "warning"
          );
        }

        if (result.message.split(" ").includes("bloqueado!")) {
          return swal({
            title: "Conta Bloqueada",
            text: "Sua conta foi bloqueada devido a inadimplência. Clique abaixo para regularizar sua situação e restaurar o acesso aos serviços. Lembre que seus Apps param de funcionaram em 15 dias.",
            icon: "warning",
            buttons: ["Voltar ao monitor", "Pagar"],
          }).then((FalarAgora) => {
            if (FalarAgora) {
              openPaymentDebt();
            }
          });
        }

        swal({
          title: `${result.message}`,
          icon: "warning",
          buttons: ["Ok", "Falar Agora"],
        }).then((FalarAgora) => {
          if (FalarAgora) {
            window.location.href =
              "https://api.whatsapp.com/send?phone=55859677-7458&text=Olá, preciso de apoio do setor financeiro.";
          }
        });
      }

      const { statusPay } = result.response;
      const data = result.response;
      data.role.cities = [];

      /**
       * ESTÁ LOGICA VERIFICA O TAMANHO DA QUANTIDADE DE PERMISSÕES EXISTENTES DO GRUPO DE PERMISSÕES.
       * DEPENDENDO DA QUANTIDADE O ROLE É QUEBRANDO EM QUANTOS PEDAÇOS FOREM NECESSÁRIOS PARA QUE NÃO ESTOURE O LIMITE DE COOKIE.
       */
      if (JSON.stringify(data.role).length >= LIMIT_SIZE_COOKIES) {
        const arrayDivide = splitArrayBySize(data.role.groups, MAX_CHUNK_JSON_SIZE);

        arrayDivide.forEach((chunk, index) => {
          Session.set(`roles-${index}`, chunk);
        });
        Session.set(`roles-length`, arrayDivide.length - 1);
      } else {
        Session.set("roles-0", data.role.groups);
        Session.set(`roles-length`, 0);
      }

      Session.set("nameRole", data.role.name);
      localStorage.setItem("@roles", JSON.stringify(data.role));

      delete data.role;

      delete data.statusPay;

      if (statusPay.id === 2) {
        preload(false);
        swal({
          title: "Aviso de Inadimplência",
          text: "Identificamos parcelas em atraso. Para evitar interrupção dos serviços, clique abaixo e verifique suas faturas.",
          icon: "warning",
          buttons: ["Voltar ao monitor", "Pagar"],
        }).then((FalarAgora) => {
          if (FalarAgora) {
            openPaymentDebt();
            return;
          }
          MapSetting(data);
        });
        return;
      }
      MapSetting(data);
    });
  }

  elementProperty.addEventInElement(
    ".btn-send-recuperation",
    "onclick",
    function () {
      const email = document.querySelector(".email-input").value;

      if (email == "")
        return SwalCustom.messageDialog(
          "",
          "Informe seu e-mail para que o código seja enviado"
        );

      preload(true);
      const data = {
        email: email,
      };
      UserController.forgetPassword(data).then(({ status, response }) => {
        preload(false);
        if (!status) return SwalCustom.messageDialog("", response[0], "error");

        SwalCustom.messageDialog(
          "",
          "Código de recuperação enviado para seu e-mail!",
          "success"
        ).then(() => {
          $("#modal-forgot-password").modal("hide");
          document.querySelector(".email-input").value = "";
          codeVerify(response);
        });
      });
    }
  );

  function codeVerify(response) {
    $("#modal-code-verify").modal("show");

    elementProperty.addEventInElement(
      ".btn-code-verify",
      "onclick",
      function () {
        const codeVerify = document.querySelector(".code-verify").value;
        if (atob(response.code) != codeVerify)
          return SwalCustom.messageDialog("", "Código incorreto", "error");

        redefinitionPassword(codeVerify, response);
      }
    );
  }

  function redefinitionPassword(codeVerify, response) {
    $("#modal-redefinition-password").modal("show");

    elementProperty.addEventInElement(
      ".btn-redefinition-password",
      "onclick",
      function () {
        const code = codeVerify;
        const id = response.userId;
        const password = document.querySelector(".input-password").value;
        const passwordConfirm = document.querySelector(".input-confirm").value;

        if (password != passwordConfirm)
          return SwalCustom.messageDialog(
            "",
            "As senhas não correspondem, forneça duas senhas iguais",
            "error"
          );

        if (password == "" || passwordConfirm == "")
          return SwalCustom.messageDialog(
            "",
            "Os dois campos de senha precisam ser preenchidos",
            "error"
          );

        preload(true);
        const data = {
          code: code,
          password: password,
        };

        UserController.updatePassword(id, data).then(() => {
          preload(false);
          SwalCustom.messageDialog(
            "",
            "Senha redefinida com sucesso!",
            "success"
          ).then(() => {
            preload(true);
            window.location.reload();
          });
        });
      }
    );
  }
});
