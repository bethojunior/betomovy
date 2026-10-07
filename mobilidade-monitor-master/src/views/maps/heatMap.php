<div class="container-default-monitor">
    <div class="p-2">
        <div class="row">
            <div class="form-group col-4">
                <select class="form-control" id="typeHeatMap">
                    <option value="customer" selected>Áreas de cliente</option>
                    <option value="lastDynamicsPlaces">Últimas dinâmicas do dia</option>
                    <option value="expensiveDynamicsPlaces">Dinâmicas mais caras do dia</option>
                    <option value="placesMoreTripsDayAgo">Lugares com mais viagens no dia anterior</option>
                    <option value="placesMoreTripsWeekAgo">Lugares com mais viagens há uma semana</option>
                </select>
            </div>
        </div>
        <div id="map" class="map-container"></div>
    </div>
</div>