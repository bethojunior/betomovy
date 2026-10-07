<div class="modal fade" id="addObstacleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Adicionar novo tipo de ajudante</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Tipo de Obstáculo</span>
                    </div>
                    <input id="name-obstacle" type="text" class="form-control" aria-label="Exemplo do tamanho do input"
                           aria-describedby="description-item">
                </div>
                <br>
                <div class="input-group">
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="item-upload-obstacle"
                               aria-describedby="inputGroupFileAddon04">
                        <label class="custom-file-label" for="item-upload-obstacle">Escolhe um arquivo</label>
                    </div>
                </div>
                <br>
            </div>
            <div class="modal-footer">
                <button type="button" id="save-new-obstacle" class="btn btn-primary">Salvar</button>
            </div>
        </div>
    </div>
</div>