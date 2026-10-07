<div class="container-default-monitor">
    <div class="container">
        <button type="button" class="btn btn-primary mb-2" data-toggle="modal" data-target="#addAttachmentType">
            Adicionar
        </button>
        <i class="material-icons" data-toggle="tooltip" data-placement="right" title="Os acessórios cadastrados serão exibidos no cadastro do entregador, caso esteja ativo">info</i>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>Logo</th>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Ativar</th>
                    <th></th>
                </tr>
                </thead>
                <tbody id="list"></tbody>
            </table>
        </div>
    </div>
</div>

<div class="modal fade" id="addAttachmentType" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <form id="addDriverAttachmentType">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Adicionar acessório</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">

                    <div class="form-group">
                        <label for="name">Nome</label>
                        <input type="text" class="form-control" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="description">Descrição</label>
                        <textarea class="form-control" id="description" name="description" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="picture">Selecione um icone</label>
                        <input type="file" class="form-control-file" id="picture" accept="image/png, image/jpeg">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">Salvar</button>
                </div>
            </div>
        </form>
    </div>
</div>

<div class="modal fade" id="editAttachmentType" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <form id="editDriverAttachmentType">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Editar acessório</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="nameEdit">Nome</label>
                        <input type="text" class="form-control" id="nameEdit" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="descriptionEdit">Descrição</label>
                        <textarea class="form-control" id="descriptionEdit" name="descriptionEdit" rows="3"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">Atualizar</button>
                </div>
            </div>
        </form>
    </div>
</div>