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
                    <th>Modulo</th>
                    <th>Logo</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody id="list"></tbody>
        </table>
    </div>
</div>

<div class="modal fade" id="editLogoModal" tabindex="-1" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Alterar Logo</h5>
                <button type="button" class="close" data-dismiss="modal">
                    <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <input type="file" id="newLogoFile" />
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="saveNewLogo">Salvar</button>
            </div>
        </div>
    </div>
</div>