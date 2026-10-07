<div class="container-default-monitor">
    <div class="container">
        <div class="form-row">
            <div class="form-group col-md-4">
                <select id="filterNotificationView" class="form-control">
                    <option value="" selected>SEM FILTRO</option>
                </select>
            </div>
            <div class="form-group col-md-4">
                <button type="button" class="btn btn-info" id="btnFilterView">Filtrar</button>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Data</th>
                        <th>Usuário</th>
                        <th>Contato</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="listNotification"></tbody>
            </table>
        </div>
        <nav>
            <ul class="pagination">
                <li class="page-item page-back disabled"><a class="page-link" href="#">Voltar</a></li>
                <li class="page-item page-next"><a class="page-link" href="#">Próximo</a></li>
            </ul>
        </nav>
    </div>
</div>