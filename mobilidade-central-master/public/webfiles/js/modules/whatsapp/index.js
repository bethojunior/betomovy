document.addEventListener("DOMContentLoaded", function () {
  const elementProperty = new ElementProperty();

  const centralId = Session.get("centralSelected").id;
  const sessionWhatsApp = WhatsappSession.getSessionName();

  const params = { sessionName: sessionWhatsApp };

  function initWpp() {
    WhatsAppRepository.initSession(params)
      .then((htmlResponse) => {
        generateQrCode(htmlResponse);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  initWpp();

  function generateQrCode(htmlResponse) {
    document.getElementById("spinner-preload-wpp-qrcode").style.display =
      "none";
    document.getElementById("div-iframe-wpp-qrcode").style.display = "block";
    const iframe = document.getElementById("show-response-api-venom");
    if (iframe) {
      iframe.srcdoc = htmlResponse;
    } else {
      console.error(
        "Elemento iframe com ID 'show-response-api-venom' não encontrado.",
      );
    }
  }

  function showMessageIsActiveWpp() {
    showButtonRemoveSessionWpp();
    document.getElementById("spinner-preload-wpp-qrcode").style.display =
      "none";
    document.getElementById("error-qr-code").innerHTML =
      "Sessão ativa. Expira em 7 dias";
  }

  function showButtonRemoveSessionWpp() {
    document.getElementById("remove-session-wpp").style.display = "block";
  }

  elementProperty.addEventInElement(
    "#remove-session-wpp",
    "onclick",
    function () {
      const sessionName = sessionWhatsApp;

      WhatsAppRepository.removeSession(sessionName)
        .then((response) => {
          console.log(response);
          SwalCustom.messageDialog(
            "",
            "Sessão removida com sucesso",
            undefined,
            "info",
          );
        })
        .catch((error) => {
          console.log(error);
        });

      setInterval(() => {
        window.location.reload();
      }, 2000);
    },
  );

  elementProperty.addEventInElement(
    "#btnSendTestMessage",
    "onclick",
    function () {
      const phone = document.getElementById("phoneNumber").value.trim();
      const message = document.getElementById("messageText").value.trim();

      const btnSend = document.getElementById("btnSendTestMessage");
      const originalText = btnSend.innerHTML;
      btnSend.innerHTML = "Enviando...";
      btnSend.disabled = true;

      try {
        sendMessageWhatsApp(phone, message, sessionWhatsApp);
        
        SwalCustom.messageDialog(
          "Sucesso",
          "Mensagem enviada com sucesso!",
          undefined,
          "success"
        );

        document.getElementById("formTestMessage").reset();
        $('#modalTestMessage').modal('hide');
      } catch (error) {
        SwalCustom.messageDialog(
          "Erro",
          "Erro ao enviar mensagem. Verifique se a sessão está ativa.",
          undefined,
          "error"
        );
      } finally {
        btnSend.innerHTML = originalText;
        btnSend.disabled = false;
      }
    }
  );
});


function sendMessageWhatsApp(phone, message, sessionName) {
  WhatsAppRepository.dispatchMessage({
    phoneNumber: phone,
    message: message,
    sessionName: sessionName,
  });
}