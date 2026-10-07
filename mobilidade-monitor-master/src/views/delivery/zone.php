<div class="container-default-monitor">
    <div class="container">
        <button type="button" class="btn btn-primary mb-2" data-toggle="modal" data-target="#addDeliveryZone">Adicionar
            zona
        </button>
       <div class="table-responsive">
            <table class="table table-striped">
                <colgroup>
                    <col span="1" style="width: 40%;">
                    <col span="1" style="width: 40%;">
                    <col span="1" style="width: 10%;">
                    <col span="1" style="width: 10%;">
                </colgroup>
                <thead>
                <tr>
                    <th>Zona</th>
                    <th>Cidade</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody id="listZone"></tbody>
            </table>
       </div>
    </div>
</div>
<div class="modal fade" id="addDeliveryZone" role="dialog"
     aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <form>
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Adicionar bairro</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="form-group col-12">
                            <label for="nameZone">Nome do bairro</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="nameZone">
                                <div class="input-group-append">
                                    <span class="input-group-text" id="btnSearchLocal" style="cursor: pointer">Pesquisar</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row" hidden>
                        <div class="form-group col-lg-6 col-12">
                            <label for="priceZone">Preço</label>
                            <input type="text" class="form-control input-mask-money" id="deliveryPrice">
                        </div>
                    </div>
                    <div class="p-3" id="contentMap" hidden>
                        <div class="row">
                            <div class="col-md-4 p-0">
                                <span>Sugestões</span>
                                <ul class="list-group mr-1" id="listGroupAddress"></ul>
                            </div>
                            <div class="col-md-8" id="map" style="display: block; height: 300px"></div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" id="btnAddZone">Salvar</button>
                </div>
            </div>
        </form>
    </div>
</div>
<div class="modal fade" id="editDeliveryZone" role="dialog"
     aria-hidden="true">
    <div class="modal-dialog  modal-lg">
        <form>
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Editar zona</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="form-group col-12">
                            <label for="nameZoneEdit">Nome do bairro</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="nameZoneEdit">
                                <div class="input-group-append">
                                    <span class="input-group-text" id="btnSearchLocalEdit" style="cursor: pointer">Pesquisar</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="p-3" id="contentMapEdit">
                        <div class="row">
                            <div class="col-md-4 p-0">
                                <span>Sugestões</span>
                                <ul class="list-group mr-1" id="listGroupAddressEdit"></ul>
                            </div>
                            <div class="col-md-8" id="mapEdit" style="display: block; height: 300px"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" id="btnEditZone">Atualizar</button>
                </div>
            </div>
        </form>
    </div>
</div>