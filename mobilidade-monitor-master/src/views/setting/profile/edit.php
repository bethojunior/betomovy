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
        <button type="button" class="btn btn-primary" id="addCity"
                data-toggle="modal" data-target="#modalAddCity">Adicionar Cidade</button>
        <ul class="col-12 m-2 mb-3 list-group" id="listCityRules"></ul>
        <h5 class="m-2">Permissões</h5>
        <ul class="col-12 m-2 list-group" id="listOptionRules"></ul>
        <button type="button" class="btn btn-primary ml-3" id="btnSaveRule">Salvar</button>
    </form>
</div>

<!-- Modal -->
<div class="modal fade" id="modalAddCity" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Cidade</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="selectCity">Selecione uma cidade</label>
                    <select class="form-control" id="selectCity"></select>
                </div>            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="btnAddCity">Adicionar</button>
            </div>
        </div>
    </div>
</div>