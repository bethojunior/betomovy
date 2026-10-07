<div class="container-default-monitor p-2">
    <ul class="list-group">
        <li class="list-group-item list-group-item-action active">
            <div class="d-flex justify-content-center">
                <h5 class="m-0">Serviços de mapa</h5>
            </div>
        </li>
        <li class="list-group-item">
            <div class="d-flex justify-content-between">
                <p class="m-0 p-0">API de serviço global ativo</p>
                <label class="m-0 p-0" id="service_global_active">-</label>
            </div>
        </li>
        <li class="list-group-item">
            <div class="d-flex justify-content-between">
                <p class="m-0 p-0">Customização de serviços de mapa</p>
                <div class="form-check">
                    <a href="mapSetting/configMaps#enable_custom_mode_of_map_services" id="enable_custom_mode_of_map_services" target="_blank"></a>
                </div>
            </div>
        </li>
        <li class="list-group-item">
            <div class="d-flex justify-content-between">
                <p class="m-0 p-0">Serviço de buscar locais (Searching)</p>
                <label class="m-0 p-0" id="service_place">-</label>
            </div>
        </li>
        <li class="list-group-item">
            <div class="d-flex justify-content-between">
                <p class="m-0 p-0">Serviço de detalhamento do local (Geocoding)</p>
                <label class="m-0 p-0" id="service_geocode">-</label>
            </div>
        </li>
        <li class="list-group-item">
            <div class="d-flex justify-content-between">
                <p class="m-0 p-0">Serviço de rota (Direction)</p>
                <label class="m-0 p-0" id="service_direction">-</label>
            </div>
        </li>
        <li class="list-group-item">
            <div class="d-flex justify-content-between">
                <p class="m-0 p-0">Serviço de detalhamento da rota (Direction)</p>
                <label class="m-0 p-0" id="service_direction_estimate">-</label>
            </div>
        </li>
    </ul>
    <hr/>
    <h4 class="text-center mb-4">Prioridades de serviço - para mapa alternativo</h4>
    <div class="row m-0">
        <div class="col">
            <div class="card">
                <div class="card-header">
                    Busca locais - Searching
                </div>
                <div class="card-body">
                    <p class="card-text" id="prioritySearching">-</p>
                    <button type="button" id="changePrioritySearching" class="btn btn-primary"><span
                                class="material-icons">sync</span></button>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card">
                <div class="card-header">
                    Rotas - Directions
                </div>
                <div class="card-body">
                    <p class="card-text" id="priorityDirection">-</p>
                    <button type="button" id="changePriorityDirection" class="btn btn-primary"><span
                                class="material-icons">sync</span></button>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card">
                <div class="card-header">
                    Detalhe locais - Geocoding
                </div>
                <div class="card-body">
                    <p class="card-text" id="priorityGeocoding">-</p>
                    <button type="button" id="changePriorityGeocoding" class="btn btn-primary"><span
                                class="material-icons">sync</span></button>
                </div>
            </div>
        </div>
    </div>
</div>