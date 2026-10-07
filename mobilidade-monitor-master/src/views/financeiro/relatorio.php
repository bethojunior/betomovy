<div class="mobile">
    Não disponivel apra versão mobile
</div>
<div class="accordion general-relatorio" id="accordionExample">
    <div class="card">
        <div class="card-header" id="headingOne">
            <h2 class="mb-0">
                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Financeiro Produção Motorista
                </button>
            </h2>
        </div>

        <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
            <div class="card-body">
                <div class="row general-relatorio">
                    <div class="col-lg-5 col-sm-12" id="list-drivers">
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon3">Data inicial</span>
                            </div>
                            <input type="date" class="form-control" id="date_start" aria-describedby="basic-addon3">
                        </div>
                        <div class="row">
                            <div class="col-lg-9 col-sm-12 input-group">
                                <input type="text" class="form-control" placeholder="Busque uma cidade" id="who-city" aria-describedby="basic-addon2">
                                <div class="input-group-append">
                                    <span style="cursor:pointer;" class="input-group-text" id="search-city"><i class="material-icons">search</i></span>
                                </div>
                            </div>
                            <div class="col-lg-3 col-sm-12 custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="mark-all-cities">
                                <label class="custom-control-label" for="mark-all-cities">Todas</label>
                            </div>
                        </div>
                        <div id="driver-list" class="list">

                        </div>
                    </div>
                    <div class="col-lg-5 col-sm-12 second">
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon3">Data Final&nbsp;</span>
                            </div>
                            <input type="date" class="form-control" id="date_end" aria-describedby="basic-addon3">
                        </div>
                        <div class="row">
                            <div class="col-lg-9 col-sm-12 input-group mb-3">
                                <input type="text" class="form-control" placeholder="Busque um motorista" id="who-search" aria-describedby="basic-addon2">
                                <div class="input-group-append">
                                    <span style="cursor:pointer;" class="input-group-text" id="search-user"><i class="material-icons">search</i></span>
                                </div>
                            </div>
                            <div class="col-lg-3 custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="mark-all-drivers">
                                <label class="custom-control-label" for="mark-all-drivers">Todos Motoristas</label>
                            </div>
                        </div>
                        <div id="mount-users">

                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-4 col-sm-4"></div>
                    <div class="col-lg-4 col-sm-4">
                        <button id="load" class="btn">Pesquisar</button>
                    </div>
                </div>

                <div class="modal fade modal-result" id="modal-result" tabindex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-xl">
                        <div class="modal-content">
                            <span class="sub-header">Quantidade de viagens (CHAMADAS/CANCELADAS/FINALIZADAS)</span>
                            <div class="about-value" id="total_trip"></div>
                            <!--            <hr>-->
                            <span class="sub-header">Quantidade de motoristas ativos  (RECEBEU CHAMADA / CANCELOU CHAMADA / FINALIZOU CHAMADA)</span>
                            <div class="about-value" id="who_received"></div>
                            <!--            <hr>-->
                            <span class="sub-header">Quantidade de motoristas inativos</span>
                            <div class="about-value" id="who_not_received"></div>
                            <!--            <hr>-->
                            <span class="sub-header">Valores movimentados / Comissão</span>
                            <div class="about-value" id="values_general"></div>
                            <!--            <hr>-->
                            <span class="sub-header">Tipo de recebimentos </span>
                            <div class="about-value" id="trip_total_value"></div>
                            <!--            <hr>-->
                            <span class="sub-header">Imposto a recolher </span>
                            <div class="about-value" id="total_tax_fee"></div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    </div>
    <div class="card">
        <div class="card-header" id="heading3">
            <h2 class="mb-0">
                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse3" aria-expanded="true" aria-controls="collapseOne">
                    Indicações por usuários
                </button>
            </h2>
        </div>

        <div id="collapse3" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
            <div class="card-body row col-lg-12">
                <div class="row col-lg-12">
                    <div class="form-group col-lg-3">
                        <span>Data inicial</span>
                        <input id="dateStart" type="date" class="form-control">
                    </div>
                    <div class="form-group col-lg-3">
                        <span>Data final</span>
                        <input id="dateEnd" type="date" class="form-control">
                    </div>
                    <div class="form-group col-lg-3">
                        <span>&nbsp;</span>
                        <input type="text" id="search-users-by-name" placeholder="Busque um usuário" class="form-control">
                    </div>
                    <div class="form-group col-lg-3">
                        <span>&nbsp;</span>
                        <select id="userId" class="custom-select">
                            <option selected value="">Todos</option>
                        </select>
                    </div>
                    <div class="col-lg-12">
                        <button id="search-indications-user" class="col-lg-3 btn btn-primary">Buscar</button>
                    </div>
                    <div class="col-lg-12">
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th scope="col">Nome</th>
                                <th>Periodo</th>
                                <th>Tipo</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody id="mount-indication-total">

                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="mount-list-indications"></div>
            </div>
        </div>
    </div>
    <div class="card">
        <div class="card-header" id="headingTwo">
            <h2 class="mb-0">
                <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    Indicações
                </button>
            </h2>
        </div>
        <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
            <div class="row col-lg-12 card-body">
                <div class="row col-lg-12">
                    <div class="form-group col-lg-3">
                        <span>Busque por nome</span>
                        <input id="search-by-name" class="form-control">
                    </div>
                    <div class="col-lg-4">
                        <span>Selecione um nivel</span>
                        <select class="custom-select mb-3" id="mount-levels">
                            <option selected value="">TODOS</option>
                        </select>
                    </div>
                </div>
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Email</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Telefone</th>
                        <th scope="col">Indicações</th>
                        <th scope="col">Level</th>
                    </tr>
                    </thead>
                    <tbody style="cursor: pointer" id="mount-indication">

                    </tbody>
                </table>
                <!--                row col-lg-12-->
            </div>
        </div>
    </div>
</div>

