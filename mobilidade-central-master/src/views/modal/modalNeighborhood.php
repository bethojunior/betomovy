<div class="modal fade" id="modalChoiceTax" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">Opções de tarifas</h5>
                <button type="button" id="close-modal-central" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary w-50" id="btnRouteOption" data-dismiss="modal">Rota</button>
                <button type="button" class="btn btn-outline-secondary w-50" id="btnNeighborhoodOption">Bairro</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modalNeighborhood" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">Selecione o bairro</h5>
                <button type="button" id="close-modal-neighborhood" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <select class="form-control" id="neighborhoodSelect"></select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="btnNeighborhoodCancel" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnNeighborhoodSelected">Continuar</button>
            </div>
        </div>
    </div>
</div>