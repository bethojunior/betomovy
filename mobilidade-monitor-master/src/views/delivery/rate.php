<div class="container-default-monitor">
    <div class="m-2">
        <div class="d-flex justify-content-end mb-2">
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addRateModal">Adicionar
            </button>
        </div>
       <div class="table-responsive">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Alcance</th>
                    <th>Taxa cliente</th>
                    <th>Tempo</th>
                    <th>Taxa de retida entregador</th>
                    <th>Tipo de taxa retida</th>
                    <th></th>
                </tr>
            </thead>
            <tbody id="list"></tbody>
        </table>
       </div>
    </div>
</div>
<div class="modal fade" id="addRateModal" tabindex="-1" aria-labelledby="addRateModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <form id="addRateForm">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addRateModalLabel">Adicionar novo alcance</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="reachInput">Alcance(km)</label>
                                <input type="number" class="form-control" id="reachInput" required>
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label for="rateInput">Taxa</label>
                                <input type="tel" class="form-control" id="rateInput" required>
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label for="timeInput">Tempo(minutos)</label>
                                <input type="number" class="form-control" id="timeInput" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <div class="form-group">
                                <label for="reachInput">Taxa de serviço do entregador</label>
                                <input type="tel" class="form-control" id="deliveryServiceFee" required>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="d-flex flex-column mt-5">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="deliveryServiceFeeType"
                                           id="deliveryServiceFeeType1" value="$" checked>
                                    <label class="form-check-label" for="deliveryServiceFeeType1">R$</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="deliveryServiceFeeType"
                                           id="deliveryServiceFeeType2" value="%">
                                    <label class="form-check-label" for="deliveryServiceFeeType2">%</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar</button>
                </div>
            </div>
        </form>
    </div>
</div>