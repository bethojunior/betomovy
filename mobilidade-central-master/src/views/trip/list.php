<div class="container-main">
    <div class="tl-page">

        <div class="tl-header">
            <h1 class="tl-title">Viagens</h1>
        </div>

        <div class="tl-filters">
            <select class="tl-select" id="tripStatus">
                <option value="">Todos os status</option>
                <option value="searching">Buscando motorista</option>
                <option value="searching_favorite">Buscando motorista favorito</option>
                <option value="pre_accepted">Aceita por motorista em viagem</option>
                <option value="accepted">Aceita</option>
                <option value="boarding">Embarcando</option>
                <option value="in_progress">Em viagem</option>
                <option value="finished">Finalizada</option>
                <option value="canceled">Cancelada</option>
                <option value="payment_refused">Pagamento recusado</option>
                <option value="not_answered">Não atendida</option>
                <option value="back_off">Desistiu</option>
                <option value="scheduled">Agendada</option>
            </select>
            <input type="text" class="tl-text-input" id="filterCustomerName" placeholder="Nome do cliente">
            <select class="tl-select" id="filterDriverId">
                <option value="">Todos os motoristas</option>
            </select>
            <div class="tl-date-range">
                <input type="date" class="tl-date-input" id="dateStart">
                <span class="tl-date-sep">—</span>
                <input type="date" class="tl-date-input" id="dateEnd">
            </div>
            <button type="button" class="tl-btn-filter" id="btnFilterTrip">Filtrar</button>
        </div>

        <ul class="list-trips"></ul>
        <div class="container-pagination tl-pagination"></div>

    </div>
</div>
