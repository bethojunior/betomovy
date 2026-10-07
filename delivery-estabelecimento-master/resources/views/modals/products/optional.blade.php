<div id="modal-optionals" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Adicionar opcionais</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form class="form-group row">
                    <div class="col-lg-6">
                        <label>Nome</label>
                        <select style="height: auto" class="js-example-basic-single col-lg-12" id="optional-selected" name="state">
                            <option value="Borda recheada">Borda recheada</option>
                            <option value="Gergelhin">Gergelhin</option>
                        </select>
                    </div>
                    <div class="col form-group">
                        <label for="value-this-optional">Valor</label>
                        <input class="form-control" id="value-this-optional" type="tel">
                    </div>
{{--                    <div class="col-lg-12">--}}
{{--                        <div class="custom-control custom-switch">--}}
{{--                            <input type="checkbox" class="custom-control-input" id="customSwitch1">--}}
{{--                            <label class="custom-control-label" for="customSwitch1">Obrigatório</label>--}}
{{--                        </div>--}}
{{--                    </div>--}}
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="save-optional">Salvar</button>
            </div>
        </div>
    </div>
</div>
