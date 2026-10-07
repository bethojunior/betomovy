<div class="container-default-monitor">
    <div class="container">
        <div class="table-responsive">
            <table class="table table-striped table-responsive table-container">
                <thead>
                <tr>
                    <th>Rota</th>
                    <th>Origem</th>
                    <th>Destino</th>
                    <th>Atividade</th>
                    <th>Usuários</th>
                    <th>Pontos</th>
                    <th>Editar</th>
                    <th>Excluir</th>
                </tr>
                </thead>
                <tbody id="listRoutes"></tbody>
            </table>
        </div>
        <div class="col-lg-12" id="mount-list-routes">
        </div>
    </div>
</div>
<div class="modal fade" id="showDetailRoute" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="routeModalLabel"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p class="mb-1">Endereços disponíveis</p>
                <ul class="list-group" id="addressRoute">
                </ul>
                <hr/>
                <p class="mb-1">Itens disponíveis</p>
                <ul class="list-group" id="listItemsRoute">
                </ul>
                <hr/>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="showUsersCorporateRoute" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Usuários Corporativos</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <ul class="list-group" id="listCompanies"></ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="btnAddCompany">Adicionar usuário</button>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="showAddUsersCorporateRoute" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Adicionar Usuários Corporativos</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="companyUser" class="small">Para vincular uma empresa ela deve ser
                        cadastrada antes como
                        PJ</label>
                    <select id="companyUser" class="custom-select"></select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="btnAddCorporateRoute">Adicionar</button>
            </div>
        </div>
    </div>
</div>