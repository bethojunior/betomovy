<div class="row">
    <div class="row container col-lg-12">
        <div class="col-lg-6 border-right">
            <div class="col-lg-12 center">
                <b>Rotas</b>
            </div>
            <div class="col-lg-12 form-group">
                <span>Nome da rota</span>
                <input id="name-new-route" class="form-control">
            </div>
            <div class="col-lg-12 input-group mb-3">
                <input readonly type="text" class="form-control" id="name-origin-show" placeholder="Nome da origem"
                       aria-label="Recipient's username" aria-describedby="origin-route">
                <div class="input-group-append">
                    <span style="cursor: pointer" class="input-group-text" id="origin-route"><i class="material-icons">place</i></span>
                </div>
            </div>
            <div class="col-lg-12 input-group mb-3">
                <input readonly id="name-destiny-show" type="text" class="form-control" placeholder="Nome do destino"
                       aria-label="Recipient's username" aria-describedby="destiny-route">
                <div class="input-group-append">
                    <span style="cursor: pointer" class="input-group-text" id="destiny-route"><i class="material-icons">pin_drop</i></span>
                </div>
            </div>
            <div style="margin: 0" class="row col-lg-12">
                <div class="col-lg-12">
                    <button style="margin-top: 0" class="btn btn-primary" id="add-new-stop">
                        Adicionar Ponto
                    </button>
                </div>

            </div>
            <hr/>
            <div style="margin: 0" class="row col-lg-12">
                <div class="custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input" id="allowCustomerStops">
                    <label class="custom-control-label" for="allowCustomerStops">Aceita parada do cliente</label>
                </div>
            </div>
            <hr/>
            <div class="col-lg-12 form-group">
                <span>Tipo de chamado</span>
                <select class="custom-select" id="tripType">
                    <option value="" disabled selected>Selecione um tipo de chamado</option>
                </select>
            </div>
            <div class="col-lg-12 center">
                <b>Preços</b>
            </div>
            <hr>
            <div class="col-lg-8 form-group">
                <span>Por pessoa</span>
                <input id="price-route" class="form-control">
            </div>
            <div class="objects-content">
                <hr>
                <b style="margin-left: 1vw">Objetos</b>
                <div style="margin: 0" class="row col-lg-12">
                    <select class="col-lg-6 custom-select custom-select-lg mb-3" id="object-route">
                    </select>
                    <div class="col-lg-6">
                        <button class="col-lg-4 btn btn-primary" id="add-new-object"><i class="material-icons">add</i>
                        </button>
                    </div>
                    <div class="col-lg-12" id="mount-list-object"
                         style="margin-left: -2.5%;padding-left: 0;margin-top: 1vw;"></div>
                </div>
            </div>
            <hr>
            <div class="col-lg-12">
                <button class="btn btn-success" id="save-route">SALVAR</button>
            </div>
        </div>
        <div class="col-lg-6">
            <div class="map-example"></div>
            <hr/>
            <div class="row">
                <div class="col-lg-6 form-group">
                    <span>Tempo estimado</span>
                    <input id="time-estimed-route" disabled class="form-control">
                </div>
                <div class="col-lg-6 form-group">
                    <span>&nbsp;<br/></span>
                    <button id="calculate-estimed-time" class="btn">Calcular Rota</button>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6">Pontos</div>
                <div class="col-lg-12" id="mount-list-stop"
                     style="background: whitesmoke"></div>
            </div>
        </div>
    </div>
</div>

<div class="modal" tabindex="-1" role="dialog" id="modal-origin-route">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Editar endereço de partida da rota</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="col-12 form-group">
                    <label>Nome do local</label>
                    <input id="name-address-origin" class="form-control">
                </div>
                <div class="col-12 form-group">
                    <label>Referência</label>
                    <input id="alias-address-origin" class="form-control">
                </div>
                <div class="col-12">
                    <label>Endereço</label>
                    <input type="text" id="place-origin" class="form-control">
                    <ul id="mount-places-by-origin" class="list-group list-address"></ul>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary save-origin" data-dismiss="modal">Salvar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal" tabindex="-1" role="dialog" id="modal-destiny-route">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Editar endereço de destino da rota</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="col-12 form-group">
                    <label>Nome do local</label>
                    <input id="name-address-destiny" class="form-control">
                </div>
                <div class="col-12 form-group">
                    <label>Referência</label>
                    <input id="alias-address-destiny" class="form-control">
                </div>
                <label>Endereço</label>
                <input type="text" id="place-destiny" class="form-control">
                <ul id="mount-places-by-destiny" class="list-group list-address"></ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary save-destiny" data-dismiss="modal">Salvar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal" tabindex="-1" role="dialog" id="modal-stop-route">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Cadastrar paradas adicionais na rota</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="col-12 form-group">
                    <label>Nome do local</label>
                    <input id='name-stop' class="form-control">
                </div>
                <div class="col-12 form-group">
                    <label>Referência</label>
                    <input id="reference-stop" class="form-control">
                </div>
                <div class="col-12 form-group">
                    <label>Tipo</label>
                    <select class="custom-select" id="pitStopType"></select>
                </div>
                <div class="col-12">
                    <label>Endereço</label>
                    <input type="text" id="place-waypoint" class="form-control">
                    <ul id="mount-places-by-waypoint" class="list-group list-address"></ul>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal" id="save-new-stop">Salvar</button>
            </div>
        </div>
    </div>
</div>