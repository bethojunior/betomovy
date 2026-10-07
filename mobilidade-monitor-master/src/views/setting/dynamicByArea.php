<div class="container-default-monitor">
    <div class="container">
        <button type="button" class="btn btn-primary mb-2" data-toggle="modal" data-target="#addNeighborhoodArea">
            Adicionar
            área
        </button>
       <div class="table-responsive">
            <table class="table table-striped">
                <colgroup>
                    <col span="1" style="width: 40%;">
                    <col span="1" style="width: 40%;">
                    <col span="1" style="width: 30%;">
                    <col span="1" style="width: 30%;">
                </colgroup>
                <thead>
                <tr>
                    <th>Área</th>
                    <th>Valor multiplicado</th>
                    <th>Horário</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody id="listArea"></tbody>
            </table>
       </div>
    </div>
</div>
<div class="modal fade" id="addNeighborhoodArea" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <form>
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Adicionar área</h5>
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
                                    <span class="input-group-text" id="btnSearchLocal"
                                          style="cursor: pointer">Pesquisar</span>
                                </div>
                            </div>
                            <div class="form-group mt-3">
                                <label for="valueInDynamicByArea">Valor multiplicado</label>
                                <input type="number" id="valueInDynamicByArea" class="form-control input-mask-money"
                                       min="0">
                            </div>
                            <div class="form-row">
                                <div class="col">
                                    <label>Horário inicial:</label>
                                    <input type="time" class="form-control" id="startTime" step="2">
                                </div>
                                <div class="col">
                                    <label>Horário final:</label>
                                    <input type="time" class="form-control" id="endTime" step="2">
                                </div>
                            </div>
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
