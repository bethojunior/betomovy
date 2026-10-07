<div class="container-default-monitor">
    <div class="container">
        <button type="button" class="btn btn-primary float-right" data-toggle="modal" data-target="#addPaymentFormModal">Adicionar Forma de Pagamento</button>
        <div class="table-responsive ">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th scope="col">Descrição</th>
                    <th scope="col">Tipo</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                </tr>
                </thead>
                <tbody id="listPaymentForm"></tbody>
            </table>
        </div>
    </div>
</div>

<div class="modal fade" id="addPaymentFormModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Adicionar Forma de Pagamento</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="form-group">
                        <label for="descriptionPaymentForm">Descrição</label>
                        <input type="text" class="form-control" id="descriptionPaymentForm" placeholder="">
                        <small class="form-text text-muted">Descrição de como a forma de pagamento irá aparecer no aplicativo</small>
                    </div>
                    <div class="form-group">
                        <select class="custom-select" id="typePaymentForm">
                            <option value="" selected>Selecione o tipo de forma de pagamento</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="addPaymentForm"  >Adicionar</button>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="editPaymentFormModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Editar Forma de Pagamento</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="form-group">
                        <input type="text" class="form-control" id="idPaymentFormEdit" placeholder="" hidden>
                    </div>
                    <div class="form-group">
                        <label for="descriptionPaymentFormEdit">Descrição</label>
                        <input type="text" class="form-control" id="descriptionPaymentFormEdit" placeholder="">
                        <small class="form-text text-muted">Descrição de como a forma de pagamento irá aparecer no aplicativo</small>
                    </div>
                    <div class="form-group">
                        <select class="custom-select" id="typePaymentFormEdit">
                            <option value="" selected>Selecione o tipo de forma de pagamento</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="editPaymentForm"  >Adicionar</button>
            </div>
        </div>
    </div>
</div>

