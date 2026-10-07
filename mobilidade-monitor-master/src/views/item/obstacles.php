<button class="btn btn-info add-new-obstacles"><i class="material-icons">add</i></button>
<div class="general-obstacles">
    <div class="row" id="mount-obstacles">
    </div>
</div>

<div class="modal" tabindex="-1" role="dialog" id="modal-obstacles">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <b>Selecione um item</b>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <label class="input-group-text" for="mount-general-priceHelpers">Obstáculos</label>
                    </div>
                    <select class="custom-select" id="mount-select-obstacles" >
                    </select>
                </div>
                <a href="#" data-toggle="modal" data-target="#addObstacleModal">
                    Adicionar um tipo de obstaculo
                </a>
                <hr/>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text" for="value-obstacle">Valor</span>
                    </div>
                    <input type="text" class="form-control" id="value-obstacle"  aria-describedby="inputGroupPrepend3">
                </div>
                <div class="input-group mt-2">
                    <div class="input-group-prepend">
                        <span class="input-group-text" for="value-obstacle-floor">Valor por andar</span>
                    </div>
                    <input type="tel" class="form-control" id="value-obstacle-floor" aria-describedby="inputGroupPrepend3" max-value="100000" style="text-align: right;">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary save-new-price-obstacle">Salvar mudanças</button>
            </div>
        </div>
    </div>
</div>