<div class="container-default-monitor">
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addTypeCategory">
        Adicionar um tipo de categoria
    </button>
   <div class="table-responsive">
    <table class="table table-striped space-table">
            <thead>
                <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Descrição</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody id="listCategories">
            </tbody>
        </table>
   </div>
</div>

<div class="modal fade" id="addTypeCategory">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalTitle">Tipos de categorias</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="name">Nome</label>
                    <input type="text" class="form-control" id="nameCategory">
                </div>
                <div class="form-group">
                    <label for="description">Descrição</label>
                    <textarea maxlength="200" class="form-control" id="descriptionCategory" rows="3"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="insertCategory">Adicionar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="editTypeCategory">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalTitleEdit">Tipo de categoria</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="name">Nome</label>
                    <input type="text" class="form-control" id="editNameCategory">
                </div>
                <div class="form-group">
                    <label for="description">Descrição</label>
                    <textarea maxlength="200" class="form-control" id="editDescriptionCategory" rows="3"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary btn-edit-category">Editar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="linkCategoryInSectionModal" tabindex="-1" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="linkCategoryInSectionForm">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Vincular categoria em seções</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="listSections"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Atualizar</button>
                </div>
            </form>
        </div>
    </div>
</div>