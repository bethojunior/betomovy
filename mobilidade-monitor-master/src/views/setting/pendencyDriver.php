<div class="container-default-monitor">
    <div class="container">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Descrição</th>
                    <th>Penalidade</th>
                    <th>Editar</th>
                </tr>
            </thead>
            <tbody class="list-table"> </tbody>
        </table>
    </div>
</div>

<div class="modal" id="modal-edit" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Editar Pontuação</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="edit-container">
                    <span>Insira um valor de até 0.5</span>
                    <input type="number" class="form-control penalty-input">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary save-penalty">Salvar</button>
            </div>
        </div>
    </div>
</div>