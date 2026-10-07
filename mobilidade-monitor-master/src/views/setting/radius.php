<button id="add-new" class="btn btn-info"><i class="material-icons">add</i></button>

<div class="row container-radius">
    <div class="mount-radius"></div>
</div>

<div class="modal" tabindex="-1" role="dialog" id="modal-add-radius">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Adcionar novo raio de chamado</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <span>Raio mínimo</span>
                    <input id="radius" class="form-control" placeholder="">
                </div>
                <div class="form-group">
                    <span>Raio máximo</span>
                    <input id="greaterRadius" class="form-control" placeholder="">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary" id="save-new-radius">Salvar</button>
            </div>
        </div>
    </div>