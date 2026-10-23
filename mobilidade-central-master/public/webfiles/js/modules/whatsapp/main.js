const sessionWhatsAppLocal = WhatsappSession.getSessionName();
const APP_NAME = WhatsappSession.resolveAppNameFromHostname(window.location.hostname);

function urlTripShared(tripReference) {
  return `https://movymob.com/trip/${tripReference}/share`;
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
