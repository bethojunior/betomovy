const SchedulePicker = (() => {
  const MAX_DATES = 30

  const ELEMENTS = {
    monthLabel: 'schedulePickerMonthLabel',
    calendarDays: 'schedulePickerCalendarDays',
    prevMonth: 'schedulePickerPrevMonth',
    count: 'schedulePickerCount',
    time: 'schedulePickerTime',
    timeChips: 'schedulePickerTimeChips',
    triggerLabel: 'nameScheduleTrip',
  }

  const state = {
    selectedDates: new Set(), // 'YYYY-MM-DD'
    viewDate: moment(),
  }

  function isActive() {
    return state.selectedDates.size > 0
  }

  function renderCalendar() {
    const monthLabel = document.getElementById(ELEMENTS.monthLabel)
    const daysContainer = document.getElementById(ELEMENTS.calendarDays)

    if (!monthLabel || !daysContainer) return

    monthLabel.textContent = state.viewDate.format('MMMM YYYY')

    const prevButton = document.getElementById(ELEMENTS.prevMonth)
    if (prevButton) prevButton.disabled = state.viewDate.isSameOrBefore(moment(), 'month')

    const startOfMonth = state.viewDate.clone().startOf('month')
    const endOfMonth = state.viewDate.clone().endOf('month')
    const startWeekday = startOfMonth.day()
    const today = moment().startOf('day')

    let html = ''

    for (let i = 0; i < startWeekday; i++) {
      html += '<span class="schedule-picker-calendar__day schedule-picker-calendar__day--empty"></span>'
    }

    for (let day = 1; day <= endOfMonth.date(); day++) {
      const current = startOfMonth.clone().date(day)
      const key = current.format('YYYY-MM-DD')
      const isPast = current.isBefore(today, 'day')
      const isSelected = state.selectedDates.has(key)

      html += `<button type="button" class="schedule-picker-calendar__day${isSelected ? ' schedule-picker-calendar__day--selected' : ''}" data-date="${key}" ${isPast ? 'disabled' : ''}>${day}</button>`
    }

    daysContainer.innerHTML = html

    daysContainer.querySelectorAll('.schedule-picker-calendar__day:not(:disabled)').forEach((button) => {
      button.onclick = function () {
        toggleDate(this.getAttribute('data-date'))
      }
    })
  }

  function toggleDate(dateKey) {
    if (!dateKey) return

    if (state.selectedDates.has(dateKey)) {
      state.selectedDates.delete(dateKey)
    } else {
      if (state.selectedDates.size >= MAX_DATES) {
        SwalCustom.messageDialog(
          `É possível selecionar no máximo ${MAX_DATES} datas por vez`,
          'Atenção',
          undefined,
          'warning'
        )
        return
      }
      state.selectedDates.add(dateKey)
    }

    renderCalendar()
    renderSummary()
  }

  function renderSummary() {
    const dates = Array.from(state.selectedDates).sort()

    renderCount(dates)
    renderTriggerLabel(dates)
    renderApplyButtonState(dates)
    renderSearchPersonalizadaButtonState(dates)
    renderTimeChips()
  }

  function renderApplyButtonState(dates) {
    const applyButton = document.getElementById('btnApplyScheduleForm')
    if (!applyButton) return

    applyButton.disabled = dates.length === 0
  }

  // Agendamento usa o pool de motoristas próprio (ScheduleDriverPool), não a
  // busca personalizada de viagem instantânea — botão some enquanto houver
  // datas de agendamento selecionadas.
  function renderSearchPersonalizadaButtonState(dates) {
    const searchPersonalizadaButton = document.getElementById('list-active-drivers')
    if (!searchPersonalizadaButton) return

    searchPersonalizadaButton.style.display = dates.length > 0 ? 'none' : ''
  }

  function renderCount(dates) {
    const countLabel = document.getElementById(ELEMENTS.count)
    if (!countLabel) return

    countLabel.textContent = `${dates.length} data${dates.length === 1 ? '' : 's'} selecionada${dates.length === 1 ? '' : 's'}`
  }

  function renderTriggerLabel(dates) {
    const nameLabel = document.getElementById(ELEMENTS.triggerLabel)
    if (!nameLabel) return

    const time = document.getElementById(ELEMENTS.time)?.value

    if (dates.length === 0) {
      nameLabel.textContent = 'Agendar'
    } else if (dates.length === 1) {
      nameLabel.textContent = time
        ? `${moment(dates[0]).format('DD/MM/YYYY')} às ${time}`
        : `${moment(dates[0]).format('DD/MM/YYYY')} — informe o horário`
    } else {
      nameLabel.textContent = `${dates.length} viagens agendadas${time ? ` às ${time}` : ''}`
    }
  }

  // Arredonda pra cima pra próxima hora cheia — evita que minutos perto da
  // virada (ex: 13:59) resultem em pouquíssimo intervalo real até o horário.
  function nextRoundHour(base) {
    return base.minute() === 0 && base.second() === 0
      ? base.clone().startOf('hour')
      : base.clone().add(1, 'hour').startOf('hour')
  }

  function defaultTime() {
    return nextRoundHour(moment()).add(1, 'hour').format('HH:mm')
  }

  // Horários de maior demanda de mobilidade (pico manhã/tarde, almoço, noite)
  // — atalho, não limita o input: qualquer horário continua digitável.
  const IMPORTANT_HOURS = ['06:00', '07:00', '08:00', '12:00', '17:00', '18:00', '20:00', '22:00']

  // Se hoje está entre as datas selecionadas, um horário já passado não pode
  // ser escolhido — pra qualquer outra data (sempre futura), todo horário é válido.
  function isTimeSelectable(time) {
    const todayKey = moment().format('YYYY-MM-DD')
    if (!state.selectedDates.has(todayKey)) return true

    return moment(`${todayKey} ${time}`, 'YYYY-MM-DD HH:mm').isAfter(moment())
  }

  function renderTimeChips() {
    const container = document.getElementById(ELEMENTS.timeChips)
    if (!container) return

    const timeInput = document.getElementById(ELEMENTS.time)
    const currentValue = timeInput ? timeInput.value : ''

    container.innerHTML = IMPORTANT_HOURS
      .map((time) => {
        const isDisabled = !isTimeSelectable(time)
        const isActive = time === currentValue

        return `<button type="button" class="schedule-picker-time-chip${isActive ? ' active' : ''}" data-time="${time}" ${isDisabled ? 'disabled' : ''}>${time}</button>`
      })
      .join('')

    container.querySelectorAll('.schedule-picker-time-chip:not(:disabled)').forEach((chip) => {
      chip.onclick = function () {
        if (!timeInput) return

        timeInput.value = this.dataset.time
        timeInput.classList.remove('is-invalid')
        renderSummary()
      }
    })
  }

  function open() {
    // Pré-seleciona hoje + horário atual arredondado (+1h) só quando o
    // operador ainda não escolheu nada — reabrir o painel não deve
    // sobrescrever uma seleção já feita.
    if (state.selectedDates.size === 0) {
      state.viewDate = moment()
      state.selectedDates.add(moment().format('YYYY-MM-DD'))
    }

    if (document.querySelector('.footer-payment-form')?.classList.contains('active')) {
      Route.backPage()
    }

    Route.startClassesInComponent(
      [{ component: '.footer-schedule-form', class: 'active' }],
      () => {
        viewController.elementProperty.removeClass('.footer-schedule-form', 'active')
      },
      COMPONENT_CREATE_TRIP
    )

    const timeInput = document.getElementById(ELEMENTS.time)
    timeInput?.classList.remove('is-invalid')

    if (timeInput && !timeInput.value) {
      timeInput.value = defaultTime()
    }

    renderCalendar()
    renderSummary()

    setTimeout(() => timeInput?.focus(), 300)
  }

  // Route.backPage() desempilha o topo da pilha global de navegação (mesmo
  // mecanismo do modal de forma de pagamento) — não remove a classe direto.
  function close() {
    Route.backPage()
  }

  function reset() {
    state.selectedDates.clear()
    state.viewDate = moment()

    const timeInput = document.getElementById(ELEMENTS.time)
    if (timeInput) timeInput.value = ''

    if (document.querySelector('.footer-schedule-form')?.classList.contains('active')) {
      close()
    }

    renderCalendar()
    renderSummary()
  }

  function getSchedules() {
    const timeInput = document.getElementById(ELEMENTS.time)
    const time = timeInput ? timeInput.value : ''

    if (!time) return null

    const dates = Array.from(state.selectedDates).sort()

    if (dates.length === 0) return null

    return dates.map((date) => {
      const datetime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm')

      return {
        schedule: datetime.format('YYYY-MM-DD HH:mm:ss'),
        scheduleUTC: datetime.utc().toISOString(),
      }
    })
  }

  function buildResultMessage(results) {
    if (results.length === 1) {
      const [result] = results
      return result.success
        ? '1 viagem agendada criada com sucesso.'
        : (result.error || 'Não foi possível criar a viagem agendada.')
    }

    const succeeded = results.filter((item) => item.success)
    const failed = results.filter((item) => !item.success)

    const base = succeeded.length === 1
      ? '1 viagem agendada criada com sucesso.'
      : `${succeeded.length} viagens agendadas criadas com sucesso.`

    if (failed.length === 0) return base

    const uniqueErrors = [...new Set(failed.map((item) => item.error || 'não foi possível criar'))]

    const failedIntro = failed.length === 1
      ? '1 viagem não pôde ser criada:'
      : `${failed.length} viagens não puderam ser criadas:`

    return `${base}\n${failedIntro}\n${uniqueErrors.join('\n')}`
  }

  function showResult(results) {
    const failed = results.filter((item) => !item.success)

    SwalCustom.messageDialog(
      buildResultMessage(results),
      results.length > 1 ? 'Agendamento em lote' : 'Agendamento',
      undefined,
      failed.length === 0 ? 'success' : 'warning'
    )
  }

  function applyForm() {
    const timeInput = document.getElementById(ELEMENTS.time)
    const time = timeInput ? timeInput.value : ''

    if (state.selectedDates.size > 0 && !time) {
      timeInput?.classList.add('is-invalid')
      SwalCustom.messageDialog(
        'Informe o horário para agendar a viagem',
        'Atenção',
        () => timeInput?.focus(),
        'warning'
      )
      return
    }

    close()
  }

  viewController.elementProperty.addEventInElement('#choiceScheduleTrip', 'onclick', open)
  viewController.elementProperty.addEventInElement('.close-schedule-form', 'onclick', close)
  viewController.elementProperty.addEventInElement('#btnApplyScheduleForm', 'onclick', applyForm)
  viewController.elementProperty.addEventInElement(`#${ELEMENTS.time}`, 'onchange', function () {
    this.classList.remove('is-invalid')
    renderSummary()
  })

  viewController.elementProperty.addEventInElement(`#${ELEMENTS.prevMonth}`, 'onclick', function () {
    if (state.viewDate.isSameOrBefore(moment(), 'month')) return
    state.viewDate = state.viewDate.clone().subtract(1, 'month')
    renderCalendar()
  })

  viewController.elementProperty.addEventInElement('#schedulePickerNextMonth', 'onclick', function () {
    state.viewDate = state.viewDate.clone().add(1, 'month')
    renderCalendar()
  })

  viewController.elementProperty.addEventInElement('#schedulePickerClear', 'onclick', function () {
    state.selectedDates.clear()
    renderCalendar()
    renderSummary()
  })

  renderCalendar()
  renderSummary()

  return { isActive, getSchedules, reset, showResult }
})()
