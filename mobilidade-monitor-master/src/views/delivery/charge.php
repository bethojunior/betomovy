<div class="container-default-monitor">
    <div class="container">
        <div class="d-flex justify-content-between">
            <div>
                <label>Filtrar</label>
                <div class="d-flex">
                    <select class="custom-select selectFantasyName w-100" id="select-filter-charge"></select>
                    <button class="btn btn-sm btn-danger material-icons btn-filter-charge">search</button>
                </div>
            </div>
            <div>
                <button class="btn btn-danger mt-4" data-target="#createChargeModal" data-toggle="modal">Gerar nova cobrança</button>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-striped w100 mt-4">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Criado em</th>
                        <th>Status da cobrança</th>
                        <th>Aprovar</th>
                        <th>Recusar</th>
                        <th>Excluir</th>
                    </tr>
                </thead>
                <tbody class="listCharges"></tbody>
            </table>
        </div>
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-secondary btn-prev-page material-icons btn-sm">arrow_back</button>
            <button type="button" class="btn btn-secondary btn-next-page material-icons btn-sm">arrow_forward</button>
        </div>
    </div>
</div>

<div class="modal"  id="createChargeModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Criar nova cobrança</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <label>Empresa que será vinculada a cobrança</label>
                <select class="custom-select selectFantasyName" ></select>
                <label class="mt-4">Descrição</label>
                <input type="text" class="form-control" id="descriptionCharge">
                <label class="mt-2">Valor</label>
                <input type="text" class="form-control" id="valueCharge">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-danger" id="btnCreateNewCharge">Criar</button>
            </div>
        </div>
    </div>
</div>