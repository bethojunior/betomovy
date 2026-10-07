<div class="container-default-monitor">
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#financialDriver">
        Filtrar
    </button>
    <div class="container-financial-driver">
        <div><hr></div>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th scope="col">Motorista</th>
                    <th scope="col">Qtd de viagens</th>
                    <th scope="col">Cartão</th>
                    <th scope="col">Voucher</th>
                    <th scope="col">Dinheiro</th>
                    <th scope="col">Cartão no Carro</th>
                    <th scope="col">Taxímetro</th>
                    <th scope="col">Taxa por forma de pagamento</th>
                    <th scope="col">Taxas App</th>
                    <th scope="col">Outras Taxas</th>
                    <th scope="col">Valor líquido do motorista</th>
                    <th>Taxas</th>
                </tr>
                </thead>
                <tbody id="mount-here-report">
                </tbody>
            </table>
        </div>
    </div>
</div>

<div class="modal fade" id="financialDriver">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="titleFilterReport">Filtros para o relatório</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <span>Motorista</span>
                    <select hidden id="mount-drivers"></select>
                </div>
                <div class="form-group">
                    <span>Data inicial</span>
                    <input id="date-start" class="form-control" type="date">
                </div>
                <div class="form-group">
                    <span>Data final</span>
                    <input id="date-end" class="form-control" type="date">
                </div>
                <div class="form-group">
                    <span>Cidade</span>
                    <select class="form-control" id="citySelect">
                        <option  value="" disabled selected>Selecione a cidade</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" id="btn-do-filter" class="btn btn-primary">Buscar</button>
            </div>
        </div>
    </div>
</div>