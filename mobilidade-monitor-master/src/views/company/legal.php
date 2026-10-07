<div class="container-default-monitor">
    <div class="general-legal">
        <div class="card">
            <div class="card-header">
                Filtro
            </div>
            <div class="card-body row col-lg-12">
                <blockquote class="row col-lg-12 blockquote">
                    <div class="row col-lg-12">
                        <div class="form-group col-lg-6 col-sm-12">
                            <input id="value-search" placeholder="Pesquise aqui" class="form-control">
                        </div>
                        <div class="form-group col-lg-2">
                            <input id="clear-filter" class="form-control btn-outline-info" type="button"
                                   value="Limpar filtro">
                        </div>
                        <div class="form-group col-lg-2">
                            <input id="search-enterprise" class="form-control btn btn-primary" type="button"
                                   value="Buscar">
                        </div>
                    </div>
                    <div class="col-lg-12">
                        <div class="form-check form-check-inline">
                            <input checked class="form-check-input" name="filter-pj" type="radio" id="inlineCheckbox1"
                                   value="name">
                            <label class="form-check-label" for="inlineCheckbox1">Nome fantasia</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" name="filter-pj" type="radio" id="inlineCheckbox2"
                                   value="cnpj">
                            <label class="form-check-label" for="inlineCheckbox2">CNPJ</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" name="filter-pj" type="radio" id="inlineCheckbox3"
                                   value="phone">
                            <label class="form-check-label" for="inlineCheckbox3">Telefone</label>
                        </div>
                    </div>
                </blockquote>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>Nome Fantansia</th>
                    <th>Telefone</th>
                    <th>CNPJ</th>
                    <th>Voucher</th>
                    <th>Status</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody class="mount-here-pj"></tbody>
            </table>
        </div>   
    </div>
</div>
<div class="modal" tabindex="-1" role="dialog" id="modal-company">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="name-company"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <span>Nome</span>
                    <input id="name" class="form-control" disabled>
                </div>
                <div class="form-group">
                    <span>Nome fantasia</span>
                    <input id="fantasy-name" class="form-control" disabled>
                </div>
                <div class="form-group">
                    <span>Email</span>
                    <input id="email" class="form-control" disabled>
                </div>
                <div class="form-group">
                    <span>Endereço</span>
                    <input id="address" class="form-control" disabled>
                </div>
                <div class="form-group">
                    <span>Número de matrícula</span>
                    <input id="registration-number" class="form-control" disabled>
                </div>
                <div class="form-group">
                    <span>Finalidade da viagem</span>
                    <input id="puporse-of-travel" class="form-control" disabled>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary add-user-company">Usuários</button>
                <button type="button" class="btn btn-secondary edit-company">Editar</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
            </div>
        </div>
    </div>
</div>
<div class="modal" tabindex="-1" role="dialog" id="modal-voucher-company">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="name-company-again"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <span>Valor a ser inserido</span>
                    <input id="value-voucher" class="form-control">
                </div>
                <div>
                <select class="custom-select" id="remove-or-insert" aria-label=".form-select-lg example">
                    <option selected>Inserir</option>
                    <option value="1">Remover</option>
                </select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary save-voucher" data-dismiss="modal">Salvar alterações</button>
            </div>
        </div>
    </div>
</div>
<div class="modal" tabindex="-1" role="dialog" id="modal-list-user-company">
    <div class="modal-dialog add-user" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Listar usuários</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Email</th>
                        <th scope="col">Telefone</th>
                    </tr>
                    </thead>
                    <tbody id="mount-users-company">
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="add-new-user-company">Adicionar usuário</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
            </div>
        </div>
    </div>
</div>
<div class="modal" tabindex="-1" role="dialog" id="modal-add-user-company">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Adicionar usuário</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body row col l12 s12">
                <div class="form-group col s12 l12 ">
                    <div class="form-group">
                        <span>Nome do usuário (Como no aplicativo)</span>
                        <select id="mount-users-company-search" class="col-lg-12 js-example-basic-multiple"
                                name="states[]" multiple="multiple">
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input id="email-add-user" class="form-control" disabled>
                    </div>
                    <div class="form-group">
                        <label>Fone</label>
                        <input id="phone-add-user" class="form-control" disabled>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="comeback">Voltar</button>
                <button type="button" class="btn btn-primary" id="add-this-user-company">Salvar</button>
            </div>
        </div>
    </div>
</div>