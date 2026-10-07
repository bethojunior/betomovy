<div class="row">
    <div class="col-lg-12">
        <div class="container-cancellationFee">
            <div class="row col-lg-12">
                <div class="col-lg-3 form-group">
                    <span>Data inicial</span>
                    <input id="dateStart" class="form-control" type="date">
                </div>
                <div class="col-lg-3 form-group">
                    <span>Data final</span>
                    <input id="dateEnd" class="form-control" type="date">
                </div>
                <div class="col-lg-3">
                    <span>Cidade</span>
                    <select id="cityId" class="custom-select">
                        <option selected value="">Todas</option>
                    </select>
                </div>
                <div class="col-lg-3" style="margin-top: 1.5vw">
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="withTrash">
                        <label class="custom-control-label" for="withTrash">Com taxas removidas</label>
                    </div>
                </div>
            </div>
            <div class="row col-lg-12">
                <div class="form-group col-lg-3">
                    <input id="search-userId" placeholder="Busque um cliente" class="form-control">
                    <select id="userId" class="custom-select">
                        <option selected value="">Todos</option>
                    </select>
                </div>
                <div class="form-group col-lg-3">
                    <input id="search-driver" placeholder="Busque um motorista" class="form-control">
                    <select id="driverId" class="custom-select">
                        <option selected value="">Todos</option>
                    </select>
                </div>
                <div class="col-lg-3">
                    <span>&nbsp;</span>
                    <input id="get-cancellationFee" type="button" class="form-control btn btn-primary" value="Buscar">
                </div>
            </div>
        </div>
    </div>
    <div class="col-lg-12">
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Motorista Coletor</th>
                    <th>Data</th>
                    <th>Valor</th>
                    <th>Motorista Beneficiado</th>
                    <th>Data de Recebimento</th>
                    <th></th>
                </tr>
                </thead>
                <tbody id="mount-list-fee">
                </tbody>
            </table>
        </div>
        <nav>
            <ul class="pagination">
                <li class="page-item page-back disabled"><a class="page-link" href="#">Voltar</a></li>
                <li class="page-item page-next disabled"><a class="page-link" href="#">Próximo</a></li>
            </ul>
        </nav>
    </div>
</div>