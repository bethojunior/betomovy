<div class="container-default-monitor">
    <button class="btn btn-primary btn-new-menu" hidden>Novo Menu Externo</button>
    <div class="container">
        <table class="table table-striped table-responsive-lg">
            <thead>
                <tr>
                    <th>Modalidade</th>
                    <th>Telefone</th>
                    <th>Link</th>
                    <th>Descrição</th>
                    <th>Editar</th>
                    <th>Excluir</th>
                </tr>
            </thead>
            <tbody class="list-menu"></tbody>
        </table>
    </div>
</div>

<div class="modal" tabindex="-1" id="modal-new-menu">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Novo Menu Externo</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <label>Modalidade:</label>
                <select class="form-control select-new-menu"> </select>
                <label>Telefone:</label>
                <input class="form-control mask-phone" id="new-phone">
                <label>Link</label>
                <input class="form-control" id="new-link">
                <label>Descrição:</label>
                <input class="form-control" id="new-description" maxlength="30px">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary btn-create">Salvar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal" tabindex="-1" id="modal-edit-menu">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Editar Menu Externo</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <label>Telefone:</label>
                <input class="form-control mask-phone" id="phone">
                <label>Link:</label>
                <input class="form-control" id="link" >
                <label>Descrição:</label>
                <input class="form-control" id="description" maxlength="30px">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary btn-save">Salvar</button>
            </div>
        </div>
    </div>
</div>