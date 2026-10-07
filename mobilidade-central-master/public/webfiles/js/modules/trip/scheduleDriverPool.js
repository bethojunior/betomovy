const ScheduleDriverPool = (() => {
  const MODAL_SELECTOR = '#schedule-driver-pool-modal'
  const LIST_SELECTOR = '#scheduleDriverPoolList'
  const SHOW_MORE_SELECTOR = '#scheduleDriverPoolShowMore'

  const state = {
    selectedIds: new Set(), // ids de motorista, como string
    activeFilter: null, // null = todos | 'disponivel' | 'corrida' | 'desligado'
  }

  function isActive() {
    return state.selectedIds.size > 0
  }

  function getSelectedDriverIds() {
    return Array.from(state.selectedIds)
  }

  function driverStatusInfo(status) {
    switch (status) {
      case 'disponivel':
        return { label: 'Disponível', className: 'driver-status--available' }
      case 'corrida':
        return { label: 'Em corrida', className: 'driver-status--in_trip' }
      case 'desligado':
        return { label: 'Desligado', className: 'driver-status--off' }
      default:
        return { label: status || '', className: 'driver-status--off' }
    }
  }

  function renderCard(data) {
    const status = driverStatusInfo(data.status)
    const avatar = data.profileImageUrl
      ? `<img class="rounded-circle" src="${data.profileImageUrl}" width="55px" height="55px" alt="Foto motorista">`
      : `<div class="driver-avatar-fallback"><i class="material-icons">person</i></div>`

    const isSelected = state.selectedIds.has(String(data.idDriver))
    const favoriteColor = data.isFavorite ? '#f59e0b' : '#b5b5b5'

    return `
      <div class="d-flex">
        <div class="driver-card${isSelected ? ' active' : ''}" status="${data.status}" id="scheduleDriverPool-${data.idDriver}">
          ${avatar}
          <div>
            <p>${data.name}</p>
            <p>${data.phone}</p>
            <p class="driver-card__meta">
              <span class="driver-card__code">Código: ${Driver.code(data)}</span>
              <span class="driver-status ${status.className}">
                <span class="driver-status__dot"></span>${status.label}
              </span>
            </p>
          </div>
        </div>
        <i style="color: ${favoriteColor}" class="material-icons star-icon" aria-label="${data.isFavorite ? 'Favorito' : ''}">star</i>
      </div>
    `
  }

  function renderSummary() {
    const count = state.selectedIds.size
    const label = `${count} motorista${count === 1 ? '' : 's'} selecionado${count === 1 ? '' : 's'}`

    viewController.elementProperty.getElement('#scheduleDriverPoolCount', (element) => {
      element.textContent = label
    })

    viewController.elementProperty.getElement('#scheduleDriverPoolSummary', (element) => {
      element.textContent = count > 0 ? label : 'Selecionar motoristas'
    })
  }

  function toggleDriver(driverId) {
    const id = String(driverId)

    if (state.selectedIds.has(id)) {
      state.selectedIds.delete(id)
    } else {
      state.selectedIds.add(id)
    }

    viewController.elementProperty.getElement(`#scheduleDriverPool-${driverId}`, (card) => {
      card.classList.toggle('active', state.selectedIds.has(id))
    })

    renderSummary()
  }

  function bindCardEvents(drivers) {
    drivers.forEach((data) => {
      viewController.elementProperty.addEventInElement(`#scheduleDriverPool-${data.idDriver}`, 'onclick', function () {
        toggleDriver(data.idDriver)
      })
    })
  }

  function showMore(res, page) {
    viewController.elementProperty.getElement(SHOW_MORE_SELECTOR, (element) => {
      element.innerHTML = res.response.next_page_url
        ? `<button type="button" class="btn btn-primary" id="scheduleDriverPoolNextPage">Mostrar mais</button>`
        : ''
    })

    viewController.elementProperty.addEventInElement('#scheduleDriverPoolNextPage', 'onclick', function () {
      if (res.response.last_page <= page) return

      const centralId = Session.getValueInSession('centralSelected', 'id')

      preload(true)

      FavoriteDriver.listActives(centralId, page + 1, state.activeFilter).then((nextRes) => {
        preload(false)

        viewController.elementProperty.getElement(LIST_SELECTOR, (list) => {
          list.innerHTML += nextRes.response.data.map(renderCard).join('')
        })

        bindCardEvents(nextRes.response.data)
        showMore(nextRes, page + 1)
      })
    })
  }

  function fetchList() {
    const centralId = Session.getValueInSession('centralSelected', 'id')

    preload(true)

    FavoriteDriver.listActives(centralId, 1, state.activeFilter).then((res) => {
      preload(false)

      if (!res.status) {
        SwalCustom.messageDialog('', 'Erro ao buscar motoristas', () => {}, 'error')
        return
      }

      viewController.elementProperty.getElement(LIST_SELECTOR, (list) => {
        if (res.response.data.length === 0) {
          list.innerHTML = `<p class="drivers-empty-state">Nenhum motorista encontrado.</p>`
          viewController.elementProperty.getElement(SHOW_MORE_SELECTOR, (element) => { element.innerHTML = '' })
          return
        }

        list.innerHTML = res.response.data.map(renderCard).join('')
      })

      bindCardEvents(res.response.data)
      showMore(res, 1)
    })
  }

  function selectFilter(filter) {
    state.activeFilter = filter || null

    document.querySelectorAll(`${MODAL_SELECTOR} .drivers-filter-toggle-btn`).forEach((button) => {
      button.classList.toggle('active', button.dataset.filter === (filter || ''))
    })

    fetchList()
  }

  function bindFilterButtons() {
    document.querySelectorAll(`${MODAL_SELECTOR} .drivers-filter-toggle-btn`).forEach((button) => {
      button.onclick = () => selectFilter(button.dataset.filter)
    })
  }

  function open() {
    bindFilterButtons()
    fetchList()
    renderSummary()
    $(MODAL_SELECTOR).modal('show')
  }

  function close() {
    $(MODAL_SELECTOR).modal('hide')
  }

  function reset() {
    state.selectedIds.clear()
    state.activeFilter = null
    renderSummary()

    viewController.elementProperty.getElement('#scheduleDriverPoolToggle', (checkbox) => {
      checkbox.checked = false
    })

    viewController.elementProperty.getElement('#scheduleDriverPoolOpen', (button) => {
      button.style.display = 'none'
    })
  }

  viewController.elementProperty.addEventInElement('#scheduleDriverPoolOpen', 'onclick', open)

  viewController.elementProperty.addEventInElement('#scheduleDriverPoolToggle', 'onchange', function () {
    viewController.elementProperty.getElement('#scheduleDriverPoolOpen', (button) => {
      button.style.display = this.checked ? '' : 'none'
    })

    if (this.checked) {
      open()
      return
    }

    reset()
  })

  return { isActive, getSelectedDriverIds, reset, open, close }
})()
