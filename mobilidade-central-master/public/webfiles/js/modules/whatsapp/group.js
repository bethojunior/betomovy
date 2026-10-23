document.addEventListener('DOMContentLoaded', function () {
  const centralId = Session.get('centralSelected').id

  let url = window.location.href
  url = url.split('/')

  const centralName = url[2]

  const sessionWhatsApp = WhatsappSession.getSessionName()

  const site = `https://movymob.com/share`

  const btnCloseDriverNotFoundModal = document.getElementById('btnCloseDriverNotFoundModal')
  if (btnCloseDriverNotFoundModal) {
    btnCloseDriverNotFoundModal.addEventListener('click', function () {
      const modalEl = document.getElementById('driverNotFoundDetailsModal')
      if (modalEl) {
        modalEl.classList.remove('show')
      }
      pendingNotAnsweredTrip = null
    })
  }

  viewController.elementProperty.addEventInElement(
    '#send-message-to-group-trip-not-found',
    'onclick',
    function () {
      const sendToWpp = document.getElementById('sendToWhatsappGroup').checked

      document.getElementById('driverNotFoundDetailsModal').classList.remove('show')

      if (sendToWpp) {
        const groupId = document.getElementById('select-group-list').value
        const wppParams = {
          sessionName: sessionWhatsApp,
          groupId: groupId,
          message: `Abra o link para acessar a corrida: ${site}`,
        }
        WhatsAppRepository.sendMessageToGroup(wppParams)
          .then(() => swal('Sucesso', 'Mensagem enviada ao grupo com sucesso', 'success'))
          .catch((error) => console.error('Erro ao enviar mensagem WhatsApp:', error))
      }

      if (pendingNotAnsweredTrip) {
        initNewTripAfterCancel(pendingNotAnsweredTrip)
        pendingNotAnsweredTrip = null
      }
    }
  )
})
