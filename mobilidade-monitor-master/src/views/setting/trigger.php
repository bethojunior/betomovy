<div class='container-default-monitor'>
    <div class="container">
        <div>
            <button class='btn btn-primary send-trigger mb-2 float-right' data-toggle="modal"
                    data-target="#modalAddTrigger">Novo Gatilho
            </button>
        </div>
        <div id='containerModality' class='container-list-modality'>
            <table class="table table-responsive-lg table-striped">
                <thead>
                <tr>
                    <td>Inicio</td>
                    <td>Final</td>
                    <td>Tipo</td>
                    <td>Dinâmica</td>
                    <td>Etiqueta</td>
                    <td>Editar</td>
                    <td>Excluir</td>
                </tr>
                </thead>
                <tbody id='listTrigger'></tbody>
            </table>
        </div>
    </div>
</div>

<div class="modal fade" id="modalAddTrigger" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog" role="document">
        <form>
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Adicionar um novo gatilho</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="selectTypeTrip">Tipo de viagem</label>
                        <select class="form-control" id="selectTypeTrip"></select>
                    </div>
                    <div class="form-row">
                        <div class="col form-group">
                            <label for="exampleFormControlSelect1">Taxa (ex.: 1,5 = 50% a mais)</label>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1">
                                    <i class="material-icons">trending_up</i>
                                </span>
                                </div>
                                <input type="text" class="form-control rates-input" id="rate">
                            </div>
                        </div>
                        <div class="col form-group">
                            <label for="exampleFormControlSelect1">Etiqueta que cliente verá</label>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text option-tag-visibility" id="basic-addon1"
                                          style="cursor: pointer"><i class="material-icons">visibility</i></span>
                                </div>
                                <input type="text" class="form-control" id="tagTriggerVisibility" value="0.0x" disabled>
                            </div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col form-group">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                <span class="input-group-text">
                                   De
                                </span>
                                </div>
                                <input type="datetime-local" class="form-control time" id="startDate">
                            </div>
                        </div>
                        <div class="col form-group">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                <span class="input-group-text">
                                    Até
                                </span>
                                </div>
                                <input type="datetime-local" class="form-control time" id="endDate">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="add-trigger">Salvar</button>
                </div>
            </div>
        </form>
    </div>
</div>

<div class="modal fade" id="modalAddTriggerEdit" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog" role="document">
        <form>
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabelEdit">Editar Gatilho</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="selectTypeTripEdit">Tipo de viagem</label>
                        <select class="form-control" id="selectTypeTripEdit"></select>
                    </div>
                    <div class="form-row">
                        <div class="col form-group">
                            <label for="exampleFormControlSelect1">Taxa (ex.: 1,5 = 50% a mais)</label>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1-edit">
                                    <i class="material-icons">trending_up</i>
                                </span>
                                </div>
                                <input type="text" class="form-control rates-input" id="rateEdit">
                            </div>
                        </div>
                        <div class="col form-group">
                            <label for="exampleFormControlSelect1">Etiqueta que cliente verá</label>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text option-tag-visibility" id="basic-addon1-edit"
                                          style="cursor: pointer"><i class="material-icons">visibility</i></span>
                                </div>
                                <input type="text" class="form-control" id="tagTriggerVisibilityEdit" value="0.0x" disabled>
                            </div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col form-group">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                <span class="input-group-text">
                                   De
                                </span>
                                </div>
                                <input type="datetime-local" class="form-control time" id="startDateEdit">
                            </div>
                        </div>
                        <div class="col form-group">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                <span class="input-group-text">
                                    Até
                                </span>
                                </div>
                                <input type="datetime-local" class="form-control time" id="endDateEdit">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancel-trigger-edit" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="add-trigger-edit">Salvar</button>
                </div>
            </div>
        </form>
    </div>
</div>