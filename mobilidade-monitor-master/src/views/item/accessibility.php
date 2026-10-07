<div class="general-acessibilidade">
    <div class="row" id="mount-priceHelpers">

    </div>
</div>

<button id="create-price" class="btn btn-success"><i class="material-icons">add</i></button>

<div class="modal" tabindex="-1" role="dialog" id="modal-price">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <b>Editar item</b>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="valu">Valor</label>
                    <input id="value-price-help" class="form-control" placeholder="Valor">
                </div>
                <div class="form-group">
                    <label>Quantidade de icones</label>
                    <input id="quantityIcon" class="form-control">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary">Salvar mudanças</button>
            </div>
        </div>
    </div>
</div>

<div class="modal" tabindex="-1" role="dialog" id="modal-new">
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
                        <label class="input-group-text" for="mount-general-priceHelpers">Ajudantes</label>
                    </div>
                    <select class="custom-select" id="mount-general-priceHelpers" >
                    </select>
                </div>
                <a href="#" data-toggle="modal" data-target="#addHelperModal">
                    Adicionar um tipo de ajudante
                </a>
                <hr/>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text" for="value-helper-man">Valor</span>
                    </div>
                    <input type="text" class="form-control" id="value-helper-man"  aria-describedby="inputGroupPrepend3">
                </div>
                <br>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text" for="qunatity-icon">Quantidade de vezes que o icone irá aparecer</span>
                    </div>
                    <input type="number" class="form-control" id="qunatity-icon"  aria-describedby="inputGroupPrepend3">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary save-new-price-helper-man">Salvar mudanças</button>
            </div>
        </div>
    </div>
</div>