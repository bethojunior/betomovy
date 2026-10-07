<div class="container-default-monitor">
    <div class="container">
        <div class="d-flex justify-content-end align-items-center flex-column-reverse flex-lg-row">
            <div class="form-row flex-fill">
                <div class="form-group col-md-4">
                    <label class="sr-only" for="filterInput"></label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                                <i class="material-icons">search</i>
                            </div>
                        </div>
                        <input type="search" class="form-control" id="filterInput" placeholder="Procurar">
                    </div>
                </div>
                <div class="col-md-8">
                    <button type="button" class="btn btn-light" id="filterButton">Filtrar</button>
                </div>
            </div>
            <div>
                <a href="<?php echo Host::getLocal() ?>central/add" class="btn btn-primary mb-2">Cadastrar Central</a>
                <button type="button" class="btn btn-info mb-2" data-toggle="modal" data-target="#listPartnerCommissionModal">Comissões
                </button>
            </div>
        </div>
        <table class="table table-striped table-responsive-sm">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">Central</th>
                    <th scope="col">Endereço</th>
                    <th scope="col">Voucher</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col">Ativar</th>
                </tr>
            </thead>
            <tbody id="listCentral"></tbody>
        </table>
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item" id="showStartButton"><a class="page-link" href="#">Voltar</a></li>
                <li class="page-item" id="showEndButton"><a class="page-link" href="#">Próximo</a></li>
            </ul>
        </nav>
    </div>
</div>
<div class="modal fade" id="voucherModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Voucher</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="voucher-value-container">
                    <input class="form-control" id="voucherValue" type="text"></input>
                    <p class="coin-icon">R$</p>
                </div>
                <div class="mt-3">
                    <select class="form-control" id="inserOrRemove">
                        <option value="1" selected>Inserir</option>
                        <option value="2">Remover</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" id="updateVoucher" class="btn btn-primary" data-toggle="modal">
                    Salvar
                </button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="listPartnerModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Usuários</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <ul class="list-group" id="listPartnerCentral"></ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalAddUserInCentral">
                    Adicionar usuário
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modalAddUserInCentral" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalCenterTitle">Adicionar usuário na central</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group col-md-12">
                    <label for="partnerSelected">Buscar por usuário:</label>
                    <select id="partnerSelected"></select>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="isAdmin">
                    <label class="form-check-label" for="isAdmin">
                        Administrador
                    </label>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="addUserInCentral">Adicionar</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="listPartnerCommissionModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Comissões</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Valor</th>
                            <th>Tipo de comissão</th>
                            <th>Cidade</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="listPartnerCommission"></tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-dark" data-toggle="modal" data-target="#addPartnerCommissionModal">Adicionar Comissão
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="addPartnerCommissionModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Adicionar Comissão</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="typeCalledSelect">Tipo de chamado</label>
                    <select class="form-control" id="typeCalledSelect"></select>
                </div>
                <div class="form-group">
                    <label for="cityCommissionSelect">Selecione a cidade</label>
                    <select class="form-control" id="cityCommissionSelect"></select>
                </div>
                <hr />
                <div class="row">
                    <div class="form-group col-lg-4">
                        <label for="valuePartnerCommission">Valor</label>
                        <input type="tel" class="form-control" id="valuePartnerCommission">
                    </div>
                </div>
                <p class="mb-1">Selecione a forma de comissão</p>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="typeValuePartnerCommission" id="typeValuePartnerCommission1" value="%" checked>
                    <label class="form-check-label" for="typeValuePartnerCommission1">
                        Percentagem
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="typeValuePartnerCommission" id="typeValuePartnerCommission2" value="$">
                    <label class="form-check-label" for="typeValuePartnerCommission2">
                        Valor fixo
                    </label>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-dark" id="btnAddPartnerCommission">Salvar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="editPartnerCommissionModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Editar Comissão</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="typeCalledSelectEdit">Tipo de chamado</label>
                    <select class="form-control" id="typeCalledSelectEdit" disabled></select>
                </div>
                <div class="form-group">
                    <label for="cityCommissionSelectEdit">Selecione a cidade</label>
                    <select class="form-control" id="cityCommissionSelectEdit" disabled></select>
                </div>
                <hr />
                <div class="row">
                    <div class="form-group col-lg-4">
                        <label for="valuePartnerCommissionEdit">Valor</label>
                        <input type="tel" class="form-control" id="valuePartnerCommissionEdit">
                    </div>
                </div>
                <p class="mb-1">Selecione a forma de comissão</p>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="typeValuePartnerCommissionEdit" id="typeValuePartnerCommissionEdit1" value="%" checked>
                    <label class="form-check-label" for="typeValuePartnerCommissionEdit1">
                        Percentagem
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="typeValuePartnerCommissionEdit" id="typeValuePartnerCommissionEdit2" value="$">
                    <label class="form-check-label" for="typeValuePartnerCommissionEdit1">
                        Valor fixo
                    </label>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-dark" id="btnEditPartnerCommission">Salvar</button>
            </div>
        </div>
    </div>
</div>