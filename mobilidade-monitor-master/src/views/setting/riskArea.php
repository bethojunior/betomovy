<div class="container-default-monitor">
   <div class="table-responsive">
        <table class="table">
            <colgroup>
                <col span="1" style="width: 20%;">
                <col span="1" style="width: 20%;">
                <col span="1" style="width: 30%;">
                <col span="1" style="width: 15%;">
                <col span="1" style="width: 15%;">
            </colgroup>
            <thead>
            <tr>
                <th></th>
                <th>Usuário</th>
                <th>Endereço</th>
                <th>Status</th>
                <th></th>
            </tr>
            </thead>
            <tbody id="list"></tbody>
        </table>
   </div>
    <nav class="ml-2">
        <ul class="pagination">
            <li class="page-item disabled">
                <a class="page-link disable" id="prev" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item disabled">
                <a class="page-link disable" id="next" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
</div>

<div class="modal fade" id="riskAreaModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Alterar raio da área de risco</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="address">Endereço</label>
                    <input type="text" class="form-control" id="address" readonly>
                </div>
                <div class="form-group">
                    <label for="name">Usuário</label>
                    <input type="text" class="form-control" id="name" readonly>
                </div>
                <div class="form-group">
                    <label for="createdAt">Data/Horário</label>
                    <input type="text" class="form-control" id="createdAt" readonly>
                </div>
                <div class="form-group">
                    <label for="radius">Tamanho do raio da área de risco(metros)</label>
                    <input type="number" class="form-control" id="radius">
                </div>
                <div id="map" style="display: block; height: 200px; width: 100%;"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnRiskAreaUpdate">Atualizar</button>
            </div>
        </div>
    </div>
</div>