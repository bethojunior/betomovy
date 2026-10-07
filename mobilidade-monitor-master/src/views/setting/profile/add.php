<div class="row">
    <form class="col-12 p-2">
        <div class="form-group col-6">
            <label for="nameRule">Descrição do perfil</label>
            <input type="text" class="form-control" id="nameRule">
        </div>
        <div class="form-check col-6 m-2">
            <input class="form-check-input" type="checkbox" value="" id="isSupport">
            <label class="form-check-label" for="isSupport">
                Ativa perfil para suporte
            </label>
        </div>
        <h5 class="m-2">Cidades</h5>
        <ul class="col-12 m-2 mb-3 list-group" id="listCityRules"></ul>
        <h5 class="m-2">Permissões</h5>
        <ul class="col-12 m-2 list-group" id="listOptionRules"></ul>
        <button type="button" class="btn btn-primary ml-3" id="btnSaveRule">Salvar</button>
    </form>
</div>