<div class="modal-find-customer">
    <div class="mfc-card">

        <div class="mfc-header">
            <span class="mfc-title">Procurar cliente</span>
            <button type="button" class="mfc-close" id="closeModalFindCustomer" aria-label="Fechar">
                <i class="material-icons">close</i>
            </button>
        </div>

        <div class="mfc-search-row">
            <div class="mfc-search-wrap">
                <i class="material-icons mfc-search-icon">search</i>
                <input type="text" class="mfc-search-input" id="findCustomerBy"
                       autocomplete="off" placeholder="Buscar...">
            </div>
            <button type="button" class="mfc-btn-new" id="openModalCreateCustomer">
                + Novo cliente
            </button>
        </div>

        <div class="mfc-filters">
            <label class="mfc-pill">
                <input type="radio" value="name" name="find-customer-by" id="nameFind" checked>
                <span>Nome</span>
            </label>
            <label class="mfc-pill">
                <input type="radio" value="phone" name="find-customer-by" id="phoneFind">
                <span>Telefone</span>
            </label>
        </div>

        <ul id="listCustomer" class="mfc-list"></ul>

    </div>
</div>
