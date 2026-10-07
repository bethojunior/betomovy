const elementProperty = new ElementProperty();
let typePayment = 'card';
let cobrancePixId;
let central = Session.get("centralSelected");

document.addEventListener("DOMContentLoaded",function () {
    Mask.setMaskCpf("#documentInput");
    Mask.setCreditCard("#cardNumberInput");
    $("#cardSecurityCode").inputmask({mask: ['999', '9999']});
    $("#cardValidity").inputmask({mask: ['99/9999']});
    $("#cepInput").inputmask({mask: ['99.999-999']});

    listVoucher();

    function listVoucher() {
        preload(true);

        if(central.responsibleId) {
            CentralRepository.getBalance(central.responsibleId).then(({response}) => {
                const voucherElement = document.querySelector('#saldVoucher')
                if(response.tripBalance && response.tripBalance !== 0 && voucherElement){
                    document.querySelector('#saldVoucher').innerHTML = `Saldo: ${JSON?.parse(localStorage?.getItem('cityConfig'))?.typeMoney} ${Mask.maskMoney(response.tripBalance)}`
                }
            });
        }

        VoucherController.getAll(central.latitude, central.longitude).then(({data}) => {
            viewController.elementProperty.getElement('.content-voucher', element => {
                element.innerHTML = data.filter(item => item.user === 'central').map(item => {
                    return `
                            <div class="card-voucher">
                                <div class="money-content">
                                    <img alt="whatever" class="money-icon" src="/webfiles/img/icon/money.png"/>
                                    <h5>${Mask.maskMoney(parseFloat(item.amount))} reais</h5>
                                </div>
                                <div class="buy-content">
                                    <label class="discount-label">-${Mask.maskMoney(parseFloat(item.percentage))}%</label>
                                    <button class="btn btn-danger buyVoucher" data=${JSON.stringify(item)}>COMPRAR</button>
                                </div>
                            </div>
                            `
                }).join("");
            });

            viewController.elementProperty.addEventInElement('.buyVoucher', 'onclick', function() {
                preload(true);

                CentralVoucherPurchasePaymentController.getVoucherPurchasePaymentForms().then(result => {
                    if (result.response) {
                        result.response.forEach((item) => {
                            if (item.paymentFormId === 1 && item.isActive) {
                                document.querySelector("#btn-card").style.display = 'block';
                            } else if (item.paymentFormId === 1 && !item.isActive) {
                                document.querySelector("#btn-card").style.display = 'none';
                                document.querySelector(".front").style.display = 'none';
                                document.querySelector('.flipper').style.transform = 'rotateY(180deg)';
                            } else if (item.paymentFormId === 4 && item.isActive) {
                                document.querySelector("#btn-pix").style.display = 'block';
                            } else if (item.paymentFormId === 4 && !item.isActive) {
                                document.querySelector("#btn-pix").style.display = 'none';
                            }
                        });
                    }
                });

                const data = JSON.parse(this.getAttribute("data"));

                VoucherController.generateChargePix(data.value, central.responsibleId, data.amount).then(({status, response}) => {
                    preload(false);
                    if(!status){
                        return SwalCustom.messageDialog('Recarregue a página e tente novamente', 'Não foi possível gerar o pagamento via pix', undefined, 'error');
                    }

                    cobrancePixId = response.pedido.id;

                    document.querySelector('#pixCopyAndPaste').innerHTML = response.pedido.qrCodePix;
                    document.querySelector('#qrCodeImage').src = `https://chart.googleapis.com/chart?cht=qr&chl=${response.pedido.qrCodePix}&chs=160x160&chld=L|0`;

                    document.querySelector('.value-label').innerHTML = `Valor: <b>${Mask.maskMoney(parseFloat(data.value))}</b>`
                    $("#buyVoucherModal").modal("show");

                }).catch(() => {
                    setTimeout(() => {
                        SwalCustom.messageDialog('Recarregue a página e tente novamente', 'Estamos com problema para gerar sua cobrança em pix', (preload(false)), "error");
                    }, 10000);
                });

                viewController.elementProperty.addEventInElement('.btn-finish', 'onclick', function() {
                    preload(true);
                     if(typePayment === 'card'){
                        const cardHolder = document.querySelector('#cardHolderNameInput').value;
                        const cardNumber = document.querySelector('#cardNumberInput').value;
                        const cardValidated = document.querySelector('#cardValidity').value;
                        const cardCVV = document.querySelector('#cardSecurityCode').value;
                        const userDocument = document.querySelector('#documentInput').value;
                        const userUF = document.querySelector('#ufInput').value;
                        const userCity = document.querySelector('#cityInput').value;
                        const userCEP = document.querySelector('#cepInput').value;

                        if(cardNumber === '' || cardHolder === '' || cardValidated === '' || cardCVV === '' || userDocument === '' || userUF === '' || userCity === '' || userCEP === ''){
                            return SwalCustom.messageDialog('Todos os campos são obrigatórios', 'Atenção', preload(false), 'info');
                        }

                        const paymentInfo = {
                            cardHolder,
                            cardNumber,
                            cardValidated,
                            cardCVV,
                            userDocument,
                            userUF,
                            userCity,
                            userCEP,
                            value: data.value,
                            responsibleId: central.responsibleId,
                            bonusVoucher: data.amount,
                        }

                        VoucherController.buyWithCard(paymentInfo).then(({status, response}) => {
                            preload(false);
                            if(!status){
                                return SwalCustom.messageDialog(response[0], 'Não foi possível efetuar o pagamento', undefined, 'error');
                            }

                            SwalCustom.messageDialog('Em breve seu saldo em voucher será liberado!', 'Pagamento efetuado com sucesso!', () =>{
                                $("#buyVoucherModal").modal("hide");
                            }, 'success');
                        }).catch(() => {
                            setTimeout(() => {
                                SwalCustom.messageDialog('Tente novamente', 'Ocorreu um erro ao efetuar a compra', (preload(false)), "error");
                            }, 10000);
                        });
                    } else {
                         SwalCustom.messageDialog('Em, no máximo, uma hora seu saldo em voucher será liberado', 'Aguardaremos a confirmação de seu pagamento via pix', (() => {
                             $("#buyVoucherModal").modal("hide");
                             preload(false);
                         }), 'success');
                    }
                });
            })
        }).finally(() => {
            preload(false)
        });

        viewController.elementProperty.addEventInElement('#btn-pix', 'onclick', function() {
            document.querySelector('.flipper').style.transform = 'rotateY(180deg)';
            typePayment = 'pix';
        });

        viewController.elementProperty.addEventInElement('#btn-card', 'onclick', function() {
            document.querySelector('.flipper').style.transform = '';
            typePayment = 'card';
        });
    }
})