<div class="container-default-monitor" style="height: 100%; margin: 0">
    <div class="d-flex">
        <div class="order-actives-container" id="orderActives">
            <label class="d-flex justify-content-center order-label">Pedidos Ativos</label>
            <hr class="d-flex justify-content-center" style="width: 80%; margin-left: 2vw"/>
            <div class="order-container" style="overflow-y: auto"></div>
        </div>
        <div class="content-map"></div>
    </div>
</div>

<div class="modal" tabindex="-1" id="moreDetailModal">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-header d-flex justify-content-center">
                <h6 class="modal-title">Detalhes do pedido</h6>
            </div>
            <div class="modal-body">
                <div class="d-flex justify-content-center">
                    <div class="image-profile" style="width: 60px; height: 60px; background-size: cover; border-radius: 8vw; margin-right: 1vw; margin-top: -0.5vw"></div>
                    <span class="mt-3 fantasyName"></span>
                </div>
                <div class="d-flex justify-content-center number-order-container mt-1">
                    <div class="font-weight-bold order-number"></div>
                </div>
                <div class="d-block mt-4 list-products-container"></div>
                <hr/>
                <div>
                    <div class="d-flex justify-content-between">
                        <span>Subtotal</span>
                        <span class="subtotal-price"></span>
                    </div>
                    <div class="delivery-fee"></div>
                    <div class="d-flex justify-content-between">
                        <span class="font-weight-bold">Total</span>
                        <span class="font-weight-bold total-price"></span>
                    </div>
                </div>
                <hr/>
                <div class="d-flex justify-content-between">
                    <span>Pagamento</span>
                    <div class="d-flex flex-column">
                    <span class="payment-type"></span>
                    <span class="payment-change-value"></span>
                    </div>
                </div>
                <hr/>
                <div class="d-flex flex-column">
                    <span class="address-label"></span>
                    <span class="address"></span>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Fechar</button>
            </div>
        </div>
    </div>
</div>