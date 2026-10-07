<div class="general-list-items">
    <div class="row">
        <div class="col-lg-12 main">
            <div class="row" id="list-items"></div>
        </div>
    </div>
</div>

<div id="modal-update-item" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Título do modal</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div id="content-modal" class="modal-body">

                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="description-item-new">Descrição</span>
                    </div>
                    <input id="value-description-item-new" type="text" class="form-control" aria-label="Exemplo do tamanho do input" aria-describedby="description-item">
                </div>

                <div class="input-group">
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="fileUpload-new" aria-describedby="inputGroupFileAddon04">
                        <label class="custom-file-label" for="fileUpload-new">Escolhe um arquivo</label>
                    </div>
                </div>

                <div class="col-lg-12 row">
                    <div class="col-lg-3 col-sm-12">
                        <div class="input-group">
                            <input id="height-new" placeholder="Altura" class="form-control" aria-describedby="description-item">
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-12">
                        <div class="input-group">
                            <input id="width-new" class="form-control" placeholder="largura" aria-describedby="description-item">
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-12">
                        <div class="input-group">
                            <input id="depth-new" class="form-control" placeholder="Profundidade" aria-describedby="description-item">
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-12">
                        <div class="input-group">
                            <input id="weight-new" placeholder="Peso" class="form-control" aria-label="Exemplo do tamanho do input" aria-describedby="description-item">
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary" id="updating-this">Salvar mudanças</button>
            </div>
        </div>
    </div>
</div>