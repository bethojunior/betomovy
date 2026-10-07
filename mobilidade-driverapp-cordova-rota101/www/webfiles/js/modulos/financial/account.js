viewController.setObserver('account', function () {
  const PaymentConstants = {
    PAYMENT_STATUS: {
      PAID: 1,
      CANCELED: 2,
      PENDING: 3
    }
  }

  const AdquirerConstants = {
    ADQUIRER: {
      ID_704_PAY: 13,
      ID_EPAG: 14
    }
  }

  const userLogged = Session.get('user')

  const elementProperty = new ElementProperty()
  const balanceController = new BalanceController()

  PreloaderCustomer.show()

  function verifyAdquirent(idAdquirent) {
    if ([
      AdquirerConstants.ADQUIRER.ID_704_PAY,
      AdquirerConstants.ADQUIRER.ID_EPAG
    ].includes(idAdquirent)) {
      return true
    }
    return false
  }

  function verifyItsBalanceNegative(balance, callback) {
    balanceController.verifyCurrentAdquirer().then(({ status, data, message }) => {
      if (verifyAdquirent(Number(data?.idFinancialIntermediary)) === false) {
        return
      }

      if (Number(balance) < 0) {
        if (callback) callback()
      }
    })
  }

  function generateQrcode(text, element) {
    cordova.plugins.qrcodejs.encode(
      'TEXT_TYPE',
      `${text}`,
      (base64EncodedQRImage) => {
        element.src = `${base64EncodedQRImage}`
      },
      (err) => {
        SwalCustom.messageDialog('Ocorreu um erro ao gerar qrcode', 'Ops...', undefined, 'info')
      },
      {
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff'
      }
    )
  }

  function verifyPaymentPixCode(idPix, timeInterval, intervalCount) {
    balanceController.verifyPaymentPixCode(idPix).then(({ status, data, message }) => {
      if (!status) {
        SwalCustom.messageDialog('', message, undefined, 'warning')
        return
      }

      if (data?.pixData?.payment_status_id === PaymentConstants.PAYMENT_STATUS.PAID) {
        elementProperty.getElement('.container-modal-pix-payment', (element) => {
          element?.classList?.remove('active')
        })
        SwalCustom.messageDialog('', 'Pagamento efetuado com sucesso!', undefined, 'success')
        clearPaymentPix()
        requestBalanceDriver()

        if (timeInterval) clearInterval(timeInterval)
        if (intervalCount) clearInterval(intervalCount)
      }
    })
  }

  function clearPaymentPix(condition = false) {
    const pixKeyEl = document.getElementById('btn-copy-pix')
    pixKeyEl.value = ''
    const qrCodePix = document.getElementById('qr-code-pix')
    qrCodePix.src = ''
    const inputCodePix = document.getElementById('input-pix-key')
    inputCodePix.value = ''
    if (!condition) {
      elementProperty.getElement('#btnTransference', (el) => {
        el.innerHTML = 'Transferir'
      })

      elementProperty.addEventInElement('#btnTransference', 'onclick', function () {
        Route.redirectDynamic('Financial', 'Transference')
      })
    }
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  function mountPixCode(balance) {
    const valuePix = document.getElementById('value-pix')
    valuePix.innerHTML = `<span>${CityConfig.getTypeCoin()}</span>${Mask.maskMoney(
      parseFloat(balance)
    )}`

    const priceToPay = parseFloat(balance) < 0 ? parseFloat(balance) * -1 : parseFloat(balance)

    const pixKeyEl = document.getElementById('btn-copy-pix')
    const inputKeyEl = document.getElementById('input-pix-key')

    const containerPix = document.querySelector('.container-pix-payment-info-body-pix-key')

    document.getElementById('loading-pix').classList.add('active')

    const imageQrCode = document.querySelector('#qr-code-pix')
    imageQrCode.style.display = 'none'
    containerPix.style.display = 'none'

    const countPixEl = document.getElementById('count-pix')

    balanceController.generatePixCode(priceToPay).then(({ status, data, message }) => {
      document.getElementById('loading-pix').classList.remove('active')
      imageQrCode.style.display = 'block'
      containerPix.style.display = 'flex'

      if (!status) {
        clearPaymentPix(true)
        elementProperty.getElement('.container-modal-pix-payment', (element) => {
          element?.classList?.remove('active')
        })
        SwalCustom.messageDialog('', message, undefined, 'warning')
        return
      }

      generateQrcode(
        `${data?.pixData?.qrCodeContent || data?.pixData?.pix_payment?.qrCodeContent}`,
        document.getElementById('qr-code-pix')
      )

      pixKeyEl.value = data?.pixData?.qrCodeContent || data?.pixData?.pix_payment?.qrCodeContent
      inputKeyEl.value = data?.pixData?.qrCodeContent || data?.pixData?.pix_payment?.qrCodeContent

      const secconds = 120
      const timeOutVerifyPayment = setInterval(() => {
        verifyPaymentPixCode(data?.idTransaction, timeOutVerifyPayment, intervalCount)
      }, 10000)

      countPixEl.innerHTML = formatTime(secconds)

      const intervalCount = setInterval(() => {
        const currentSeconds =
          parseInt(countPixEl.innerHTML.split(':')[1]) +
          parseInt(countPixEl.innerHTML.split(':')[0]) * 60
        if (currentSeconds > 0) {
          countPixEl.innerHTML = formatTime(currentSeconds - 1)
        }
      }, 1000)

      setTimeout(() => {
        if (timeOutVerifyPayment) clearInterval(timeOutVerifyPayment)
        if (intervalCount) clearInterval(intervalCount)
      }, secconds * 1000)
    })
  }

  function requestBalanceDriver() {
    balanceController.lastDriverTransactions(userLogged.idDriver).then(({ data, status }) => {
      PreloaderCustomer.hidden()
      if (!status) return

      elementProperty.getElement('#balanceDriver', (element) => {
        element.innerHTML = `<span>${CityConfig.getTypeCoin()}</span>${Mask.maskMoney(
          parseFloat(data.balance.balance)
        )}`
      })

      elementProperty.getElement('#listLastTransactions', (element) => {
        let isGroup = ''
        let type = 1
        let arrayToCompare = []

        element.innerHTML = ' '

        data.transactions.map((transaction) => {
          if (isGroup !== transaction.tripReference) {
            isGroup = transaction.tripReference

            if (type > 0) {
              type--
            } else {
              type++
            }
          }

          const style = parseFloat(transaction.value) < 0 ? 'color:red' : ''
          const detailLabel = getTextTranslate('financial', 'detail-label') || 'Detalhamento'
          const observationHtml = transaction.observation
            ? `<div class="detail-transition">${detailLabel}: ${transaction.observation}</div>`
            : ''

          const isDuplicated = arrayToCompare.some(
            (el) =>
              el.tripReference === item.tripReference &&
              el.price === item.price &&
              el.flow === item.flow &&
              el.date === item.date
          )

          if (!isDuplicated) {
            element.innerHTML += `<li class="type-${type}">
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
          }
        })
      })
    })
  }

  function copyPixCode() {
    elementProperty.addEventInElement('#btn-copy-pix', 'onclick', function () {
      const pixKey = document.getElementById('btn-copy-pix').value

      if (!pixKey) {
        console.error('Chave PIX estÃ¡ vazia ou indefinida.')
        return
      }

      var tempTextArea = document.createElement('textarea')
      tempTextArea.style.position = 'fixed'
      tempTextArea.style.top = '0'
      tempTextArea.style.left = '0'
      tempTextArea.style.opacity = '0'
      tempTextArea.value = pixKey

      document.body.appendChild(tempTextArea)
      tempTextArea.focus()
      tempTextArea.select()

      try {
        var successful = document.execCommand('copy')
        if (successful) {
          SwalCustom.messageDialog('', 'Chave PIX copiada com sucesso!', undefined, 'success')
        } else {
          console.error('Falha ao copiar a chave PIX.')
        }
      } catch (err) {
        console.error('Erro ao copiar a chave PIX: ', err)
      }
      document.body.removeChild(tempTextArea)
    })
  }

  elementProperty.addEventInElement('#btnTransference', 'onclick', function () {
    Route.redirectDynamic('Financial', 'Transference')
  })

  balanceController.lastDriverTransactions(userLogged.idDriver).then(({ data, status }) => {
    PreloaderCustomer.hidden()
    if (!status) return

    elementProperty.getElement('#balanceDriver', (element) => {
      element.innerHTML = `<span>${CityConfig.getTypeCoin()}</span>${Mask.maskMoney(
        parseFloat(data.balance.balance)
      )}`
    })

    function showPixModal(value) {
      elementProperty.getElement('.container-modal-pix-payment', (element) => {
        element.classList.add('active')
      })

      elementProperty.addEventInElement('.close-modal-pix-payment', 'onclick', function () {
        elementProperty.getElement('.container-modal-pix-payment', (element) => {
          element.classList.remove('active')
        })
      })
      mountPixCode(value)
      copyPixCode()
    }

    verifyItsBalanceNegative(data?.balance?.balance, () => {
      elementProperty.getElement('#btnTransference', (el) => {
        el.innerHTML = 'Pagar'
      })

      elementProperty.addEventInElement('#btnTransference', 'onclick', function () {
        const config = Session.get('configGeneral')
        const minimumValue =
          config.find((item) => {
            return item.key === 'minimum_value_for_pix'
          }) ?? '10'

        if (data?.balance?.balance * -1 < parseFloat(minimumValue?.value || 10)) {
          return SwalCustom.dialogConfirm(
            'Observação',
            `O valor mínimo para gerar o Pix é ${
              CityConfig.getTypeCoin() + minimumValue?.value
            }. Qualquer valor pago acima do saldo devedor será adicionado como crédito em sua carteira.
                    `,
            (status) => {
              if (status) {
                showPixModal(minimumValue?.value)
              }
            }
          )
        }

        showPixModal(data?.balance?.balance)
      })
    })

    elementProperty.getElement('#listLastTransactions', (element) => {
      let isGroup = ''
      let type = 1
      let arrayToCompare = []

      element.innerHTML = ' '

      data.transactions.map((transaction) => {
        if (isGroup !== transaction.tripReference) {
          isGroup = transaction.tripReference

          if (type > 0) {
            type--
          } else {
            type++
          }
        }

        const style = parseFloat(transaction.value) < 0 ? 'color:red' : ''
        const detailLabel = getTextTranslate('financial', 'detail-label') || 'Detalhamento'
        const observationHtml = transaction.observation
          ? `<div class="detail-transition">${detailLabel}: ${transaction.observation}</div>`
          : ''

        const isDuplicated = arrayToCompare.some(
          (el) =>
            el.tripReference === item.tripReference &&
            el.price === item.price &&
            el.flow === item.flow &&
            el.date === item.date
        )

        if (!isDuplicated) {
          element.innerHTML += `<li class="type-${type}">
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
        }
      })

      /*elementProperty.getElement(".cicler-customer",elementCss=>{
                document.styleSheets[0].addRule(
                    `.body-account > ul > li > .cicler-customer.v${elementCss.getAttribute("classCustomer")}:before`,
                    `background-color: ${elementCss.getAttribute("color")}`);
            })*/
    })
  })

  elementProperty.addEventInElement('.back-to', 'onclick', function () {
    Route.backPage()
  })

  elementProperty.addEventInElement('.close-modal-info-extract', 'onclick', function () {
    elementProperty.removeClass('.container-modal-info-extract', 'active')
  })

  elementProperty.addEventInElement('#openInfoExtract', 'onclick', function () {
    elementProperty.addClass('.container-modal-info-extract', 'active')
  })

  elementProperty.addEventInElement('#filterExtract', 'onclick', function () {
    viewController.addParams('filter-extract', undefined)
    Route.redirectDynamic('Financial', 'FilterExtract')
  })

  elementProperty.addEventInElement('#filterBy', 'onclick', function () {
    viewController.addParams('filter-extract', undefined)
    Route.redirectDynamic('Financial', 'Filter')
  })
  // elementProperty.addEventInElement("#btnTransference","onclick",function(){
  //     Route.redirectDynamic("Financial","Transference")
  // });
  elementProperty.addEventInElement('#btnPayment', 'onclick', function () {
    SwalCustom.messageDialog('', 'Em breve!', undefined, 'info')
  })

  elementProperty.getElement('#listTypesBalance', (element) => {
    balanceController.getTypes().then(({ status, data, message }) => {
      if (!status) {
        SwalCustom.messageDialog('', message, undefined, 'warning')
        return
      }

      element.innerHTML = data
        .map((type) => {
          return ` <li><div><div style="background-color: ${type.color}"></div></div>
                            <span>${type.short_description}</span></li>`
        })
        .join('')
    })
  })

  elementProperty.getElement('#contactSupport', (element) => {
    element.innerHTML = !Array.isArray(
      Session.getValueInSession('cityConfig', 'supportContactNumber')
    )
      ? Session.getValueInSession('cityConfig', 'supportContactNumber')
      : ''
  })

  Route.pageDynamic()
})
