<div class="container-default-monitor">
    <div class="container">
        <form class="form-inline">
            <div class="form-group mx-sm-3 mb-2">
                <select class="form-control" id="typeSelect">
                    <option value="" disabled selected>Selecione um tipo de mapa</option>
                    <option value="google">Google</option>
                    <option value="here">Here</option>
                    <option value="mapbox">Mapbox</option>
                    <option value="seumilto">SeuMilto Maps</option>
                </select>
            </div>
            <button type="button" class="btn btn-primary mb-2 btn-sm" id="btnCheck">Testar</button>
        </form>
        <hr />
        <ul class="list-group" id="containerTest" hidden>
            <li class="list-group-item">
                <div class="d-flex justify-content-between">
                    <span>Tipo</span>
                    <span id="nameType">Google</span>
                </div>
            </li>
            <li class="list-group-item">
                <div class="d-flex justify-content-between">
                    <span>Locais (Searching)</span>
                    <div id="statusPlace"></div>
                </div>
            </li>
            <li class="list-group-item">
                <div class="d-flex justify-content-between">
                    <span>Rotas (Directions)</span>
                    <div id="statusDirection"></div>
                </div>
            </li>
            <li class="list-group-item">
                <div class="d-flex justify-content-between">
                    <span>Detalhe locais (Geocoding)</span>
                    <div id="statusGeocoding"></div>
                </div>
            </li>
        </ul>
    </div>
</div>