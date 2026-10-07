<div class="container-default-monitor">
    <button type="button" class="btn btn-outline-primary btn-sm mb-2" data-toggle="modal"
            data-target="#modalAddMilitaryForce">
        Adicionar Órgão Militar
    </button>
    <hr/>
    <div id="listMilitaryForce" class="d-flex flex-wrap">
    </div>
</div>

<div class="modal fade" id="modalAddMilitaryForce" tabindex="-1" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <form id="formAddMilitaryForce">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Adicionar Órgão Militar</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="namePatentLabel">Nome do Òrgão</label>
                        <input required type="text" class="form-control" id="nameÓrgão"
                               placeholder="Exército">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary btn-add-military-force">Adicionar</button>
                </div>
        </form>
    </div>
</div>
</div>