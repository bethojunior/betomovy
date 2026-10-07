<div class="container-default-monitor">
    <?php if ($this->hasPermission(GroupConst::MAPA, 'adicionar_gerenciar_chaves_web')) { ?>
        <button type="button" class="btn btn-info ml-1 mb-2" data-toggle="modal" data-target="#addKeyModal">Adicionar
        </button>
    <?php } ?>
    <div class="table-responsive">
        <table class="table m-1">
            <thead>
                <tr>
                    <th>Chave</th>
                    <th>Data de cadastro</th>
                    <th></th>
                </tr>
            </thead>
            <tbody id="list"></tbody>
        </table>
    </div>
    <div class="modal fade" id="addKeyModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="addKeyForm">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">Adicionar uma nova chave</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="key">Chave</label>
                            <input type="text" class="form-control" id="key" name="key" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Adicionar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>