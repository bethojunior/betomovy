viewController.setObserver(
  'extract-financial',
  function ({ driverInfo, transactions, paginate, userLogged, dateInterval, flow }) {
    const elementProperty = new ElementProperty()
    const paginateService = new PaginateService()
    const balanceController = new BalanceController()

    const managerList = {
      isGroup: '',
      type: 1
    }

    elementProperty.getElement('#nameClientExtract', (element) => {
      element.innerHTML = driverInfo.name || 'Não informado'
    })

    elementProperty.getElement('#cpfClientExtract', (element) => {
      element.innerHTML = driverInfo.document || 'Não informado'
    })

    elementProperty.getElement('#periodExtract', (element) => {
      element.innerHTML = driverInfo.period
    })

    elementProperty.getElement('.value-balance', (element) => {
      element.innerHTML = Mask.maskMoney(parseFloat(driverInfo.balance || 0))
    })

    elementProperty.getElement('#totalCredit', (element) => {
      element.innerHTML = Mask.maskMoney(parseFloat(driverInfo.total_credit))
    })
    elementProperty.getElement('#totalDebit', (element) => {
      element.innerHTML = Mask.maskMoney(parseFloat(driverInfo.total_debit))
    })
    elementProperty.getElement('#pendingBalanceWithdraw', (element) => {
      element.innerHTML = Mask.maskMoney(parseFloat(driverInfo.blockedBalance || 0))
    })

    paginateService.setList(paginate, '#listTransactionsExtract', (transaction, element) => {
      element.innerHTML += ' '

      if (managerList.isGroup !== transaction.tripReference) {
        managerList.isGroup = transaction.tripReference

        if (managerList.type > 0) {
          managerList.type--
        } else {
          managerList.type++
        }
      }

      const style = parseFloat(transaction.value) < 0 ? 'color:red' : ''
      const detailLabel = getTextTranslate('financial', 'detail-label') || 'Detalhamento'
      const observationHtml = transaction.observation
        ? `<div class="detail-transition">${detailLabel}: ${transaction.observation}</div>`
        : ''

      element.innerHTML += `<li class="type-${managerList.type}">
                     <div class="cicler-customer v${transaction.balanceFlowTypeId}" 
                    classCustomer="${transaction.balanceFlowTypeId}"
                        color="${transaction.color}">
                            <span style="background-color: ${transaction.color}"></span>
                        </div>
                    <div class="container-info-transition">
                        <div class="time-transition">${transaction.date}</div>
                        <div class="description-transition">${transaction.summary}</div>
                        <div class="value-transition" style="${style}">${Mask.maskMoney(
        parseFloat(transaction.value)
      )}</div>
                        ${observationHtml}
                    </div>
                </li>`
      //initColors();
    })

    paginateService.setNewPage(transactions)
    paginateService.updatePage((page) => {
      elementProperty.getElement('#preloadExtract', (element) => {
        element.style.display = 'block'
      })

      balanceController
        .driverTransactions(userLogged.idDriver, dateInterval, page, flow)
        .promise.then(({ status, data }) => {
          paginateService.nextPage = data.paginate.nextPage
          paginateService.setNewPage(data.transactions)
          elementProperty.getElement('#preloadExtract', (element) => {
            element.style.display = 'none'
          })
        })
    })

    elementProperty.addEventInElement('.back-to', 'onclick', function () {
      Route.backPage()
      elementProperty.getElement('#listTransactionsExtract', (element) => {
        element.scrollTop = 0
        element.innerHTML = ''
      })
    })

    function initColors() {
      elementProperty.getElement('.cicler-customer', (elementCss) => {
        document.styleSheets[0].addRule(
          `.body-account > ul > li > .cicler-customer.v${elementCss.getAttribute(
            'classCustomer'
          )}:before`,
          `background-color: ${elementCss.getAttribute('color')}`
        )
      })
    }

    Route.pageDynamic()
  }
)
