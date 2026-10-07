<div class="container-default-monitor">
    <div class="p-2">
        <button type="button" class="btn btn-primary mb-2" data-toggle="modal" data-target="#addDeliverySectionModal">
            Adicionar seção
        </button>

        <table class="table">
            <colgroup>
                <col span="1" style="width: 10%;">
                <col span="1" style="width: 20%;">
                <col span="1" style="width: 50%;">
                <col span="1" style="width: 20%;">
            </colgroup>
            <thead>
                <tr>
                    <th>logo</th>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th></th>
                </tr>
            </thead>
            <tbody id="list"></tbody>
        </table>

        <div class="modal fade" id="addDeliverySectionModal" tabindex="-1" aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form id="sectionForm">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Adicionar seção</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="name">Nome</label>
                                <input type="text" class="form-control" id="name" required>
                            </div>
                            <div class="form-group">
                                <label for="description">Descrição</label>
                                <textarea class="form-control" id="description" rows="3" required></textarea>
                            </div>
                            <div class="form-group">
                                <label for="icon">Icone</label>
                                <input type="file" class="form-control-file" id="icon" accept="image/*" required>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="modal fade" id="editDeliverySectionModal" tabindex="-1" aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form id="sectionFormEdit">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Adicionar seção</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="nameEdit">Nome</label>
                                <input type="text" class="form-control" id="nameEdit" required>
                            </div>
                            <div class="form-group">
                                <label for="descriptionEdit">Descrição</label>
                                <textarea class="form-control" id="descriptionEdit" rows="3" required></textarea>
                            </div>
                            <div class="form-group">
                                <label for="iconEdit">Icone</label>
                                <input type="file" class="form-control-file" id="iconEdit" accept="image/*">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Atualizar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>