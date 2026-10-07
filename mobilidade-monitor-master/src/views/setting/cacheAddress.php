<div class="container-default-monitor">
    <div class="m-2">
        <div class="row">
            <div class="input-group col-4 mb-2">
                <div class="input-group-prepend">
                    <div class="input-group-text">
                        <span class="material-icons">search</span>
                    </div>
                </div>
                <input type="text" class="form-control" id="textSearch"
                       placeholder="Pesquise o endereço">
            </div>
            <div>
                <button type="button" class="btn btn-info" id="btnAddressSearch">Buscar</button>
            </div>
        </div>
        <table class="table table-striped" style="display: none">
            <thead>
            <tr>
                <th>Endereço</th>
                <th></th>
                <th></th>
            </tr>
            </thead>
            <tbody id="list"></tbody>
        </table>
    </div>
</div>