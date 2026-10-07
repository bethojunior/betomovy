class IfoodCode {
  constructor() {
    this.elementProperty = new ElementProperty();
    this.tripReference = null;
    this.onCodeValidated = null;
    this.initEvent();
  }

  setDetail(tripReference) {
    this.tripReference = tripReference;
    Route.startClassesInComponent(
      [{ component: ".container-ifood-code", class: "active" }],
      () => {}
    );

    this.hideError();

    const successMessage = document.querySelector(".success-message");
    if (successMessage) {
      successMessage.style.display = "none";
    }

    const codeInput = document.querySelector("#ifoodCodeInput");
    if (codeInput) {
      codeInput.value = "";

      setTimeout(() => {
        codeInput.focus();
      }, 300);
    }

    const btnSend = document.querySelector("#btnSendCode");
    btnSend.setAttribute("disabled", "disabled");
    btnSend.style.opacity = "0.5";
  }

  initEvent() {
    this.setupCodeInput();

    this.elementProperty.addEventInElement("#btnSendCode", "onclick", () => {
      if (!document.querySelector("#btnSendCode").hasAttribute("disabled")) {
        this.sendCode();
      }
    });

    this.elementProperty.addEventInElement(
      "#closeIfoodCode",
      "onclick",
      async (e) => {
        e.preventDefault();
        try {
          const support = await IfoodController.getSupport(this.tripReference);

          if (support?.message) {
            window.open(support.message, "_system");
          } else {
            SwalCustom.messageDialog(
              "Erro ao entrar em contato com o suporte.",
              "Atenção"
            );
          }
        } catch {
          SwalCustom.messageDialog(
            "Erro ao entrar em contato com o suporte.",
            "Atenção"
          );
        } finally {
          localStorage.removeItem("deliveryModalVisible");
          localStorage.removeItem("tripReference");
          this.closeQuestion();
        }
      }
    );
  }

  setupCodeInput() {
    const codeInput = document.querySelector("#ifoodCodeInput");
    if (!codeInput) return;

    codeInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");

      if (e.target.value.length > 4) {
        e.target.value = e.target.value.slice(0, 4);
      }

      this.updateCodeBoxes(e.target.value);

      const btnSend = document.querySelector("#btnSendCode");
      if (e.target.value.length === 4) {
        btnSend.removeAttribute("disabled");
        btnSend.style.opacity = "1";
      } else {
        btnSend.setAttribute("disabled", "disabled");
        btnSend.style.opacity = "0.5";
      }
    });

    codeInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && codeInput.value.length === 4) {
        this.sendCode();
      }
    });
  }

  updateCodeBoxes(code) {
    const boxes = document.querySelectorAll(".code-box");
    if (!boxes.length) return;

    boxes.forEach((box, index) => {
      if (index < code.length) {
        box.textContent = code[index];
        box.classList.add("filled");
      } else {
        box.textContent = "";
        box.classList.remove("filled");
      }
    });
  }

  showLoading() {
    const btnSend = document.querySelector("#btnSendCode");
    const btnLoading = document.querySelector(".btn-loading");

    if (btnSend) {
      btnSend.classList.add("verifying");
      btnSend.setAttribute("disabled", "disabled");
    }

    if (btnLoading) {
      btnLoading.style.display = "flex";
    }
  }

  hideLoading() {
    const btnSend = document.querySelector("#btnSendCode");
    const btnLoading = document.querySelector(".btn-loading");

    if (btnSend) {
      btnSend.classList.remove("verifying");
      btnSend.removeAttribute("disabled");
    }

    if (btnLoading) {
      btnLoading.style.display = "none";
    }
  }

  showError(message) {
    const errorMessage = document.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.querySelector("span").textContent = message;
      errorMessage.style.display = "flex";
    }

    const codeBoxContainer = document.querySelector(".code-boxes");
    if (codeBoxContainer) {
      codeBoxContainer.classList.add("shake");
      setTimeout(() => {
        codeBoxContainer.classList.remove("shake");
      }, 500);
    }

    const codeInput = document.querySelector("#ifoodCodeInput");
    if (codeInput) {
      codeInput.value = "";
      codeInput.focus();
      this.updateCodeBoxes("");
    }

    this.hideLoading();

    const btnSend = document.querySelector("#btnSendCode");
    if (btnSend) {
      btnSend.setAttribute("disabled", "disabled");
      btnSend.style.opacity = "0.5";
    }
  }

  hideError() {
    const errorMessage = document.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.style.display = "none";
    }
  }

  getCode() {
    const codeInput = document.querySelector("#ifoodCodeInput");
    return codeInput ? codeInput.value : "";
  }

  sendCode() {
    const code = this.getCode();

    if (code.length !== 4) {
      this.showError("O código deve ter 4 dígitos.");
      return;
    }

    this.showLoading();
    this.hideError();

    IfoodController.validateCode(this.tripReference, code)
      .then((result) => {
        if (result.status) {
          this.hideLoading(); 
          this.showSuccess(() => {
            if (this.onCodeValidated) {
              this.onCodeValidated();
            }
          });
        } else {
          this.hideLoading();
          this.showError(
            result.response ||
              "Código inválido. Por favor, verifique e tente novamente."
          );
        }
      })
      .catch((error) => {
        this.hideLoading();
        this.showError("Código inválido. Por favor, tente novamente.");
      });
  }

  showSuccess(callback) {
    const successMessage = document.querySelector(".success-message");
    if (successMessage) {
      successMessage.style.display = "flex";

      setTimeout(() => {
        localStorage.removeItem("deliveryModalVisible");
        localStorage.removeItem("tripReference");
        this.closeQuestion();

        if (callback) callback();
      }, 1500);
    } else {
      localStorage.removeItem("deliveryModalVisible");
      localStorage.removeItem("tripReference");
      this.closeQuestion();

      if (callback) callback();
    }
  }

  closeQuestion() {
    const successMessage = document.querySelector(".success-message");
    if (successMessage) {
      successMessage.style.display = "none";
    }
    
    this.elementProperty.getElement(".container-ifood-code", (element) => {
      element.classList.remove("active");
    });
  }
}
