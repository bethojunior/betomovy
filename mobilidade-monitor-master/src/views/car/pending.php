<div class="container-default-monitor">
    <button type="button" class="btn btn-primary btn-list-car-pending mb-1 ml-2 mt-1">Listar todos</button>
    <div style='display: flex; justify-content: center'>
        <h5 class="dont-prepaid-yet mt-2"></h5>
    </div>
    <div class="container">
        <div class="table-responsive">
            <table class="table">
                <thead>
                <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Marca</th>
                    <th scope="col">Modelo</th>
                    <th scope="col">Placa</th>
                    <th scope="col">Cor</th>
                    <th scope="col">Ano</th>
                    <th scope="col">Renavam</th>
                    <th scope="col">Confirma</th>
                    <th scope="col">Rejeitar</th>
                </tr>
                </thead>
                <tbody id="listPendingCars">
                </tbody>
            </table>
        </div>
        <div class="d-flex justify-content-center">
            <button id="prevPage" class="btn btn-info">Voltar</button>
            <button id="nextPage" class="btn btn-info">Próximo</button>
        </div>
    </div>
</div>
