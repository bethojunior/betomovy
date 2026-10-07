<div class="container-simple-delivery" id="info-delivery">
    <nav class="navbar navbar-light bg-dark">
        <a class="navbar-brand text-white d-flex align-items-center" href="#">
            <i class="material-icons p-2 mr-2 go-back-delivery-info">keyboard_backspace</i>
            Informações de entrega
        </a>
    </nav>
    <div>
        <div class="form-group">
            <label for="itemTripSelected">Selecione tipo de entrega</label>
            <select class="form-control" id="itemTripSelected">
                <option value="" selected disabled>Selecione um item para entrega</option>
            </select>
        </div>
        <hr/>
        <div class="form-group">
            <label for="obsOriginDelivery">Observações na coleta</label>
            <textarea class="form-control" id="obsOriginDelivery" rows="3"></textarea>
        </div>
        <hr/>
        <p>Observações nos endereços de entrega</p>
        <ul id="listAddressDeliveryObs"></ul>
        <button type="button" class="btn btn-primary w-100" id="btnAddObsInTrip">Continuar</button>
    </div>
</div>
<div class="modal fade" id="addObservationInPlace" tabindex="-1" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Adicionar observação</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="obsTextArea" class="d-flex align-items-center"></label>
                    <textarea class="form-control" id="obsTextArea" rows="3"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="btnAddObs">Adicionar</button>
            </div>
        </div>
    </div>
</div>
