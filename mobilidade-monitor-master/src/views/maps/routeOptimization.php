<div class="container-default-monitor p-2">
    <div class="row">
        <div class="col-md-4 col-12">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="m-0">Google</h5>
                    </div>
                    <div>
                        <button type="button" class="btn btn-link btn-sm" data-toggle="tooltip" data-placement="top" title="Essa configuração faz com que as rotas traçadas no aplicativo priorizem tempo ou distância de acordo com a opção selecionada">
                            <span class="material-icons">
                                info
                            </span>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="form-group">
                        <label for="routeOptimizationGoogleSelect">Priorizar rota por</label>
                        <select class="form-control" id="routeOptimizationGoogleSelect">
                            <option value="time">Tempo</option>
                            <option value="distance">Distância</option>
                        </select>
                    </div>
                    <?php if ($this->hasPermission(GroupConst::MAPA, 'editar_otimizacao_rotas')) { ?>
                        <button type="button" class="btn btn-primary float-right" id="routeOptimizationGoogleHandle">Salvar</button>
                    <?php } ?>
                </div>
            </div>
        </div>
        <div class="col-md-4 col-12">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="m-0">Here</h5>
                    </div>
                    <div>
                        <button type="button" class="btn btn-link btn-sm" data-toggle="tooltip" data-placement="top" title="Essa configuração faz com que as rotas traçadas no aplicativo priorizem tempo ou distância de acordo com a opção selecionada">
                            <span class="material-icons">
                                info
                            </span>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="form-group">
                        <label for="routeOptimizationHereSelect">Priorizar rota por</label>
                        <select class="form-control" id="routeOptimizationHereSelect">
                            <option value="time">Tempo</option>
                            <option value="distance">Distância</option>
                        </select>
                    </div>
                    <?php if ($this->hasPermission(GroupConst::MAPA, 'editar_otimizacao_rotas')) { ?>
                        <button type="button" class="btn btn-primary float-right" id="routeOptimizationHereHandle">Salvar</button>
                    <?php } ?>
                </div>
            </div>
        </div>
        <div class="col-md-4 col-12">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="m-0">Mapbox</h5>
                    </div>
                    <div>
                        <button type="button" class="btn btn-link btn-sm" data-toggle="tooltip" data-placement="top" title="Essa configuração faz com que as rotas traçadas no aplicativo priorizem tempo ou distância de acordo com a opção selecionada">
                            <span class="material-icons">
                                info
                            </span>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="form-group">
                        <label for="routeOptimizationMapboxSelect">Priorizar rota por</label>
                        <select class="form-control" id="routeOptimizationMapboxSelect">
                            <option value="time">Tempo</option>
                            <option value="distance">Distância</option>
                        </select>
                    </div>
                    <?php if ($this->hasPermission(GroupConst::MAPA, 'editar_otimizacao_rotas')) { ?>
                        <button type="button" class="btn btn-primary float-right" id="routeOptimizationMapboxHandle">Salvar</button>
                    <?php } ?>
                </div>
            </div>
        </div>
    </div>
</div>