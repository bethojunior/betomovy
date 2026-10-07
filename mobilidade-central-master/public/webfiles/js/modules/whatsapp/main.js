const sessionWhatsAppLocal = WhatsappSession.getSessionName();
const APP_NAME = WhatsappSession.resolveAppNameFromHostname(window.location.hostname);

function urlTripShared(tripReference) {
  if (!APP_NAME) {
    return `https://voutehomologar.dev.704apps.com.br/trip/${tripReference}/share`;
  }
  return `https://${APP_NAME}.prod.704apps.com.br/trip/${tripReference}/share`;
}

function dispatchMessageWhatsApp(phone, tripReference) {
  return console.log(APP_NAME);
  const message = urlTripShared(tripReference);
  const sessionName = sessionWhatsAppLocal;

  const params = {
    sessionName,
    reference : tripReference,
  };

  WhatsAppRepository.createReference(params)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
