<div class="container-default-monitor">
    <form class="container">
        <div class="form-group row">
            <div class="col-md-5">
                <label for="selectManager"><h3>Gestor</h3></label>
                <select hidden id="selectManager"></select>
            </div>
        </div>
        <hr>
        <div class="form-group row-mot">
            <label>Motorista</label>
            <div class="driver">
                <div class="col-md-2">
                    <label for="valueManager">Valor</label>
                    <input type="text" class="form-control" id="valueManagerMot">
                </div>
                <div class="col-md-2 mot">
                    <p>Tipo</p>
                    <div class="mot-row">
                        <div class="col-4 form-check mot">
                            <input class="form-check-input" type="radio" name="typeValueMot" id="typeMoney"
                                   value="$" checked>
                            <label class="form-check-label" for="typeMoney">$</label>
                        </div>
                        <div class="col-4 form-check mot">
                            <input class="form-check-input" type="radio" name="typeValueMot" id="typePercent"
                                   value="%">
                            <label class="form-check-label" for="typePercent">%</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <div class="form-group row-cli">
            <label>Cliente Comissionado</label>
            <div class="client">
                <div class="col-md-2">
                    <label for="valueManager">Valor</label>
                    <input type="text" class="form-control" id="valueManagerCli">
                </div>
                <div class="col-md-2 cli">
                    <p>Tipo</p>
                    <div class="cli-row">
                        <div class="col-4 form-check cli">
                            <input class="form-check-input" type="radio" name="typeValueCli" id="typeMoney"
                                   value="$" checked>
                            <label class="form-check-label" for="typeMoney">$</label>
                        </div>
                        <div class="col-4 form-check cli">
                            <input class="form-check-input" type="radio" name="typeValueCli" id="typePercent"
                                   value="%">
                            <label class="form-check-label" for="typePercent">%</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-group row">
            <div class="col-md-1">
                <button type="button" id="btnSaveManager" class="btn btn-primary">Salvar</button>
            </div>
        </div>
    </form>
</div>