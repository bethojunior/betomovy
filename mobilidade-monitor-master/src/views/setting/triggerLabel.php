<div class='container-trigger container-default-monitor'>
    <div class="container-header">
      <h5>Gatilhos Programados</h5>
      <button class="btn btn-primary btn-add-trigger">Novo Gatilho</button>
    </div>

    <div id='containerModality' class='container-list-modality'>
        <div id='list-trip-city'>
            <div class="modal fade modal-add-trigger">
                <div class="modal-dialog ">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Novo Gatilho</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <h5 id="title-add-trigger">Modalidade do motorista</h5>
                        <select id='modality' class="form-control select-modality">
                            <option id="select-option" value="" >Selecionar</option>
                        </select>

                        <h5 id="title-add-trigger">Detalhes</h5>
                        <div class="form-group">
                            <label for="inputRate">Taxa</label>
                            <input name="rate" type="tel" class="form-control rates-input input-width" id="inputRate">
                        </div>
                        <div class="d-flex mt-2">
                            <div class="form-group col-md-6">
                                <label for="startDate">Válido de</label>
                                <input class='form-control time' step="1" type="time" id="startDate">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="endDate">Até</label>
                                <input class='form-control time' step="1" type="time" id="endDate">
                            </div>
                        </div>
                        <h5 id="title-add-trigger">Dias válidos</h5>
                        <div class="checkbox-days">
                            <div class="date-week row">
                                <div class="form-check">
                                    <input class="form-check-input all-day-week" type="checkbox" name="days-of-week" value="todos" id="all">
                                    <label class="form-check-label" for="all">
                                        Todos
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input days-week" type="checkbox" name="days-of-week" value="1" id="day0">
                                    <label class="form-check-label" for="day0">
                                        Domingo
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input days-week" type="checkbox" name="days-of-week" value="2" id="day1">
                                    <label class="form-check-label" for="day1">
                                        Segunda
                                    </label>
                                </div>

                                <div class="form-check">
                                    <input class="form-check-input days-week" type="checkbox" name="days-of-week" value="3" id="day2">
                                    <label class="form-check-label" for="day2">
                                        Terça
                                    </label>
                                </div>

                                <div class="form-check">
                                    <input class="form-check-input days-week" type="checkbox" name="days-of-week" value="4" id="day3">
                                    <label class="form-check-label" for="day3">
                                        Quarta
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input days-week" type="checkbox" name="days-of-week" value="5" id="day4">
                                    <label class="form-check-label" for="day4">
                                        Quinta
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input days-week" type="checkbox" name="days-of-week" value="6" id="day5">
                                    <label class="form-check-label" for="day5">
                                        Sexta
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input days-week" type="checkbox" name="days-of-week" value="7" id="day6">
                                    <label class="form-check-label" for="day6">
                                        Sábado
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary btn-save-trigger">Salvar</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>

        <div class="container-list-trigger">
            <table class="table table-striped table-sm  mt-2 table-responsive">
                <thead>
                  <tr>
                    <td> Tempo de atuação </td>
                    <td> Período </td>
                    <td> Tipo </td>
                    <td> Dinâmica </td>
                    <td>Status</td>
                    <td>Editar</td>
                    <td>Excluir</td>
                  </tr>
                </thead>
                <tbody id='listTrigger'></tbody>
            </table>
            <div class="container-footer"></div>
        </div>

        <div class="modal fade modal-edit-trigger" id="triggerModalEdit" tabindex="-1" role="dialog" aria-labelledby="triggerModalEditLabel" aria-hidden="true">
            <div class="modal-dialog ">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Editar Gatilho</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <h5 id="title-add-trigger">Modalidade do motorista</h5>
                    <select id='modalityEdit' class="form-control select-modality">
                        <option id="select-option-edit" value="" >Selecionar</option>
                    </select>

                    <h5 id="title-add-trigger-edit">Detalhes</h5>
                    <div class="form-group">
                        <label for="inputRate">Taxa</label>
                        <input name="rate" type="tel" class="form-control rates-input input-width" id="inputRateEdit">
                    </div>
                    <div class="d-flex mt-2">
                        <div class="form-group col-md-6">
                            <label for="startDate">Válido de</label>
                            <input class='form-control time' step="1" type="time" id="startDateEdit">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="endDate">Até</label>
                            <input class='form-control time' step="1" type="time" id="endDateEdit">
                        </div>
                    </div>
                    <h5 id="title-add-trigger-edit">Dias válidos</h5>
                    <div class="radio-days ml-2">
                        <div class="date-week row">
                            <div class="form-check">
                                <input class="form-check-input days-week-edit" type="radio" name="days-of-week-edit" value="1" id="dayEdit0">
                                <label class="form-check-label" for="dayEdit0">
                                    Domingo
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input days-week-edit" type="radio" name="days-of-week-edit" value="2" id="dayEdit1">
                                <label class="form-check-label" for="dayEdit1">
                                    Segunda
                                </label>
                            </div>

                            <div class="form-check">
                                <input class="form-check-input days-week-edit" type="radio" name="days-of-week-edit" value="3" id="dayEdit2">
                                <label class="form-check-label" for="dayEdit2">
                                    Terça
                                </label>
                            </div>

                            <div class="form-check">
                                <input class="form-check-input days-week-edit" type="radio" name="days-of-week-edit" value="4" id="dayEdit3">
                                <label class="form-check-label" for="dayEdit3">
                                    Quarta
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input days-week-edit" type="radio" name="days-of-week-edit" value="5" id="dayEdit4">
                                <label class="form-check-label" for="dayEdit4">
                                    Quinta
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input days-week-edit" type="radio" name="days-of-week-edit" value="6" id="dayEdit5">
                                <label class="form-check-label" for="dayEdit5">
                                    Sexta
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input days-week-edit" type="radio" name="days-of-week-edit" value="7" id="dayEdit6">
                                <label class="form-check-label" for="dayEdit6">
                                    Sábado
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary btn-update-trigger" data-dismiss="modal" data-id-trigger="">Salvar</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>