<div class="container-default-monitor">
    <div class="container">
        <button type="button" class="btn btn-primary mb-2" data-toggle="modal" data-target="#addItemModal">Adicionar
            Item
        </button>
       <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>Icone</th>
                    <th>Descrição</th>
                    <th></th>
                </tr>
                </thead>
                <tbody id="listItems"></tbody>
            </table>
       </div>
    </div>
</div>

<div class="modal fade" id="addItemModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog" role="document">
        <form>
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addItemModal">Adicionar Item</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="nameItemDelivery">Nome do item</label>
                        <input type="text" class="form-control" id="nameItemDelivery">
                    </div>
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="iconItemDelivery"
                               accept="image/gif, image/jpeg, image/png">
                        <label class="custom-file-label" for="iconItemDelivery">Selecione um icone</label>
                    </div>
                    <div class="m-2">
                        <img class="d-block m-auto w-50" height="200" id="iconDeliveryPreview">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" id="btnAddItemDelivery" class="btn btn-primary">Salvar</button>
                </div>
            </div>
        </form>
    </div>
</div>