<div class="container-default-monitor">
    <div class="container-list-trip" id="readScrollThisPage">
        <button class="material-icons" id="openFilterTrip">
            tune
        </button>
            <ul id="listTrips" class="list-trips"></ul>
            <div class="d-flex justify-content-center" id="containerShowMoreTrip">
                <button type="button" class="btn btn-primary" id="btnShowMoreTrip" hidden>Mostrar mais</button>
            </div>

        <div class="modal" tabindex="-1" id="modal-filter">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Filtro de Viagem</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="position-relative">
                            <label>Cliente</label>
                            <input class="form-control" id="filterClient" autocomplete="off">
                        </div>
                        <div class="position-relative">
                            <label>Motorista</label>
                            <input class="form-control" id="filterDriver" autocomplete="off">
                        </div>

                        <label>Status</label>
                        <select class="form-control" id="filterStatus">
                            <option value="">Todas</option>
                        </select>

                        <label>Data entre</label>
                        <div class="date-container">
                            <input type="date" class="form-control" id="filterDateStart">
                            <p>e</p>
                            <input type="date" class="form-control" id="filterDateEnd">
                        </div>

                        <input type="checkbox" id="filterHeader">
                        <label id="label-header" for="filterHeader">Com cabeçalho de informações gerais</label>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" id="clearFilter">Limpar
                            Filtro
                        </button>
                        <button type="button" class="btn btn-primary" id="filterTrip">Pesquisar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>