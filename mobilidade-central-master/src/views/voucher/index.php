<div class="container-main">
    <div class="vc-page">

        <!-- ── Cabeçalho ── -->
        <div class="vc-header">
            <h1 class="vc-title">Vouchers</h1>
            <span class="vc-balance" id="saldVoucher">Saldo: R$ 0,00</span>
        </div>

        <!-- ── Grid de vouchers (preenchido pelo JS) ── -->
        <div class="content-voucher"></div>

        <!-- ── Modal de compra ── -->
        <div class="modal" tabindex="-1" id="buyVoucherModal">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content vc-modal">

                    <div class="modal-header vc-modal__header">
                        <h5 class="modal-title vc-modal__title">Comprar voucher</h5>
                        <button type="button" class="close vc-modal__close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div class="modal-body vc-modal__body">

                        <!-- Tabs de método + valor -->
                        <div class="vc-pay-header">
                            <div class="vc-pay-tabs">
                                <button class="vc-pay-tab form-payment-button btn-flipper" id="btn-card">Cartão</button>
                            </div>
                            <span class="value-label"></span>
                        </div>

                        <!-- Flip: frente = cartão | verso = PIX -->
                        <div class="flip-container">
                            <div class="flipper">

                                <!-- Frente: dados do cartão -->
                                <div class="front vc-form">

                                    <div class="vc-field">
                                        <label class="vc-label" for="cardHolderNameInput">Nome do titular</label>
                                        <input class="vc-input form-control" id="cardHolderNameInput" autofocus>
                                    </div>

                                    <div class="vc-row">
                                        <div class="vc-field">
                                            <label class="vc-label" for="cardNumberInput">Número do cartão</label>
                                            <input class="vc-input form-control" id="cardNumberInput">
                                        </div>
                                        <div class="vc-field">
                                            <label class="vc-label" for="documentInput">CPF do titular</label>
                                            <input class="vc-input form-control" id="documentInput">
                                        </div>
                                    </div>

                                    <div class="vc-row">
                                        <div class="vc-field">
                                            <label class="vc-label" for="cardValidity">Validade</label>
                                            <input class="vc-input form-control" id="cardValidity">
                                        </div>
                                        <div class="vc-field">
                                            <label class="vc-label" for="cardSecurityCode">Cód. de segurança</label>
                                            <input class="vc-input form-control" id="cardSecurityCode" maxlength="4">
                                        </div>
                                    </div>

                                    <div class="vc-row vc-row--3">
                                        <div class="vc-field">
                                            <label class="vc-label" for="ufInput">UF</label>
                                            <input class="vc-input form-control" id="ufInput" maxlength="2">
                                        </div>
                                        <div class="vc-field">
                                            <label class="vc-label" for="cityInput">Cidade</label>
                                            <input class="vc-input form-control" id="cityInput">
                                        </div>
                                        <div class="vc-field">
                                            <label class="vc-label" for="cepInput">CEP</label>
                                            <input class="vc-input form-control" id="cepInput">
                                        </div>
                                    </div>

                                </div>

                                <!-- Verso: PIX -->
                                <div class="back vc-pix">
                                    <p class="vc-pix__title">Leia o QR Code</p>
                                    <img id="qrCodeImage"
                                         src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=MOVY"
                                         class="qr-code vc-pix__qr">
                                    <div class="vc-pix__copy">
                                        <p class="vc-pix__hint">Ou copie e cole no seu app do banco</p>
                                        <p class="vc-pix__code" id="pixCopyAndPaste"></p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    <div class="modal-footer vc-modal__footer">
                        <button type="button" class="vc-btn vc-btn--cancel" data-dismiss="modal">Cancelar</button>
                        <button type="submit" class="vc-btn vc-btn--confirm btn-finish">Finalizar pagamento</button>
                    </div>

                </div>
            </div>
        </div>

    </div>
</div>
