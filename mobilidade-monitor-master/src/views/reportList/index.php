<div class="container-default-monitor">
    <div id="contentSearch">
        <div class="section-search">
            <label for="selectStatus" class="mb-0">Status</label>
            <select id="selectStatus" class="form-control">
                <option value="">Todos</option>
                <option value="pending">Pendente</option>
                <option value="in_process">Em processo</option>
                <option value="finished">Finalizado</option>
                <option value="error">Com erro</option>
            </select>
        </div>

        <div class="section-search">
            <label for="selectTypeReport" class="mb-0">Tipo de relatório</label>
            <select id="selectTypeReport" class="form-control">
            </select>
        </div>

        <div class="section-search">
            <label for="dateStart" class="mb-0">Data inicial</label>
            <input id="dateStart" class="form-control" type="date" />
        </div>

        <div class="section-search">
            <label for="dateEnd" class="mb-0">Data final</label>
            <input id="dateEnd" class="form-control" type="date" />
        </div>
        <button type="button" class="btn-primary btn-sm" id="btnSearch">Pesquisar</button>
    </div>
    <div id="contentTable">
        <table class="table table-striped table-reports">
            <thead>
                <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Data de criação</th>
                    <th scope="col">Status</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody class="list-requested-reports">
            </tbody>
        </table>
        <div class="d-flex w-100 justify-content-center" id="paginationContent">
        </div>
    </div>

    <!-- Modal to detail report record error -->
    <div class="modal fade" id="errorDetailedReportRecord" tabindex="-1" role="dialog" aria-labelledby="errorDetailReportRecord" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="errorDetailReportRecord">Detalhes do erro</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <code id="errorDetailReportRecordContent"></code>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                </div>
            </div>
        </div>
    </div>
</div>