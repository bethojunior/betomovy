<div class="container-default-monitor">
    <div class="m-2">
        <button type="button" class="btn btn-primary mb-2" data-toggle="modal" data-target="#addAddressModal">Cadastrar
            Endereço
        </button>
        <hr/>
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
        <table class="table table-striped table-sm">
            <thead>
            <tr>
                <th>Endereço</th>
                <th></th>
                <th></th>
            </tr>
            </thead>
            <tbody id="listAddress"></tbody>
        </table>
        <ul class="pagination">
            <li class="page-item disabled">
                <a class="page-link" id="btnPrevious" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item disabled" >
                <a class="page-link" id="btnNext" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </div>
</div>

<div class="modal fade" id="addAddressModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Cadastro de endereço</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="nameLocal">Nome do local (Ex:. Praças, restaurantes, Shoppings etc..)</label>
                    <input type="text" class="form-control" id="nameLocal">
                </div>
                <div class="row">
                    <div class="form-group col-6">
                        <label for="nameLocal">Latitude</label>
                        <input type="text" class="form-control update-local" id="latitudeLocal">
                    </div>
                    <div class="form-group col-6">
                        <label for="nameLocal">Longitude</label>
                        <input type="text" class="form-control update-local" id="longitudeLocal">
                    </div>
                </div>
                <div class="content-map-address" id="map"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="btnSaveAddress">Salvar</button>
            </div>
        </div>
    </div>
</div>

<!--
<div class="row">
</div>
-->
<!--<div class="row">
    <div class="form-group col-3">
        <label for="nameLocal">Latitude</label>
        <input type="text" class="form-control update-local" id="latitudeLocal">
    </div>
    <div class="form-group col-3">
        <label for="nameLocal">Longitude</label>
        <input type="text" class="form-control update-local" id="longitudeLocal">
    </div>
    <div class="col-6">
        <button class="btn btn-primary float-right" id="btnSaveAddress">Salvar</button>
    </div>
</div>
<div class="row">
    <div class="col-3">
        <ul class="list-group" id="listAddress"></ul>
    </div>
</div>-->
