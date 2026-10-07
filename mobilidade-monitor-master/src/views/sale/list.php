<div class="container-default-monitor">
    <div class="container">
        <button type="button" class="btn btn-primary float-right mb-2" data-toggle="modal"
            data-target="#addSaleTripModal">Adicionar Uma Promoção</button>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Cidade</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Quantidade</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Valido para corridas até</th>
                        <th scope="col">Início</th>
                        <th scope="col">Fim</th>
                        <th scope="col">Status</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody id="listSaleTrip"></tbody>
            </table>
        </div>
    </div>
</div>

<div class="modal fade" id="addSaleTripModal" tabindex="-1" role="dialog" aria-labelledby="Modal Adicionar Promoção"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Adicionar Nova Promoção</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="formAddSale" name="formAddSale">
                    <div class="form-group">
                        <label for="label">Nome</label>
                        <input type="text" required class="form-control" name="label" id="label">
                    </div>
                    <div class="form-group">
                        <label for="label">Cidade</label>
                        <select class="custom-select" required name="cityId" id="city-id"></select>
                    </div>
                    <div class="form-group">
                        <label for="label">Tipo</label>
                        <select class="custom-select" required name="type" id="type">
                            <option value="voucher">Voucher</option>
                            <option value="trip">Corrida</option>
                        </select>
                    </div>
                    <div class="form-group container-limited-to">
                        <label for="label">Valor Máximo da corrida</label>
                        <input name="limitedTo" class="form-control" type="tel" id="limitedTo">
                    </div>
                    <div class="form-group">
                        <input type="checkbox" name="status" id="status">
                        <label for="status">Ativar Promoção</label>
                    </div>
                    <div class="form-group">
                        <label for="quantity">Quantidade</label>
                        <input type="text" name="quantity" required class="form-control" id="quantity">
                    </div>
                    <div class="form-group">
                        <label for="start-day">Data Inicial</label>
                        <input type="date" name="startDay" required class="form-control" id="start-day">
                    </div>
                    <div class="form-group">
                        <label for="end-day">Data Final</label>
                        <input type="date" name="endDay" required class="form-control" id="end-day">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="addSaleTrip">Adicionar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="editSaleTripModal" tabindex="-1" role="dialog" aria-labelledby="Modal Adicionar Promoção"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Editar a Promoção</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="formEditSale" name="formEditSale">
                    <div class="form-group">
                        <label for="label">Nome</label>
                        <input type="text" required class="form-control" name="label" id="label">
                    </div>
                    <div class="form-group">
                        <label for="label">Cidade</label>
                        <select class="custom-select" required name="cityId" id="city-id-edit"></select>
                    </div>
                    <div class="form-group">
                        <label for="label">Tipo</label>
                        <select class="custom-select" required name="type" id="typeEdit">
                            <option value="voucher">Voucher</option>
                            <option value="trip">Corrida</option>
                        </select>
                    </div>
                    <div class="form-group container-limited-to-edit">
                        <label for="label">Valor Máximo da corrida</label>
                        <input name="limitedTo" class="form-control" type="tel" id="limitedToEdit">
                    </div>
                    <div class="form-group">
                        <label for="status">Status</label>
                        <input type="checkbox" name="status" id="status">
                        <p><small>Ativa/Desativada</small></p>
                    </div>
                    <div class="form-group">
                        <label for="quantity">Quantidade</label>
                        <input type="text" name="quantity" required class="form-control" id="quantity">
                    </div>
                    <div class="form-group">
                        <label for="start-day">Data Inicial</label>
                        <input type="date" name="startDay" required class="form-control" id="start-day">
                    </div>
                    <div class="form-group">
                        <label for="end-day">Data Final</label>
                        <input type="date" name="endDay" required class="form-control" id="end-day">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="editSaleTrip">Atualizar</button>
            </div>
        </div>
    </div>
</div>