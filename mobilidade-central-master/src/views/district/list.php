<div class="container-main">
    <div class="dt-page">

        <div class="dt-header">
            <h1 class="dt-title">Taxas por Bairro</h1>
            <button type="button" class="dt-btn-add valueByNeighborhood"
                    data-toggle="modal" data-target="#AddValueByNeighborhood">
                Adicionar taxa
            </button>
        </div>

        <div class="dt-table-wrap">
            <table class="dt-table">
                <thead>
                    <tr>
                        <th>Bairro</th>
                        <th>Tipo de viagem</th>
                        <th>Valor</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="resultTable"></tbody>
            </table>
        </div>

        <div class="container-pagination dt-pagination"></div>

    </div>
</div>

<div class="modal fade" id="AddValueByNeighborhood" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Adicionar taxa por bairro</h5>
                <button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="dt-form-group">
                    <label class="dt-label" for="neighborhood">Bairro</label>
                    <select class="dt-select" id="neighborhood">
                        <option selected disabled value="0">Selecione o bairro</option>
                    </select>
                </div>
                <div class="dt-form-group">
                    <label class="dt-label" for="typeOfCall">Tipo de chamado</label>
                    <select class="dt-select" id="typeOfCall">
                        <option selected disabled value="0">Selecione o tipo</option>
                    </select>
                </div>
                <div class="dt-form-group">
                    <label class="dt-label" for="value">Valor</label>
                    <input type="number" class="dt-input input-value-price" id="value" placeholder="0,00">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="dt-btn-cancel" data-dismiss="modal">Cancelar</button>
                <button type="button" class="dt-btn-save save">Salvar</button>
            </div>
        </div>
    </div>
</div>
