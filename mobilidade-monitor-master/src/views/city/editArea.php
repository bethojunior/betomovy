<div class="container-default-monitor">
    <div class="m-2">
        <div class="form-row">
            <div class="col-12 col-lg-4">
                <label for="cities">Escolha sua cidade</label>
                <select class="form-control" id="cities">
                    <option value="" selected disabled>Selecione uma cidade para editar</option>
                </select>
            </div>
            <div class="col-12 col-lg-4">
                <label for="shortName">Apelido da Cidade</label>
                <input type="text" class="form-control" id="shortName" >
            </div>
        </div>
        <div class="map"></div>
        <button type="button" class="btn btn-primary mt-2" id="updateCityArea" disabled>Atualizar</button>
    </div>
</div>