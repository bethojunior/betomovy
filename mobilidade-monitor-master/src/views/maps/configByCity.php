<div class="container-default-monitor">
    <div class="m-2">
        <!--        <div class="accordion" id="accordionMapService"></div>-->
        <?php if ($this->hasPermission(GroupConst::MAPA, 'adicionar_conf_credenciais_cidade')) { ?>
            <button type="button" class="btn btn-primary mb-2" data-toggle="modal" data-target="#addMapServiceModal">
                Adicionar Credencial
            </button>
        <?php } ?>

        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Credenciais</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody id="mapServiceList"></tbody>
            </table>
        </div>
    </div>

    <div class="modal fade" id="addMapServiceModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <form action="POST" class="form-save-key">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Adicionar credencial</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="mapServiceTypeSelect">Selecione o tipo de mapa</label>
                            <select class="form-control" id="mapServiceTypeSelect"></select>
                        </div>
                        <div id="contentMapService"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary" id="btnSubmitMapService" hidden>Salvar</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>