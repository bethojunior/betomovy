document.addEventListener('DOMContentLoaded', function () {
  const tabButtons = document.querySelectorAll('.tab-btn')
  const tabPanels = document.querySelectorAll('.tab-panel')
  let currentCentralId = Session.getValueInSession('centralSelected', 'id').toString()

  let wppGroupsConfig = null
  let groupsPollingInterval = null
  let groupsPollingAttempts = 0

  let paramsGroupConfig = {
    sessionName: '',
    centralId: currentCentralId,
    groups: null,
  }

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab')

      tabButtons.forEach((btn) => btn.classList.remove('active'))
      tabPanels.forEach((panel) => panel.classList.remove('active'))

      button.classList.add('active')
      document.getElementById(targetTab).classList.add('active')
    })
  })

  const elementProperty = new ElementProperty()
  const centralId = Session.get('centralSelected').id

  const sessionWhatsApp = WhatsappSession.getSessionName()

  const appName = localStorage.getItem('appName') || WhatsappSession.resolveAppNameFromHostname(window.location.hostname)

  console.log(appName)

  const params = { sessionName: sessionWhatsApp, chatEnabled: true }

  syncGroups().then((res) => {
    console.log(res)
    syncMyCurrentDataGroup(res)
  })
  syncNotificationSettings()

  function initWpp() {
    const spinner = document.getElementById('spinner-connect-wpp')
    if (spinner) spinner.style.display = 'block'

    WhatsAppRepository.initSession(params)
      .then((htmlResponse) => {
        generateQrCode(htmlResponse)
        startGroupsPolling()
      })
      .catch((error) => {
        console.log(error)
        if (spinner) spinner.style.display = 'none'
        setGroupSessionStatus(
          'error',
          'Não foi possível iniciar a conexão do WhatsApp. Tente novamente.'
        )
      })
  }

  elementProperty.addEventInElement('#connect-wpp-tab', 'onclick', () => {
    initWpp()
  })

  // ── Toast de sucesso inline (DRY — substitui SwalCustom repetido) ──────
  function showSuccessToast(message = 'Alterações aplicadas') {
    const existing = document.getElementById('wpp-success-toast')
    if (existing) existing.remove()

    const toast = document.createElement('div')
    toast.id = 'wpp-success-toast'
    toast.className = 'wpp-toast'
    toast.innerHTML = `<i class="fas fa-check-circle"></i><span>${message}</span>`
    document.body.appendChild(toast)

    requestAnimationFrame(() => toast.classList.add('wpp-toast--visible'))

    setTimeout(() => {
      toast.classList.remove('wpp-toast--visible')
      setTimeout(() => toast.remove(), 300)
    }, 2500)
  }
  // ────────────────────────────────────────────────────────────────────────

  function generateQrCode(htmlResponse) {
    const iframe = document.getElementById('show-qr-code-whatsapp')
    if (!iframe) return

    const responsiveCSS = `<style>
      *, *::before, *::after { box-sizing: border-box; }
      html, body {
        margin: 0; padding: 0;
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        background: transparent;
      }
      body { padding: 12px; display: flex; justify-content: center; align-items: flex-start; }
      img { max-width: 100% !important; height: auto !important; display: block; margin: 0 auto; }
      div, section, article, main, form { max-width: 100% !important; }
      button {
        cursor: pointer; border-radius: 8px; padding: 8px 16px;
        font-size: 13px; font-family: inherit;
      }
      h1, h2, h3, h4 { font-size: 15px; margin: 0 0 8px; }
      p { font-size: 13px; margin: 4px 0; }
    </style>`

    iframe.style.height = '1px'
    iframe.onload = function () {
      try {
        const h = iframe.contentDocument.body.scrollHeight
        iframe.style.height = (h + 24) + 'px'
      } catch (e) {}
    }
    iframe.srcdoc = responsiveCSS + htmlResponse

    const spinner = document.getElementById('spinner-connect-wpp')
    if (spinner) spinner.style.display = 'none'
  }

  function stopGroupsPolling() {
    if (!groupsPollingInterval) return
    clearTimeout(groupsPollingInterval)
    groupsPollingInterval = null
    groupsPollingAttempts = 0
  }

  function startGroupsPolling() {
    stopGroupsPolling()
    groupsPollingAttempts = 0
    setGroupSessionStatus('info', 'Aguardando leitura do QR Code para carregar os grupos.')

    const poll = async () => {
      groupsPollingAttempts += 1
      const groups = await fetchSessionGroups({ silent: true })

      if (Array.isArray(groups)) {
        stopGroupsPolling()
        if (groups.length > 0) {
          syncGroups().then((res) => syncMyCurrentDataGroup(res))
          showSuccessToast('WhatsApp conectado. Grupos atualizados.')
        }
        return
      }

      if (groupsPollingAttempts >= 40) {
        stopGroupsPolling()
        setGroupSessionStatus(
          'warning',
          'QR Code gerado. Leia o código para ativar a sessão e carregar os grupos.'
        )
        return
      }

      if (groupsPollingInterval) {
        groupsPollingInterval = setTimeout(poll, 3000)
      }
    }

    groupsPollingInterval = setTimeout(poll, 3000)
  }

  const appState = {
    tripTypes: [],
    configs: {
      activeTripTypes: [],
    },
  }

  initManagementApp()

  function initManagementApp() {
    setupEventListeners()
    loadInitialData()
    loadConfigs()
  }

  function setupEventListeners() {
    const tabButtons = document.querySelectorAll('.tab-btn')
    tabButtons.forEach((button) => {
      button.addEventListener('click', function (event) {
        event.preventDefault()
        const targetTab = button.getAttribute('data-tab')
        switchTab(targetTab)
      })
    })

    elementProperty.addEventInElement('#saveAllConfigs', 'click', () => saveAllConfigs())
    // Event listener for checkboxes will be added dynamically when checkboxes are created
  }

  function loadInitialData() {
    loadSavedConfigs()
    loadTripTypes()
  }

  function loadSavedConfigs() {
    const savedConfigs = localStorage.getItem('whatsappConfigs')
    if (savedConfigs) {
      appState.configs = { ...appState.configs, ...JSON.parse(savedConfigs) }
      applyConfigsToForm()
    }
  }

  function applyConfigsToForm() {
    if (appState.tripTypes.length > 0) {
      loadTripTypesSelect(appState.tripTypes)
    }
  }

  function switchTab(targetTab) {
    const allTabButtons = document.querySelectorAll('.tab-btn')
    allTabButtons.forEach((btn) => btn.classList.remove('active'))

    const clickedButton = document.querySelector(`button[data-tab="${targetTab}"]`)
    if (clickedButton) {
      clickedButton.classList.add('active')
    }

    const allPanes = document.querySelectorAll('.tab-panel')
    allPanes.forEach((pane) => {
      pane.classList.remove('active')
    })

    const targetPane = document.querySelector(`#${targetTab}`)
    if (targetPane) {
      targetPane.classList.add('active')
    }

    handleTabChange(targetTab)
  }

  function handleTabChange(targetTab) {
    switch (targetTab) {
      case 'configs':
        loadConfigs()
        break
    }
  }

  async function loadConfigs() {
    const skeletonElement = document.getElementById('name-skeleton')
    const inputContainer = document.getElementById('name-input-container')
    const nameInput = document.getElementById('name-contact')

    if (skeletonElement) skeletonElement.style.display = 'block'
    if (inputContainer) inputContainer.style.display = 'none'

    try {
      const currentConfigs = await fetchConfigs(sessionWhatsApp)

      if (nameInput && currentConfigs?.name) {
        nameInput.value = currentConfigs.name
        nameInput.style.opacity = '0'
        setTimeout(() => {
          nameInput.style.transition = 'opacity 0.3s ease-in'
          nameInput.style.opacity = '1'
        }, 50)
      }
    } catch (error) {
      console.error('Falha ao carregar as configurações:', error)
    } finally {
      // Sempre esconde o skeleton e mostra o input, independente de sucesso ou erro
      if (skeletonElement) skeletonElement.style.display = 'none'
      if (inputContainer) inputContainer.style.display = 'block'
    }

    loadTripTypes()
  }

  function loadTripTypes() {
    TripRepository.getTripType()
      .then(({ status, response }) => {
        if (!status) return

        appState.tripTypes = response
        loadTripTypesSelect(response)

        if (appState.configs.activeTripTypes && appState.configs.activeTripTypes.length > 0) {
          setTimeout(() => {
            appState.configs.activeTripTypes.forEach((tripTypeId) => {
              const checkbox = document.getElementById(`tripType_${tripTypeId}`)
              if (checkbox) {
                checkbox.checked = true
              }
            })
          }, 100)
        }
      })
      .catch((error) => {
        console.error('Erro ao carregar tipos de viagem:', error)
      })
  }

  async function loadTripTypesSelect(tripTypes) {
    const container = document.getElementById('activeTripTypes')
    if (!container) return

    container.innerHTML = ''

    const idsToMarkLikeSelected = await fetchConfigs(sessionWhatsApp)
    const selectedIds = Array.isArray(idsToMarkLikeSelected.tripTypeId)
      ? idsToMarkLikeSelected.tripTypeId
      : []

    tripTypes.forEach((tripType) => {
      if (tripType.onlyCentral == 1) {
        const checkboxWrapper = document.createElement('div')
        checkboxWrapper.className = 'checkbox-item'
        checkboxWrapper.style.marginBottom = '8px'

        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.id = `tripType_${tripType.idTripType}`
        checkbox.value = tripType.idTripType

        // Marca como checked se o ID estiver na lista retornada pela API
        checkbox.checked = selectedIds.includes(tripType.idTripType)
        checkbox.style.marginRight = '8px'

        const label = document.createElement('label')
        label.htmlFor = `tripType_${tripType.idTripType}`
        label.textContent = tripType.type
        label.style.cursor = 'pointer'
        label.style.userSelect = 'none'

        // Adiciona listener para alterações
        checkbox.addEventListener('change', updateActiveTripTypes)

        checkboxWrapper.appendChild(checkbox)
        checkboxWrapper.appendChild(label)
        container.appendChild(checkboxWrapper)
      }
    })
  }

  function updateActiveTripTypes() {
    const checkboxes = document.querySelectorAll('#activeTripTypes input[type="checkbox"]')
    appState.configs.activeTripTypes = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value)
  }

  elementProperty.addEventInElement('#btn-saveAllConfigs', 'onclick', () => {
    saveAllConfigs()
  })

  async function saveAllConfigs() {
    const container = document.getElementById('activeTripTypes')
    const name = document.getElementById('name-contact').value
    let keyAppPartner
    let getLocalStorage = localStorage.getItem('keyAppPartner')
    if (getLocalStorage && getLocalStorage !== 'undefined') {
      try {
        keyAppPartner = JSON.parse(getLocalStorage)
      } catch (error) {
        console.error('Failed to parse keyAppPartner from localStorage:', error)
      }
    }

    if (!name) {
      return SwalCustom.messageDialog(
        'Atenção',
        'Preencha todos os campos de contato (Nome do App).',
        undefined,
        'warning'
      )
    }

    const selectedTripTypes = Array.from(
      container.querySelectorAll('input[type="checkbox"]:checked')
    ).map((cb) => Number(cb.value))

    if (selectedTripTypes.length < 1) {
      return SwalCustom.messageDialog(
        'Atenção',
        'Selecione ao menos um tipo de viagem ativo.',
        undefined,
        'warning'
      )
    }

    let params = {}
    params.tripTypeId = selectedTripTypes
    params.appNameAlias = sessionWhatsApp
    params.centralIdExternal = centralId
    params.name = appName
    params.centralName = name
    params.keyAppPartner = keyAppPartner

    try {
      const execute = await fetch('https://api-whatsapp-mobilidade.704app.com.br/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      const data = await execute.json()
      if (data) {
        return SwalCustom.messageDialog(
          'Sucesso',
          'Configurações salvas com sucesso!',
          undefined,
          'success'
        )
      }
      return data
    } catch (error) {
      return SwalCustom.messageDialog(
        'Erro',
        'Ocorreu um erro ao salvar as configurações. Tente novamente.',
        undefined,
        'error'
      )
    }
  }

  async function fetchConfigs(params) {
    try {
      const response = await fetch(
        `https://api-whatsapp-mobilidade.704app.com.br/admin/${params}`,
        {
          method: 'GET',
        }
      )

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      return [{ tripTypeId: [] }, (name = '')]
    }
  }

  elementProperty.addEventInElement('#btn-add-new-group-wpp', 'onclick', () => {
    const modalElement = document.getElementById('modal-new-group')
    const modal = new bootstrap.Modal(modalElement)
    modal.show()
  })

  async function syncGroups() {
    const centralId = Session.getValueInSession('centralSelected', 'id').toString()
    const groupsPromise = fetchSessionGroups()
    const configPromise = CentralRepository.getMyGroups(centralId)
      .then((data) => {
        wppGroupsConfig = data.data
        return data.data
      })
      .catch((error) => {
        console.log(error)
        return null
      })

    const [, config] = await Promise.all([groupsPromise, configPromise])
    return config
  }

  async function fetchSessionGroups({ silent = false } = {}) {
    if (!sessionWhatsApp) {
      mountUnavailableGroups('Sessão do WhatsApp não identificada.')
      setGroupSessionStatus('warning', 'Sessão do WhatsApp não identificada.')
      return null
    }

    try {
      if (!silent) setGroupSessionStatus('info', 'Carregando grupos do WhatsApp...')

      const data = await WhatsAppRepository.fetchMyGroups(sessionWhatsApp)
      const groups = getGroupsFromResponse(data)

      if (!Array.isArray(groups)) {
        throw new Error('Resposta inválida ao buscar grupos.')
      }

      if (groups.length === 0) {
        mountUnavailableGroups('Nenhum grupo encontrado nesta sessão.')
        setGroupSessionStatus('warning', 'Sessão ativa, mas nenhum grupo foi encontrado.')
        return groups
      }

      mountSelectGroupInfo(groups)
      setGroupSessionStatus('success', 'Sessão ativa. Grupos carregados.')
      return groups
    } catch (error) {
      if (!silent) console.log(error)
      mountUnavailableGroups('Ative a sessão para listar os grupos.')
      setGroupSessionStatus(
        'warning',
        'Sessão do WhatsApp inativa. Abra a aba Conexão e leia o QR Code para carregar os grupos.'
      )
      return null
    }
  }

  function getGroupsFromResponse(data) {
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.success)) return data.success
    if (Array.isArray(data?.data)) return data.data
    if (Array.isArray(data?.response)) return data.response
    return null
  }

  function getOrCreateGroupStatusElement() {
    let element = document.getElementById('wpp-group-session-status')
    if (element) return element

    const reference = document.querySelector('.group-content-card .configs-form-body')
    if (!reference) return null

    element = document.createElement('div')
    element.id = 'wpp-group-session-status'
    element.className = 'wpp-group-session-status'
    reference.prepend(element)
    return element
  }

  function setGroupSessionStatus(type, message) {
    const element = getOrCreateGroupStatusElement()
    if (!element) return

    element.className = `wpp-group-session-status wpp-group-session-status--${type}`
    element.textContent = message
  }

  function mountUnavailableGroups(message) {
    viewController.elementProperty.getElement('#list-groups-by-current-session', (select) => {
      select.innerHTML = `<option value="">${escapeHtml(message)}</option>`
      select.disabled = true
    })

    viewController.elementProperty.getElement('#list-groups-by-current-session-activies', (select) => {
      select.innerHTML = `<option value="">${escapeHtml(message)}</option>`
      select.disabled = true
    })
  }

  function mountSelectGroupInfo(props) {
    if (!Array.isArray(props)) return;

    // Modal de seleção de grupo
    viewController.elementProperty.getElement('#list-groups-by-current-session', (element) => {
      element.disabled = false
      element.innerHTML = '<option value="">Selecione um grupo</option>'
      props.forEach((group) => {
        element.innerHTML += `<option value='${JSON.stringify(group)}'>${escapeHtml(group.name)}</option>`
      })
    })

    // Select de notificação ativo — permite trocar o grupo sem abrir modal
    viewController.elementProperty.getElement('#list-groups-by-current-session-activies', (select) => {
      const currentValue = select.value
      select.disabled = false
      select.innerHTML = '<option value="">Nenhum grupo</option>'
      props.forEach((group) => {
        const opt = document.createElement('option')
        opt.value = group.id
        opt.textContent = group.name
        select.appendChild(opt)
      })
      if (currentValue) select.value = currentValue
    })
  }

  function escapeHtml(str) {
    return str ? String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;') : ''
  }

  async function syncMyCurrentDataGroup(data) {
    const group = wppGroupsConfig?.groups
    if (!group?.id) return  // sem grupo configurado, aguarda seleção do usuário

    viewController.elementProperty.getElement(
      '#list-groups-by-current-session-activies',
      (select) => {
        if (String(group.id).trim() === String(data?.group_reference).trim()) {
          select.value = group.id
        }
      }
    )
  }

  elementProperty.addEventInElement('#save-groups-selected', 'onclick', () => {
    let itemSeleted = document.getElementById('list-groups-by-current-session').value
    if (!itemSeleted) {
      return SwalCustom.messageDialog(
        'Atenção',
        'Selecione um grupo do WhatsApp antes de salvar.',
        undefined,
        'warning'
      )
    }

    let itemSeletedParsed = JSON.parse(itemSeleted)
    const modalElement = document.getElementById('modal-new-group')
    const modal = new bootstrap.Modal(modalElement)

    paramsGroupConfig.sessionName = sessionWhatsApp

    paramsGroupConfig.groups = {
      id: itemSeletedParsed.id,
      name: itemSeletedParsed.name,
    }

    CentralRepository.storeGroups(paramsGroupConfig)
      .then((data) => {
        showSuccessToast()
      })
      .catch((error) => {
        SwalCustom.messageDialog('Erro ao salvar', 'Esse grupo já está vinculado', 'info')
      })

  })

  const checkboxGroupNotification = document.getElementById('manage-group-notification')
  const checkboxUserotification = document.getElementById('manage-user-notification')
  const selectGroupsByCurrentSessionActivies = document.getElementById(
    'list-groups-by-current-session-activies'
  )

  elementProperty.addEventInElement('#button_message_send_to_group', 'onclick', () => {
    let message_send_to_group = document.getElementById('message_send_to_group').value
    let props = {
      centralId: currentCentralId,
      message_send_to_group: message_send_to_group,
    }
    CentralRepository.storeNotification(props)
      .then((data) => {
        showSuccessToast()
      })
      .catch((error) => {
        console.log(error)
      })
  })

  elementProperty.addEventInElement('#button_message_send_to_driver', 'onclick', () => {
    let message_send_to_driver = document.getElementById('message_send_to_driver').value
    let props = {
      centralId: currentCentralId,
      message_send_to_driver: message_send_to_driver,
    }
    CentralRepository.storeNotification(props)
      .then((data) => {
        showSuccessToast()
      })
      .catch((error) => {
        console.log(error)
      })
  })

  checkboxGroupNotification.addEventListener('change', (event) => {
    const isEnabled = event.target.checked

    let props = {
      centralId: currentCentralId,
      send_to_group: isEnabled,
    }

    CentralRepository.storeNotification(props)
      .then((data) => {
        showSuccessToast()
      })
      .catch((error) => {
        console.log(error)
      })
  })

  checkboxUserotification.addEventListener('change', (event) => {
    const isEnabled = event.target.checked
    let props = {
      centralId: currentCentralId,
      send_to_driver: isEnabled,
    }
    CentralRepository.storeNotification(props)
      .then((data) => {
        showSuccessToast()
      })
      .catch((error) => {
        console.log(error)
      })
  })

  selectGroupsByCurrentSessionActivies.addEventListener('change', (event) => {
    let itemSeleted = document.getElementById('list-groups-by-current-session-activies').value

    let props = {
      centralId: currentCentralId,
      group_reference: itemSeleted,
    }
    CentralRepository.storeNotification(props)
      .then((data) => {
        showSuccessToast()
      })
      .catch((error) => {
        console.log(error)
      })
  })

  async function syncNotificationSettings() {
    let settings = CentralRepository.fetchMyNotifcationConfigs(currentCentralId)

    settings
      .then((response) => {
        const data = response.data
        const checkboxUserotification = (document.getElementById(
          'manage-user-notification'
        ).checked = data.send_to_driver)
        const checkboxGroupNotification = (document.getElementById(
          'manage-group-notification'
        ).checked = data.send_to_group)

        const messageSendToDriver = (document.getElementById('message_send_to_driver').value =
          data.message_send_to_driver)

        const messageSendToGroup = (document.getElementById('message_send_to_group').value =
          data.message_send_to_group)
      })
      .catch((error) => {
        console.log(error, 'erro')
      })
      .finally(() => {
        document.getElementById('spinner-preload-groups-wpp').style.display = 'none'
      })
  }
})
