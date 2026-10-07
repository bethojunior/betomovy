<div class="container-main">
    <div class="container">
        <form>
            <div class="row form-group">
                <div class="col-sm-3">
                    <label for="tripTypeId">Tipo de tarifa</label>
                    <select class="form-control" id="tripTypeId">
                        <option value="" disabled selected>Selecione o tipo de tarifa</option>
                    </select>
                </div>
            </div>

            <div class="row form-group">
                <div class="col-sm-3">
                    <label for="tag">Descrição(Tag)</label>
                    <input type="text" class="form-control" maxlength="15" id="tag">
                </div>
                <div class="col-sm-1">
                    <label for="color">Cor</label>
                    <input type="color" class="form-control" id="color">
                </div>
            </div>
            <div class="row form-group">
                <div class="col-sm-2">
                    <label for="min_price">Preço Minimo</label>
                    <input type="tel" class="form-control input-value-price" id="min_price">
                </div>
                <div class="col-sm-2">
                    <label for="base_price">Preço Base</label>
                    <input type="tel" class="form-control input-value-price" id="base_price">
                </div>
                <div class="col-sm-2">
                    <label for="km_price">Preço KM</label>
                    <input type="tel" class="form-control input-value-price" id="km_price">
                </div>
                <div class="col-sm-2">
                    <label for="minute_price">Preço Minuto</label>
                    <input type="tel" class="form-control input-value-price" id="minute_price">
                </div>
            </div>
            <div class="row form-group">
                <div class="col-sm-2">
                    <label for="tax_price">Taxa 1</label>
                    <input type="tel" class="form-control input-value-price" id="tax_price">
                </div>
                <div class="col-sm-2">
                    <label for="another_fee">Taxa 2</label>
                    <input type="tel" class="form-control input-value-price" id="another_fee">
                </div>
                <div class="col-sm-2">
                    <label for="waypoint_price">Taxa por Parada</label>
                    <input type="tel" class="form-control input-value-price" id="waypoint_price">
                </div>
            </div>
            <hr>
            <div class="row">
                <button type="button" class="col-sm-2 btn btn-primary" id="saveRate">Salvar</button>
            </div>
        </form>
    </div>
</div>