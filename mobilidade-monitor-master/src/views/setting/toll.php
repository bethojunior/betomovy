<div class="container-default-monitor">
    <div class="container">
        <div>
            <button type="button" class="btn btn-primary" id="btnOpenModal">Adicionar
                pedágio
            </button>
            <button type="button" class="btn btn-primary btn-list-toll">Listar todos</button>
        </div>
        <div style='display: flex; justify-content: center'>
            <h5 class="dont-prepaid-yet mt-2"></h5>
        </div>
       <div class="table-responsive">
            <table class="table table-striped mt-2">
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Localização</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody id="listToll"></tbody>
            </table>
       </div>
    </div>
</div>

<div class="modal fade" id="addTollModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Adicionar pedágio</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="nameToll">Nome</label>
                    <input type="text" class="form-control" id="nameToll">
                </div>
                <div class="form-group position-relative" >
                    <label for="addressToll">Endereço</label>
                    <input type="text" class="form-control" id="addressToll" autocomplete="off">
                    <ul class="autocomplete-address"></ul>
                </div>
                <div class="form-row">
                    <div class="form-group col-12">
                        <label for="valueToll">Valor</label>
                        <input type="text" class="form-control w-50" id="valueToll">
                        <small>Verifique o valor cobrado para apenas inda ou inda e volta</small>
                    </div>
                </div>
                <div class="form-group">
                    <label for="meterRange">Raio do pedágio</label>
                    <input type="range" class="form-control-range" value="50" id="meterRange" min="10" max="50">
                </div>
                <div class="container-map-toll"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="btnAddToll">Adicionar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="viewTollModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Pedágio</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="container-map-toll-view"></div>
            </div>
        </div>
    </div>
</div>